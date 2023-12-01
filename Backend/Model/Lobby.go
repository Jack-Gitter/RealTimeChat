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

type Command struct {
	CmdType string
	RoomID  int
}

func (l *Lobby) JoinLobby(playerID string, conn *websocket.Conn) {
	// set up the listeners for the connection here
	l.PlayersInLobby[playerID] = conn

	for {

		var cmd Command

		err := conn.ReadJSON(&cmd)

		if err != nil {
			fmt.Println(err)
			conn.Close()
			return
		}

		if cmd.CmdType == "joinRoom" {
			l.joinRoom(playerID, cmd.RoomID, conn)
			fmt.Printf("joining room %v", cmd.RoomID)
		}
		if cmd.CmdType == "createRoom" {
			l.createNewRoom(playerID, cmd.RoomID, conn)
			fmt.Printf("creating room %v", cmd.RoomID)
		}
		if cmd.CmdType == "deleteRoom" {
			l.deleteRoom(cmd.RoomID)
			fmt.Printf("deleting room %v", cmd.RoomID)
		}
		if cmd.CmdType == "leaveRoom" {
			l.leaveRoom(playerID, cmd.RoomID)
			fmt.Printf("leaving room %v", cmd.RoomID)
		}

	}
}

func (l *Lobby) createNewRoom(playerID string, roomID int, conn *websocket.Conn) {
	l.Rooms = append(l.Rooms, Room{SecondsLeftInRound: 10, Id: roomID, PlayerConnections: make(map[string]*websocket.Conn)})
	idx := len(l.Rooms) - 1
	l.Rooms[idx].PlayerConnections[playerID] = conn
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
