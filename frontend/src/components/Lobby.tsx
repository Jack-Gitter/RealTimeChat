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
    })
  });

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
            IsInProgress: {r.isInProgress}
            CurentSongToGuess: {r.currentSongToGuess}
            SecondsLeftInRound: {r.secondsLeftInRound}
            RoundsElapsed: {r.roundsElapsed}
            PlayersInRoom: {r.playersInRoom}
            PlayersInNextRound: {r.playersInNextRound}
            <Button onClick={() => {
              lobby.joinRoom(r.id)
              }}>Join Room</Button>
            <Button onClick={() => {
              lobby.leaveRoom(r.id)
              }}>Leave room</Button>
            </li>
          ))}
        </ul>
        <Button onClick={() => lobby.createNewRoom()}>CreateNewRoom</Button>
      </div>
    );
  } else if (selectedRoom) {
    return (
      <>
      we have selected a room
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
