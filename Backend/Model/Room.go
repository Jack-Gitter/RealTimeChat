package model

import (
	"github.com/gorilla/websocket"
)

type Room struct {
	Id                int
	PlayerConnections map[string]*websocket.Conn
	Messages          [][]string // of the form [[username: message], [username: message], [username, message]] in order
	Owner             string     // the playerID of the user who created the room
}
