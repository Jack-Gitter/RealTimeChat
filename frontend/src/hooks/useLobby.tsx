import { useContext } from "react";
import LobbyContext, { LobbyContextType } from "../contexts/LobbyContext";
import assert from "assert";

export default function useLobby(): LobbyContextType | null { 
    const ctx = useContext(LobbyContext);
    assert(ctx, 'Lobby should be defined');
    return ctx;
  }
  