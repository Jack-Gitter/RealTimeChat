import { useState } from "react"
import Lobby from "../classes/Lobby"
import LobbyComponent from "./Lobby"
import LobbyContext from "../contexts/LobbyContext"
import { ChakraProvider } from "@chakra-ui/react"

export default function App(): JSX.Element {
    let [lobby, setLobby] = useState<Lobby>(new Lobby())
    return (
        <ChakraProvider>
            <LobbyContext.Provider value={{setLobby, lobby}}>
                <LobbyComponent />
            </LobbyContext.Provider>
        </ChakraProvider>

    )
}