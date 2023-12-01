import React from "react";
import Lobby from "../classes/Lobby";

export type LobbyContextType = {
    setLobby: (newLobby: Lobby) => void;
    lobby: Lobby;
  };

const LobbyContext = React.createContext<LobbyContextType | null>(null);

export default LobbyContext;