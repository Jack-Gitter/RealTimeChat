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
	l.PlayersInLobby[playerID] = conn

	for {

		var msg map[string]interface{}

		err := conn.ReadJSON(&msg)

		if err != nil {
			fmt.Println(err)
			conn.Close()
			for pID := range l.PlayersInLobby {
				if pID == playerID {
					delete(l.PlayersInLobby, playerID)
					broadcastMessageToLobby[LobbyUpdate](LobbyUpdate{CmdType: "LobbyUpdate", Lobby: *l}, l.PlayersInLobby)
					return
				}
			}
			for _, r := range l.Rooms {
				for pID := range r.PlayerConnections {
					if pID == playerID {
						delete(r.PlayerConnections, playerID)
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
			conn.WriteJSON(ConnectCommand{CmdType: "connectionResponse", Lobby: *l, OurPlayerID: playerID})
			for pid, c := range l.PlayersInLobby {
				if pid != playerID {
					c.WriteJSON(LobbyUpdate{CmdType: "LobbyUpdate", Lobby: *l})
				}

			}
		}

		if cmdType == "joinRoom" {
			roomID := msg["roomID"]
			l.joinRoom(playerID, int(roomID.(float64)), conn)
			l.sendJoinedRoomMessage(int(roomID.(float64)))
		}
		if cmdType == "createRoom" {
			l.createNewRoom(playerID, l.NextRoomID, conn)
			l.sendNewRoomMessage(l.NextRoomID)
			fmt.Printf("creating room %v \n", l.NextRoomID)
			l.NextRoomID += 1
		}
		if cmdType == "leaveRoom" {
			roomID := msg["roomID"]
			l.leaveRoom(playerID, int(roomID.(float64)))
			fmt.Printf("leaving room %v \n", int(roomID.(float64)))
			l.sendLeaveRoomMessage(int(roomID.(float64)))
		}
		if cmdType == "deleteRoom" {
			roomID := msg["roomID"]
			l.deleteRoom(int(roomID.(float64)))
			fmt.Printf("deleting room %v \n", int(roomID.(float64)))
			// sendDeletedRoomMessage
		}

	}
}

func (l *Lobby) createNewRoom(playerID string, roomID int, conn *websocket.Conn) error {
	l.Rooms = append(l.Rooms, Room{Id: roomID, PlayerConnections: make(map[string]*websocket.Conn)})
	return nil
}

func (l *Lobby) joinRoom(playerID string, roomID int, conn *websocket.Conn) {
	idx := l.findRoomIndex(roomID)
	l.Rooms[idx].PlayerConnections[playerID] = conn
	delete(l.PlayersInLobby, playerID)
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
