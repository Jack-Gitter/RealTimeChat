import React from "react";
import Lobby from "../classes/Lobby";

const LobbyContext = React.createContext<Lobby>(new Lobby());

export default LobbyContext;