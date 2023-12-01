package model

import (
	"fmt"
	"slices"

	"github.com/gorilla/websocket"
)

type Lobby struct {
	Rooms          []Room
	PlayersInLobby map[string]*websocket.Conn
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
		roomID := msg["roomID"].(float64)

		if cmdType == "joinRoom" {
			l.joinRoom(playerID, int(roomID), conn)
			fmt.Printf("joining room %v", int(roomID))
			fmt.Println(l)
		}
		if cmdType == "createRoom" {
			err := l.createNewRoom(playerID, int(roomID), conn)
			if err != nil {
				conn.WriteMessage(websocket.TextMessage, []byte("failure"))
			} else {
				conn.WriteMessage(websocket.TextMessage, []byte("success"))
				fmt.Printf("creating room %v \n", int(roomID))
				fmt.Println(l)
			}
		}
		if cmdType == "deleteRoom" {
			l.deleteRoom(int(roomID))
			fmt.Printf("deleting room %v \n", int(roomID))
			fmt.Println(l)
		}
		if cmdType == "leaveRoom" {
			l.leaveRoom(playerID, int(roomID))
			fmt.Printf("leaving room %v \n", int(roomID))
			fmt.Println(l)
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
