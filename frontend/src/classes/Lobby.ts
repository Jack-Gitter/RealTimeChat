import { EventEmitter } from "events";
import Room from "./Room";

export default class Lobby extends EventEmitter {
    public rooms: Room[]
    public playerConnections: Map<string, WebSocket>

    constructor() {
        super()
        this.rooms = []
        this.playerConnections = new Map()
    }

}

// player joins lobby, we create a socket connection for them 
// we set up listeners on that socket connection to update the lobby and then the lobby emits events
