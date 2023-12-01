package model

import (
	"github.com/gorilla/websocket"
)

type Room struct {
	id                 int
	isInProgress       bool
	currentSongToguess string
	secondsLeftInRound int
	roundsElapsed      int
	playerConnections  map[string]*websocket.Conn
}
