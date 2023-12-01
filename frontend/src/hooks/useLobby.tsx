import { useContext } from "react";
import Lobby from "../classes/Lobby";
import LobbyContext from "../contexts/LobbyContext";

export default function useLobby(): Lobby {
    const ctx = useContext(LobbyContext);
    return ctx;
  }
  