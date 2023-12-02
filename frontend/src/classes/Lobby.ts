import { EventEmitter } from "events";
import Room from "./Room";

export default class Lobby extends EventEmitter {
  public rooms: Room[];
  public otherPlayers: string[];
  public ourPlayerID: string;
  public ourPlayerSocket: WebSocket | undefined;

  constructor() {
    super();
    this.rooms = [];
    this.otherPlayers = [];
    this.ourPlayerID = "";
    this.ourPlayerSocket = undefined;
  }

  private handleConnectionResponse(jsonMessage: any) {
    this.ourPlayerID = jsonMessage.OurPlayerID;

    for (const playerID in jsonMessage.Lobby.PlayersInLobby) {
      this.otherPlayers.push(playerID);
    }

    if (jsonMessage.Lobby.Rooms != null) {
      this.rooms = [];
      for (const room of jsonMessage.Lobby.Rooms) {
        let newRoom = new Room(room.Id);
        this.rooms.push(newRoom);
      }
    }

    console.log("outputting json mesage from connection response");
    console.log(jsonMessage);
    this.emit("connectionResponse", this);
  }

  private handleLobbyUpdate(jsonMessage: any) {
    for (const playerID in jsonMessage.Lobby.PlayersInLobby) {
      if (
        playerID !== this.ourPlayerID &&
        this.otherPlayers.find((pID) => pID === playerID) === undefined
      ) {
        this.otherPlayers.push(playerID);
      }
      this.otherPlayers = this.otherPlayers.sort();
    }
    if (jsonMessage.Lobby.Rooms != null) {
      this.rooms = [];
      for (const room of jsonMessage.Lobby.Rooms) {
        let newRoom = new Room(room.Id);
        this.rooms.push(newRoom);
      }
    }
    this.emit("LobbyUpdate", this);
  }

  public addUserToLobby() {
    this.ourPlayerSocket = new WebSocket("ws://localhost:8080/lobby");

    this.ourPlayerSocket.onmessage = (event) => {
      try {
        let jsonMessage = JSON.parse(event.data);
        let cmdType = jsonMessage.CmdType;
        if (cmdType === "connectionResponse") {
          this.handleConnectionResponse(jsonMessage);
        }
        if (cmdType === "LobbyUpdate") {
          this.handleLobbyUpdate(jsonMessage);
        }
        if (cmdType === "NewRoom") {
          // create a room object here with json message stuff
          let jsonRoom = jsonMessage.Room;
          let newRoom = new Room(jsonRoom.Id);
          this.rooms.push(newRoom);
          this.emit("NewRoom", this);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
        }
      }
    };

    this.ourPlayerSocket.onopen = () =>
      this.ourPlayerSocket?.send(JSON.stringify({ cmdType: "connect" }));
  }

  public createNewRoom() {
    this.ourPlayerSocket?.send(JSON.stringify({ cmdType: "createRoom" }));
  }
}

// player joins lobby, we create a socket connection for them
// we set up listeners on that socket connection to update the lobby and then the lobby emits events
