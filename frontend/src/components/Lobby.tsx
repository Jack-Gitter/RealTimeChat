import { useEffect, useState } from "react";
import useLobby from "../hooks/useLobby";
import { Button, Heading, Textarea, Grid, GridItem, HStack, Flex, Spacer, useToast, Input, InputGroup, InputRightElement, Stack, FormControl, InputLeftElement, SimpleGrid, VStack, Box, Center, AbsoluteCenter, Divider, StackDivider } from "@chakra-ui/react";
import Room from "../classes/Room";
import RoomComponent from "./RoomComponent";
import Welcome from "./Welcome";

export default function Lobby(): JSX.Element {
  let toast = useToast()
  let LobbyComponent = useLobby();
  let lobby = LobbyComponent.lobby;
  let setLobby = LobbyComponent.setLobby;
  let [ourPlayerID, setOurPlayerID] = useState(lobby.ourPlayerID);
  let [otherPlayers, setOtherPlayers] = useState(lobby.otherPlayers);
  let [rooms, setRooms] = useState(lobby.rooms);
  let [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined)
  let [textToSend, setTextToSend] = useState("")
  let [username, setUsername] = useState("")
  let [roomPass, setRoomPass] = useState("")
  
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
    lobby.addListener("loginError", () => {
      toast({
        title: 'username with user already exists in the lobby',
        description: 'fuck you',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
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
      <Welcome username={username} setUsername={setUsername} />
    );
  } else if (!selectedRoom) {
    return (
      <div >

        <div>
          <HStack position='relative' spacing='24px'>
            <AbsoluteCenter>
              <Heading as='h1' size='lg'>Chat Room Lobby</Heading>
            </AbsoluteCenter>
            <Spacer />
            <VStack float='right' background='gray.200' borderRadius={10} p={5}>
              <Heading as='h3' size='sm' pr={10} >Username: {ourPlayerID}</Heading>
              <Divider />
              <Heading as='h3' size='sm'>Other players in the lobby currently are: </Heading>
              {otherPlayers.map((pID) => (
                <Box>{pID}</Box>
              ))}
            </VStack>
          </HStack>
        </div>


        <div> 
          <HStack spacing='50%'>
            <Button onClick={() => lobby.createNewRoom("")}>Create New Public Room</Button>
            <Button onClick={() => lobby.createNewRoom(roomPass)}>Create New Private Room</Button>
          </HStack>
          <Input value={roomPass} onChange={(e) => setRoomPass(e.target.value)}></Input>

        </div>
        <h3>Available rooms are</h3>
          
        <SimpleGrid columns={{base: 1, md: 2, lg: 3}}>
        {rooms.map((r, index) => (
            <GridItem w='100%' h='100%' bg='blue.500' key={index}>
              <RoomComponent r={r} /> 
            </GridItem>
          ))}
        </SimpleGrid>


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
