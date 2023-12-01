import { EventEmitter } from "events";
import Room from "./Room";

export default class Lobby extends EventEmitter {
    public rooms: Room[]
    public playerConnections: Map<string, WebSocket>
    public ourPlayerID: string

    constructor() {
        super()
        this.rooms = []
        this.playerConnections = new Map()
        this.ourPlayerID = ""
    }

    public addUserToLobby() {
        // create a new websocket for the user
        // add the user to the backend model 
        // get the backend model
        // update frontend model
        let socket = new WebSocket("ws://localhost:8080/lobby")
        // check for the userID sent back from the server 
        socket.onmessage = (event) => {this.ourPlayerID = event.data}
        this.playerConnections.set(this.ourPlayerID, socket)
        
    }

}

// player joins lobby, we create a socket connection for them 
// we set up listeners on that socket connection to update the lobby and then the lobby emits events
