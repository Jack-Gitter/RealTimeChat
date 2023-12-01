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
			fmt.Println("joining room")
		}
		if cmd.CmdType == "createRoom" {
			l.createNewRoom(playerID, cmd.RoomID, conn)
			fmt.Println("creating room")
		}
		if cmd.CmdType == "deleteRoom" {
			fmt.Println("deleting room")
		}
		if cmd.CmdType == "leaveRoom" {
			fmt.Println("leaving room")
		}

	}
}

func (l *Lobby) createNewRoom(playerID string, roomID int, conn *websocket.Conn) {
	l.Rooms = append(l.Rooms, Room{SecondsLeftInRound: 10, Id: roomID})
	idx := len(l.Rooms) - 1
	l.Rooms[idx].PlayerConnections[playerID] = conn
}

func (l *Lobby) deleteRoom(roomID int) {
	idx := l.findRoomIndex(roomID)
	l.Rooms = append(l.Rooms[:idx], l.Rooms[idx+1:]...)
}

func (l *Lobby) joinRoom(playerID string, roomID int, conn *websocket.Conn) {
	idx := l.findRoomIndex(roomID)
	l.Rooms[idx].PlayerConnections[playerID] = conn
}

func (l *Lobby) addPlayerToRoom(roomID int, playerID string, conn *websocket.Conn) {
	idx := l.findRoomIndex(roomID)
	l.Rooms[idx].PlayerConnections[playerID] = conn
}

func (l *Lobby) removePlayerFromRoom(roomID int, playerID string) {
	idx := l.findRoomIndex(roomID)
	delete(l.Rooms[idx].PlayerConnections, playerID)

}

func (l *Lobby) findRoomIndex(roomID int) int {
	return slices.IndexFunc(l.Rooms, func(r Room) bool {
		return r.Id == roomID
	})
}
