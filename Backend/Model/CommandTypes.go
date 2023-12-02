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

type JoinedRoom struct {
	CmdType  string
	RoomID   int
	PlayerID string
}

type Command interface {
	NewRoomCommand | ConnectCommand | LobbyUpdate | JoinedRoom
}
