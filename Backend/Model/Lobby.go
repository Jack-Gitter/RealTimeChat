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
	// set up the listeners for the connection here
	l.PlayersInLobby[playerID] = conn

	for {

		var msg map[string]interface{}

		err := conn.ReadJSON(&msg)

		if err != nil {
			// remove them from the lobby and all rooms they are in here
			fmt.Println(err)
			conn.Close()
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
			fmt.Printf("joining room %v", int(roomID.(float64)))
		}
		if cmdType == "createRoom" {
			l.createNewRoom(playerID, l.NextRoomID, conn)
			l.sendNewRoomMessageToAllUsers(l.NextRoomID)
			fmt.Printf("creating room %v \n", l.NextRoomID)
			l.NextRoomID += 1
		}
		if cmdType == "deleteRoom" {
			roomID := msg["roomID"]
			l.deleteRoom(int(roomID.(float64)))
			fmt.Printf("deleting room %v \n", int(roomID.(float64)))

			// broadcast the updated model
		}
		if cmdType == "leaveRoom" {
			roomID := msg["roomID"]
			l.leaveRoom(playerID, int(roomID.(float64)))
			fmt.Printf("leaving room %v \n", int(roomID.(float64)))

		}
	}
}

func (l *Lobby) createNewRoom(playerID string, roomID int, conn *websocket.Conn) error {
	l.Rooms = append(l.Rooms, Room{SecondsLeftInRound: 10, Id: roomID, PlayerConnections: make(map[string]*websocket.Conn)})
	idx := len(l.Rooms) - 1
	l.Rooms[idx].PlayerConnections[playerID] = conn
	return nil
}

func (l *Lobby) joinRoom(playerID string, roomID int, conn *websocket.Conn) {
	idx := l.findRoomIndex(roomID)
	l.Rooms[idx].PlayerConnections[playerID] = conn
}

func (l *Lobby) deleteRoom(roomID int) {
	idx := l.findRoomIndex(roomID)
	l.Rooms = append(l.Rooms[:idx], l.Rooms[idx+1:]...)
}

func (l *Lobby) leaveRoom(playerID string, roomID int) {
	idx := l.findRoomIndex(roomID)
	delete(l.Rooms[idx].PlayerConnections, playerID)
}

func (l *Lobby) findRoomIndex(roomID int) int {
	return slices.IndexFunc(l.Rooms, func(r Room) bool {
		return r.Id == roomID
	})
}

func (l *Lobby) sendNewRoomMessageToAllUsers(roomID int) {
	idx := l.findRoomIndex(roomID)
	room := l.Rooms[idx]
	fmt.Printf("sending room %v", room)
	cmd := NewRoomCommand{CmdType: "NewRoom", Room: room}
	for _, c := range l.PlayersInLobby {
		c.WriteJSON(cmd)
	}
}
