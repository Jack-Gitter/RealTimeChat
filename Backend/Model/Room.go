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
	PlayersInNextRound map[string]bool
}

func (r *Room) StartRoomFromRoundZero() {
	// do all logic here to count down, etc
}

func (r *Room) makeGuess(playerID string, userSongGuess string) bool {
	if userSongGuess == r.CurrentSongToguess {
		r.PlayersInNextRound[playerID] = true
		return true
	}
	return false
}
