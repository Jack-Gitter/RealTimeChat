import { useContext } from "react";
import LobbyContext, { LobbyContextType } from "../contexts/LobbyContext";
import assert from "assert";

export default function useLobby(): LobbyContextType { 
    const ctx = useContext(LobbyContext);
    assert(ctx, "lobby context should not be undefined")
    return ctx;
  }
  