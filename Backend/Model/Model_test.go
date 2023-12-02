package model

import (
	"testing"

	"github.com/gorilla/websocket"
)

func TestCreateNewRoom(t *testing.T) {
	l := Lobby{}
	conn := websocket.Conn{}
	rID := 0
	pID := "test"
	l.createNewRoom(pID, rID, &conn)

	if len(l.Rooms) == 1 {
		t.Fatalf(`wanted lobby rooms to have length one, has %v`, len(l.Rooms))
	}
}
