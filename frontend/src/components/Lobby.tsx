import { useEffect, useState } from "react"
import useLobby from "../hooks/useLobby"

export default function Lobby(): JSX.Element {
    let LobbyComponent = useLobby()

    let lobby = LobbyComponent.lobby
    let setLobby = LobbyComponent.setLobby
    let [ourPlayerID, setOurPlayerID] = useState(lobby.ourPlayerID)
    
    useEffect(() => {
        lobby.addListener("ourPlayerChanged", () => setOurPlayerID(lobby.ourPlayerID))
    })
    
    return (
        <div>
            {ourPlayerID}
            <button onClick={() => {lobby.addUserToLobby()}}>Join Lobby</button>
        </div>
    )
}