import { useContext } from "react";
import LobbyContext, { LobbyContextType } from "../contexts/LobbyContext";

export default function useLobby(): LobbyContextType | null { 
    const ctx = useContext(LobbyContext);
    return ctx;
  }
  