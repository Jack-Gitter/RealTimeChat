package model

import (
	"github.com/gorilla/websocket"
)

type Room struct {
	Id                int
	PlayerConnections map[string]*websocket.Conn
	Messages          [][]string // of the form [[username: message], [username: message], [username, message]] in order
	Owner             string     // the playerID of the user who created the room
	Password          string     // "" if no password, otherwise the password to a room for a private room
}
