import useLobby from "../hooks/useLobby"

export default function Lobby(): JSX.Element {
    let LobbyComponent = useLobby()
    let lobby = LobbyComponent.lobby
    let setLobby = LobbyComponent.setLobby
    console.log(lobby)
    console.log(setLobby)
    return (
        <button onClick={() => lobby.addUserToLobby()}></button>
    )
}