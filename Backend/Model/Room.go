package model

import (
	"github.com/gorilla/websocket"
)

type Room struct {
	Id                int
	PlayerConnections map[string]*websocket.Conn
}
