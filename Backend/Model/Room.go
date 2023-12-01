package model

import (
	"github.com/gorilla/websocket"
)

type Room struct {
	Id                 int
	IsInProgress       bool
	CurrentSongToguess string
	SecondsLeftInRound int
	RoundsElapsed      int
	PlayerConnections  map[string]*websocket.Conn
}

func (r *Room) LoadNextSong() {
	// use the spotify api to find a new random song
}
