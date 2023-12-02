import { useEffect, useState } from "react";
import useLobby from "../hooks/useLobby";

export default function Lobby(): JSX.Element {
  let LobbyComponent = useLobby();

  let lobby = LobbyComponent.lobby;
  let setLobby = LobbyComponent.setLobby;
  let [ourPlayerID, setOurPlayerID] = useState(lobby.ourPlayerID);
  let [otherPlayers, setOtherPlayers] = useState(lobby.otherPlayers);
  let [rooms, setRooms] = useState(lobby.rooms);

  useEffect(() => {
    lobby.addListener("LobbyUpdate", (l) => {
      setOurPlayerID(l.ourPlayerID);
      setOtherPlayers([...l.otherPlayers]);
      setRooms([...l.rooms]);
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
  });

  if (lobby.ourPlayerID === "") {
    return (
      <div>
        <button
          onClick={() => {
            lobby.addUserToLobby();
          }}
        >
          Join Lobby
        </button>
      </div>
    );
  } else {
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
            <button onClick={() => lobby.joinRoom(r.id)}>Join Room</button>
            </li>
          ))}
        </ul>
        <button onClick={() => lobby.createNewRoom()}>CreateNewRoom</button>
      </div>
    );
  }
}
