import { EventEmitter } from "events";
import Room from "./Room";

export default class Lobby extends EventEmitter {
    public rooms: Room[]
    public otherPlayers: string[]
    public ourPlayerID: string
    public ourPlayerSocket: WebSocket | undefined

    constructor() {
        super()
        this.rooms = []
        this.otherPlayers = []
        this.ourPlayerID = ""
        this.ourPlayerSocket = undefined
    }

    public async addUserToLobby() {

        this.ourPlayerSocket = new WebSocket("ws://localhost:8080/lobby")
        
        // here i need to get the lobby from the server -- just send a message to get the lobby state
        this.ourPlayerSocket.onmessage = (event) => {
            try {
                let jsonMessage = JSON.parse(event.data)
                if (jsonMessage["CmdType"] === "connectionResponse") {
                    this.ourPlayerID = jsonMessage["OurPlayerID"]
                    for (const playerID in jsonMessage["Lobby"]["PlayersInLobby"]) {
                       this.otherPlayers.push(playerID)
                    }
                    this.rooms = jsonMessage["Rooms"]
                    this.emit("connectionResponse", this)
                } 
                if (jsonMessage["CmdType"] === "LobbyUpdate") {
                    console.log("got this command")
                    for (const playerID in jsonMessage["Lobby"]["PlayersInLobby"]) {
                        if (playerID !== this.ourPlayerID && this.otherPlayers.find((pID) => pID === playerID) === undefined) {
                            this.otherPlayers.push(playerID)
                        }
                        
                    }
                    this.emit("LobbyUpdate", this)
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err)
                }
            }
            
        }

        this.ourPlayerSocket.onopen = () => this.ourPlayerSocket?.send(JSON.stringify({"cmdType": "connect"}))
        
        
        
    }

}

// player joins lobby, we create a socket connection for them 
// we set up listeners on that socket connection to update the lobby and then the lobby emits events
