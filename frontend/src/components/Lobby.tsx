import { useEffect, useState } from "react";
import useLobby from "../hooks/useLobby";
import { Button, Heading, Textarea, Grid, GridItem } from "@chakra-ui/react";
import Room from "../classes/Room";
import RoomComponent from "./RoomComponent";

export default function Lobby(): JSX.Element {
  let LobbyComponent = useLobby();
  let lobby = LobbyComponent.lobby;
  let setLobby = LobbyComponent.setLobby;
  let [ourPlayerID, setOurPlayerID] = useState(lobby.ourPlayerID);
  let [otherPlayers, setOtherPlayers] = useState(lobby.otherPlayers);
  let [rooms, setRooms] = useState(lobby.rooms);
  let [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined)
  let [textToSend, setTextToSend] = useState("")

  
  useEffect(() => {
    lobby.addListener("LobbyUpdate", (l) => {
      setOurPlayerID(l.ourPlayerID);
      setOtherPlayers([...l.otherPlayers]);
      setRooms([...l.rooms]);
      setSelectedRoomIfOurUserIsInRoom(l)
    });
    lobby.addListener("connectionResponse", (l) => {
      setOurPlayerID(l.ourPlayerID);
      setOtherPlayers([...l.otherPlayers]);
      setRooms([...l.rooms]);
    });
    lobby.addListener("NewRoom", (l) => {
      setLobby(l);
      setRooms([...l.rooms]);
    });
    lobby.addListener("RoomUpdate", (l) => {
      setLobby(l)
      setRooms([...l.rooms]);
      setSelectedRoomIfOurUserIsInRoom(l)
    })
  });

  function setSelectedRoomIfOurUserIsInRoom(l: any) {
    let foundOurPlayerInARoom = false
    for (const r of l.rooms) {
      for (const playerID of r.playersInRoom) {
        if (playerID === l.ourPlayerID) {
          setSelectedRoom(r)
          foundOurPlayerInARoom = true
        }
      }
    }
    if (!foundOurPlayerInARoom) {
      setSelectedRoom(undefined)
    }
  }

  if (lobby.ourPlayerID === "") {
    return (
      <div>
        <Heading as='h1' size='xl'>Dead Simple Chat Application</Heading>
        <Button
          onClick={() => {
            lobby.addUserToLobby();
          }}
        >
          Enter the chat lobby
        </Button>
      </div>
    );
  } else if (!selectedRoom) {
    return (
      <div>
        <h1>Chat Room Lobby</h1>
        <h3>Your username is: {ourPlayerID}</h3>
        <h3>Other players in the lobby currently are: </h3>
        <ul>
          {otherPlayers.map((pID) => (
            <li>{pID}</li>
          ))}
        </ul>
        <Button onClick={() => lobby.createNewRoom()}>CreateNewRoom</Button>

        <h3>Available rooms are</h3>
        <Grid templateColumns='repeat(5, 500fr)' gap={40}>
        
        
          {rooms.map((r, index) => (
            <GridItem w='100%' h='70' bg='blue.500' key={index}>
              <RoomComponent r={r} />
            
            </GridItem>
          ))}
          </Grid>

      </div>
    );
  } else if (selectedRoom) {
    return (
      <ul>
      <li>roomID: {selectedRoom.id}</li>
      {selectedRoom.playersInRoom.map(p => <li>{p}</li>)}
      <li><Button onClick={() => {
          lobby.leaveRoom(selectedRoom?.id as number)
      }}>Leave room</Button></li>

      <Textarea
        value={textToSend}
        onChange={(e) => setTextToSend(e.target.value)}
        placeholder='Here is a sample placeholder'
        size='sm'
      />
    
      {selectedRoom.messages.map((playerToMessage: string[]) => {
        return <li>{playerToMessage[0]}, {playerToMessage[1]}</li>
      })}

      <Button onClick={() => {
        lobby.sendMessage(textToSend, selectedRoom?.id as number)
      }}>sendmessage
      </Button>
      </ul>
    )
  } else {
    return (
      <></>
    )
  }
}
