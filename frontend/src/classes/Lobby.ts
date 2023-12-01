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

    public async addUserToLobby() {
        let socket = new WebSocket("ws://localhost:8080/lobby")
        
        socket.onmessage = (event) => {
            try {
                let jsonMessage = JSON.parse(event.data)
                console.log(jsonMessage)
                // do message stuff here
            } catch (err) {
                this.ourPlayerID = event.data
                this.emit("ourPlayerChanged", this.ourPlayerID)
            }
            
        }
        socket.onopen = () => socket.send(JSON.stringify({"cmdType": "getID"}))
        this.playerConnections.set(this.ourPlayerID, socket)
        
    }

}

// player joins lobby, we create a socket connection for them 
// we set up listeners on that socket connection to update the lobby and then the lobby emits events
