import { useState } from "react"
import Lobby from "../classes/Lobby"
import LobbyContext from "../contexts/LobbyContext"

export default function App(): JSX.Element {
    let [lobby] = useState<Lobby>(new Lobby())
    return (
        <LobbyContext.Provider value={lobby}>
        <></>
        </LobbyContext.Provider>

    )
}