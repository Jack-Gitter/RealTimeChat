package model

type NewRoomCommand struct {
	CmdType string
	Room    Room
}

type ConnectCommand struct {
	CmdType     string
	Lobby       Lobby
	OurPlayerID string
}

type LobbyUpdate struct {
	CmdType string
	Lobby   Lobby
}

type RoomUpdate struct {
	CmdType string
	Room    Room
}

type RoomDelete struct {
	CmdType string
	RoomID  int
}

type Command interface {
	NewRoomCommand | ConnectCommand | LobbyUpdate | RoomUpdate | RoomDelete
}
