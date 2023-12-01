import { useEffect, useState } from "react"
import useLobby from "../hooks/useLobby"

export default function Lobby(): JSX.Element {
    let LobbyComponent = useLobby()

    let lobby = LobbyComponent.lobby
    let setLobby = LobbyComponent.setLobby
    let [ourPlayerID, setOurPlayerID] = useState(lobby.ourPlayerID)
    let [otherPlayers, setOtherPlayers] = useState(lobby.otherPlayers)
    
    useEffect(() => {
        lobby.addListener("LobbyUpdate", (l) => {
            setLobby(l)
            setOurPlayerID(l.ourPlayerID)
            setOtherPlayers([...l.otherPlayers])
        })
        lobby.addListener("connectionResponse", (l) => {
            setLobby(l)
            setOurPlayerID(l.ourPlayerID)
            setOtherPlayers([...l.otherPlayers])
        })
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
                <ul>
                {otherPlayers.map(pID => <li>{pID}</li>)}
                </ul>
            </div>
        )
    }
    
}