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
      if (
        playerID !== this.ourPlayerID &&
        this.otherPlayers.find((pID) => pID === playerID) === undefined
      ) {
        this.otherPlayers.push(playerID);
      }
    }

    this.rooms = [];
    if (jsonMessage.Lobby.Rooms != null) {
      for (const room of jsonMessage.Lobby.Rooms) {
        let playersInRoom: string[] = []
        for (const playerID in room.PlayerConnections) {
          playersInRoom.push(playerID)
        }
        let newRoom = new Room(room.Id, playersInRoom, room.Messages, room.Owner);
        this.rooms.push(newRoom);
      }
    }

    this.emit("connectionResponse", this);
  }

  private handleLobbyUpdate(jsonMessage: any) {
    console.log("in handle lobby update, our player is: " + this.ourPlayerID)
    if (jsonMessage.Lobby.PlayersInLobby != null) {
      this.otherPlayers = []
    } 
    for (const playerID in jsonMessage.Lobby.PlayersInLobby) {
      if (
        playerID !== this.ourPlayerID &&
        this.otherPlayers.find((pID) => pID === playerID) === undefined
      ) {
        this.otherPlayers.push(playerID);
      }
      this.otherPlayers = this.otherPlayers.sort();
    }
    this.rooms = [];
    if (jsonMessage.Lobby.Rooms != null) {
      for (const room of jsonMessage.Lobby.Rooms) {
        let playersInRoom: string[] = []
        for (const playerID in room.PlayerConnections) {
          playersInRoom.push(playerID)
        }
        let newRoom = new Room(room.Id, playersInRoom, room.Messages, room.Owner);
        this.rooms.push(newRoom);
      }
    }
    this.emit("LobbyUpdate", this);
  }

  private handleRoomUpdate(jsonMessage: any) {
    let room = this.rooms.find(r => r.id === jsonMessage.Room.Id)
    let messages = jsonMessage.Room.Messages   
      if (room) {
        room.playersInRoom = []
        room.messages = []
        for (const playerID in jsonMessage.Room.PlayerConnections) {
          room.playersInRoom.push(playerID)
        }
        for (const [playerID, message] of messages) {
          room.messages.push([playerID, message])
        }
        this.emit("RoomUpdate", this)
      }
  }

  public handleNewRoomResponse(jsonMessage: any) {
    
    let jsonRoom = jsonMessage.Room;
    
    let newRoom = new Room(jsonRoom.Id, [], [], jsonRoom.Owner);
    this.rooms.push(newRoom);
    this.emit("NewRoom", this);
  }
  public addUserToLobby(username: string) {
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
          this.handleNewRoomResponse(jsonMessage);
        }
        if (cmdType === "RoomUpdate") {
          this.handleRoomUpdate(jsonMessage);
        }
        if (cmdType === "loginError") {
          this.emit("loginError")
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
        }
      }
    };

    this.ourPlayerSocket.onopen = () =>
      this.ourPlayerSocket?.send(JSON.stringify({ cmdType: "connect", username: username}));
  }

  public sendMessage(message: string, roomID: number) {
    this.ourPlayerSocket?.send(JSON.stringify({cmdType: "sendMessage", roomID: roomID, message: message}))
  }

  public createNewRoom() {
    this.ourPlayerSocket?.send(JSON.stringify({ cmdType: "createRoom" }));
  }

  public joinRoom(roomID: number) {
    this.ourPlayerSocket?.send(JSON.stringify({cmdType: "joinRoom", roomID: roomID}))
  }

  public leaveRoom(roomID: number) {
    this.ourPlayerSocket?.send(JSON.stringify({cmdType: "leaveRoom", roomID: roomID}))
  }

  public deleteRoom(roomID: number) {
    this.ourPlayerSocket?.send(JSON.stringify({cmdType: "deleteRoom", roomID: roomID}))
  }
}

// player joins lobby, we create a socket connection for them
// we set up listeners on that socket connection to update the lobby and then the lobby emits events
