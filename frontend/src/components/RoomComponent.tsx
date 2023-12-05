import { Button } from "@chakra-ui/react"
import Room from "../classes/Room"
import useLobby from "../hooks/useLobby"

interface RoomComponentProps {
    r: Room
}
export default function RoomComponent({r}: RoomComponentProps): JSX.Element {
    let LobbyComponent = useLobby();
    let lobby = LobbyComponent.lobby;
    return (<>
       <ul>
            <li>Room ID:  {r.id}</li>
            <li>PlayersInRoom: {r.playersInRoom}</li>
            <li><Button onClick={() => {
              lobby.joinRoom(r.id)
              }}>Join Room</Button></li>
            <li><Button onClick={() => {
              lobby.deleteRoom(r.id)
              }}>Delete Room</Button></li>
            </ul>
    </>)
}