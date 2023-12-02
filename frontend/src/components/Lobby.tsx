import { useEffect, useState } from "react";
import useLobby from "../hooks/useLobby";
import { Button, Heading } from "@chakra-ui/react";
import Room from "../classes/Room";

export default function Lobby(): JSX.Element {
  let LobbyComponent = useLobby();
  let lobby = LobbyComponent.lobby;
  let setLobby = LobbyComponent.setLobby;
  let [ourPlayerID, setOurPlayerID] = useState(lobby.ourPlayerID);
  let [otherPlayers, setOtherPlayers] = useState(lobby.otherPlayers);
  let [rooms, setRooms] = useState(lobby.rooms);
  let [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined)

  
  useEffect(() => {
    lobby.addListener("LobbyUpdate", (l) => {
      setOurPlayerID(l.ourPlayerID);
      setOtherPlayers([...l.otherPlayers]);
      setRooms([...l.rooms]);
      setSelectedRoomIfOurUserIsInRoom(l)
    });
    lobby.addListener("connectionResponse", (l) => {
      setOurPlayerID(l.ourPlayerID);
      setOtherPlayers([...l.otherPlayers]);
      setRooms([...l.rooms]);
    });
    lobby.addListener("NewRoom", (l) => {
      setLobby(l);
      setRooms([...l.rooms]);
    });
    lobby.addListener("RoomUpdate", (l) => {
      setLobby(l)
      setRooms([...l.rooms]);
      setSelectedRoomIfOurUserIsInRoom(l)
    })
  });

  function setSelectedRoomIfOurUserIsInRoom(l: any) {
    let foundOurPlayerInARoom = false
    for (const r of l.rooms) {
      for (const playerID of r.playersInRoom) {
        if (playerID === l.ourPlayerID) {
          setSelectedRoom(r)
          foundOurPlayerInARoom = true
        }
      }
    }
    if (!foundOurPlayerInARoom) {
      setSelectedRoom(undefined)
    }
  }

  if (lobby.ourPlayerID === "") {
    return (
      <div>
        <Heading as='h1' size='xl'>Song Battle Royale</Heading>
        <Button
          onClick={() => {
            lobby.addUserToLobby();
          }}
        >
          Enter the lobby
        </Button>
      </div>
    );
  } else if (!selectedRoom) {
    return (
      <div>
        <h1>Song Battle Royale Lobby</h1>
        <h3>Your username is: {ourPlayerID}</h3>
        <h3>Other players in the lobby currently are: </h3>
        <ul>
          {otherPlayers.map((pID) => (
            <li>{pID}</li>
          ))}
        </ul>
        <h3>Available rooms are</h3>
        <ul>
          {rooms.map((r, index) => (
            <li key={index}>
            Room ID:  {r.id}
            IsInProgress: {r.isInProgress.toString()}
            PlayersInRoom: {r.playersInRoom}
            <Button onClick={() => {
              lobby.joinRoom(r.id)
              }}>Join Room</Button>
              <Button onClick={() => {
              lobby.deleteRoom(r.id)
              }}>Delete Room</Button>
            </li>
          ))}
        </ul>
        <Button onClick={() => lobby.createNewRoom()}>CreateNewRoom</Button>
      </div>
    );
  } else if (selectedRoom) {
    return (
      <>
      roomID: {selectedRoom.id}
      playersInRoom: {selectedRoom.playersInRoom}
      <Button onClick={() => {
          lobby.leaveRoom(selectedRoom?.id as number)
      }}>Leave room</Button>
      </>
    )
  } else {
    return (
      <></>
    )
  }
}
