package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/websocket"

	model "SongBattleRoyale/Model"

	api "SongBattleRoyale/API"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var lobby = model.Lobby{
	PlayersInLobby: make(map[string]*websocket.Conn, 0),
}

var authInformation = api.AuthInformation{}

func main() {
	authInformation.SetAuthInformation()
	authInformation.GetNewSongs()
	http.HandleFunc("/lobby", joinLobbyHandler)
	http.ListenAndServe("localhost:8080", nil)
}

func joinLobbyHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		fmt.Println(err)
		return
	}
	id := generateRandomString(10)
	lobby.JoinLobby(id, conn)

}

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))

func generateRandomString(length int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}
