import { useEffect, useState } from "react"
import useLobby from "../hooks/useLobby"

export default function Lobby(): JSX.Element {
    let LobbyComponent = useLobby()

    let lobby = LobbyComponent.lobby
    let setLobby = LobbyComponent.setLobby
    let [ourPlayerID, setOurPlayerID] = useState(lobby.ourPlayerID)
    
    useEffect(() => {
        lobby.addListener("ourPlayerChanged", () => setOurPlayerID(lobby.ourPlayerID))
        lobby.addListener("ourPlayerChanged", () => console.log(lobby))
    })
    
    if (lobby.ourPlayerID === '') {
        return (
            <div>
                <button onClick={() => {
                    lobby.addUserToLobby()
                    setLobby(lobby)
                    }}>
                    Join Lobby
                </button>
            </div>
        )
    } else {
        return (
            <div>
                {ourPlayerID}
            </div>
        )
    }
    
}