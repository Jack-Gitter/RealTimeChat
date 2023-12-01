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
