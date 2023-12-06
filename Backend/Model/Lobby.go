package model

import (
	"fmt"
	"slices"

	"github.com/gorilla/websocket"
)

type Lobby struct {
	Rooms          []Room
	PlayersInLobby map[string]*websocket.Conn
	NextRoomID     int
}

func (l *Lobby) JoinLobby(playerID string, conn *websocket.Conn) {

	var username string

	for {
		var msg map[string]interface{}
		err := conn.ReadJSON(&msg)
		loginError := false

		if err != nil {
			fmt.Println(err)
			conn.Close()
			for pID := range l.PlayersInLobby {
				if pID == username {
					delete(l.PlayersInLobby, username)
					broadcastMessageToLobby[LobbyUpdate](LobbyUpdate{CmdType: "LobbyUpdate", Lobby: *l}, l.PlayersInLobby)
					return
				}
			}
			for _, r := range l.Rooms {
				for pID := range r.PlayerConnections {
					if pID == username {
						delete(r.PlayerConnections, username)
						broadcastMessageToRoom[RoomUpdate](RoomUpdate{CmdType: "RoomUpdate", Room: r}, r)
						broadcastMessageToLobby[LobbyUpdate](LobbyUpdate{CmdType: "LobbyUpdate", Lobby: *l}, l.PlayersInLobby)
						return
					}
				}
			}
			return
		}

		cmdType := msg["cmdType"]

		if cmdType == "connect" {

			uMsg := msg["username"].(string)
			username = string(uMsg)

			if _, ok := l.PlayersInLobby[username]; ok {
				conn.WriteJSON(LoginError{CmdType: "loginError"})
				continue
			}

			for _, r := range l.Rooms {
				if _, ok := r.PlayerConnections[username]; ok {
					conn.WriteJSON(LoginError{CmdType: "loginError"})
					loginError = true
					break
				}
			}

			if loginError {
				continue
			}

			l.PlayersInLobby[username] = conn

			conn.WriteJSON(ConnectCommand{CmdType: "connectionResponse", Lobby: *l, OurPlayerID: username})
			for pid, c := range l.PlayersInLobby {
				if pid != username {
					fmt.Println(l.Rooms)
					c.WriteJSON(LobbyUpdate{CmdType: "LobbyUpdate", Lobby: *l})
				}
			}
		}

		if cmdType == "joinRoom" {
			roomID := msg["roomID"]
			var pass string = msg["password"].(string)
			l.joinRoom(username, int(roomID.(float64)), conn, pass)

		}
		if cmdType == "createRoom" {
			var password string = msg["password"].(string)
			l.createNewRoom(username, l.NextRoomID, conn, password)
			l.sendNewRoomMessage(l.NextRoomID)
			l.NextRoomID += 1
		}
		if cmdType == "leaveRoom" {
			roomID := msg["roomID"]
			l.leaveRoom(username, int(roomID.(float64)))
			l.sendLeaveRoomMessage(int(roomID.(float64)))
		}
		if cmdType == "deleteRoom" {
			roomID := msg["roomID"]
			l.deleteRoom(int(roomID.(float64)))
		}
		if cmdType == "sendMessage" {
			roomID := msg["roomID"]
			message := msg["message"]
			l.sendMessage(username, message.(string), int(roomID.(float64)))
			l.sendMessageReceived(int(roomID.(float64)))
		}

	}
}

func (l *Lobby) sendMessageReceived(roomId int) {
	idx := l.findRoomIndex(roomId)
	room := l.Rooms[idx]
	fmt.Printf("sending room update with %v as the room", room)
	msg := RoomUpdate{CmdType: "RoomUpdate", Room: room}
	broadcastMessageToRoom[RoomUpdate](msg, room)
}

func (l *Lobby) sendMessage(playerID string, message string, roomID int) {
	idx := l.findRoomIndex(roomID)
	room := &l.Rooms[idx]
	room.Messages = append(room.Messages, []string{playerID, message})
}

func (l *Lobby) createNewRoom(playerID string, roomID int, conn *websocket.Conn, password string) error {
	l.Rooms = append(l.Rooms, Room{Id: roomID, PlayerConnections: make(map[string]*websocket.Conn), Messages: [][]string{}, Owner: playerID, Password: password})
	return nil
}

func (l *Lobby) joinRoom(playerID string, roomID int, conn *websocket.Conn, pass string) {
	idx := l.findRoomIndex(roomID)
	room := l.Rooms[idx]
	if room.Password == pass {
		l.Rooms[idx].PlayerConnections[playerID] = conn
		delete(l.PlayersInLobby, playerID)
		l.sendJoinedRoomMessage(roomID)
	} else {
		conn.WriteJSON(JoinRoomError{CmdType: "joinRoomError"})
	}
}

func (l *Lobby) deleteRoom(roomID int) {
	idx := l.findRoomIndex(roomID)
	conns := l.Rooms[idx].PlayerConnections
	for k, v := range conns {
		l.PlayersInLobby[k] = v
	}
	l.Rooms = append(l.Rooms[:idx], l.Rooms[idx+1:]...)
	l.sendDeleteRoomMessage(roomID)

}

func (l *Lobby) sendDeleteRoomMessage(roomID int) {
	broadcastMessageToLobby[LobbyUpdate](LobbyUpdate{CmdType: "LobbyUpdate", Lobby: *l}, l.PlayersInLobby)
}

func (l *Lobby) leaveRoom(playerID string, roomID int) {
	idx := l.findRoomIndex(roomID)
	conn := l.Rooms[idx].PlayerConnections[playerID]
	delete(l.Rooms[idx].PlayerConnections, playerID)
	l.PlayersInLobby[playerID] = conn
}

func (l *Lobby) findRoomIndex(roomID int) int {
	return slices.IndexFunc(l.Rooms, func(r Room) bool {
		return r.Id == roomID
	})
}

func (l *Lobby) sendNewRoomMessage(roomID int) {
	idx := l.findRoomIndex(roomID)
	room := l.Rooms[idx]
	fmt.Printf("sending room %v", room)
	cmd := NewRoomCommand{CmdType: "NewRoom", Room: room}
	broadcastMessageToLobby[NewRoomCommand](cmd, l.PlayersInLobby)
}

func (l *Lobby) sendJoinedRoomMessage(roomID int) {
	idx := l.findRoomIndex(roomID)
	room := l.Rooms[idx]
	cmd1 := RoomUpdate{CmdType: "RoomUpdate", Room: room}
	cmd2 := LobbyUpdate{CmdType: "LobbyUpdate", Lobby: *l}
	broadcastMessageToRoom[RoomUpdate](cmd1, room)
	broadcastMessageToLobby[LobbyUpdate](cmd2, l.PlayersInLobby)
}

func (l *Lobby) sendLeaveRoomMessage(roomID int) {
	idx := l.findRoomIndex(roomID)
	room := l.Rooms[idx]
	broadcastMessageToRoom[RoomUpdate](RoomUpdate{CmdType: "RoomUpdate", Room: room}, room)
	broadcastMessageToLobby[LobbyUpdate](LobbyUpdate{CmdType: "LobbyUpdate", Lobby: *l}, l.PlayersInLobby)
}

func broadcastMessageToLobby[T Command](cmd T, conns map[string]*websocket.Conn) {
	for _, conn := range conns {
		conn.WriteJSON(cmd)
	}
}

func broadcastMessageToRoom[T Command](cmd T, room Room) {
	for _, conn := range room.PlayerConnections {
		conn.WriteJSON(cmd)
	}
}
