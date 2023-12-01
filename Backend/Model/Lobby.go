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
	cmdType string
}

func (l *Lobby) JoinLobby(playerID string, conn *websocket.Conn) {
	// set up the listeners for the connection here
	l.PlayersInLobby[playerID] = conn
	fmt.Println("joining lobby")

	for {

		cmd := Command{}
		err := conn.ReadJSON(&cmd)
		fmt.Printf("command is %v", cmd)
		if err != nil {
			fmt.Println(err)
			conn.Close()
			return
		}

		/*if v.cmdType == "joinRoom" {
			fmt.Println("joining room")
		}
		if v.cmdType == "leaveRoom" {
			fmt.Println("leaving room")
		}
		if v.cmdType == "createRoom" {
			fmt.Println("creating room")
		}*/

	}
}

func (l *Lobby) createNewRoom(playerID string, conn *websocket.Conn) {
	l.Rooms = append(l.Rooms, Room{secondsLeftInRound: 10})
	idx := len(l.Rooms) - 1
	l.Rooms[idx].playerConnections[playerID] = conn
}

func (l *Lobby) deleteRoom(roomID int) {
	idx := l.findRoomIndex(roomID)
	l.Rooms = append(l.Rooms[:idx], l.Rooms[idx+1:]...)
}

func (l *Lobby) joinRoom(playerID string, roomID int, conn *websocket.Conn) {
	idx := l.findRoomIndex(roomID)
	l.Rooms[idx].playerConnections[playerID] = conn
}

func (l *Lobby) addPlayerToRoom(roomID int, playerID string, conn *websocket.Conn) {
	idx := l.findRoomIndex(roomID)
	l.Rooms[idx].playerConnections[playerID] = conn
}

func (l *Lobby) removePlayerFromRoom(roomID int, playerID string) {
	idx := l.findRoomIndex(roomID)
	delete(l.Rooms[idx].playerConnections, playerID)

}

func (l *Lobby) findRoomIndex(roomID int) int {
	return slices.IndexFunc(l.Rooms, func(r Room) bool {
		return r.id == roomID
	})
}
