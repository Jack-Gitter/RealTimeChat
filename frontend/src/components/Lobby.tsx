import { useEffect, useRef, useState } from "react";
import useLobby from "../hooks/useLobby";
import { Button, Heading, Textarea, Text, Grid, GridItem, HStack, Flex, Spacer, useToast, Input, InputGroup, InputRightElement, Stack, FormControl, InputLeftElement, SimpleGrid, VStack, Box, Center, AbsoluteCenter, Divider, StackDivider, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import Room from "../classes/Room";
import RoomComponent from "./RoomComponent";
import Welcome from "./Welcome";
import Sidebar from "./Sidebar";
import RoomSidebar from "./RoomSidebar";

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
  let colors = useRef(new Map())
  
  const {isOpen, onClose, onOpen} = useDisclosure()
  const tID = 'joinLobbyError'
  const tID2 = 'joinRoomError'
  
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
      console.log("blank!")
      if (!toast.isActive(tID)) {
        toast({
          id: tID,
          title: 'Could not join lobby',
          description: 'Username already in use',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
    })
    lobby.addListener("joinRoomError", () => {
      if (!toast.isActive(tID2)) {
        toast({
          id: tID2,
          title: 'Could not join room',
          description: 'Incorrect Password',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
    })
  });


  function hexToRGB(hex: string, alpha: number) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

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
      <div>
        <Sidebar otherPlayers={otherPlayers} ourPlayerID={ourPlayerID}/>
        <div>
          <Flex position='sticky' left='5'>
            <AbsoluteCenter>
              <Heading as='h1' size='lg' color={'gray.600'}>Chat Room Lobby</Heading>
            </AbsoluteCenter>
            <Spacer />
            
          </Flex>
        </div>


        <div> 
          <VStack spacing='50%'>
            <Button mt='10' color='gray.600' onClick={() => lobby.createNewRoom("")}>Create New Public Room</Button>
            <Button mt='5' color='gray.600' onClick={onOpen}>Create New Private Room</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Enter Password For Private Room</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <InputGroup pb='6'>
                      <Input value={roomPass} onChange={(e) => setRoomPass(e.target.value)} placeholder="Password" />
                      <InputRightElement w='7.5rem'>
                        <Button size='sm' onClick={() => {
                          lobby.createNewRoom(roomPass)
                          setRoomPass("")
                          onClose()
                        } }>Create Room</Button>
                      </InputRightElement>
                    </InputGroup>
                  </ModalBody>
                </ModalContent>
            </Modal>
          </VStack>
          

        </div>
        <SimpleGrid columns={{base: 1, md: 2, lg: 3}}>
        {rooms.map((r, index) => (
            <GridItem m='5' w='90%' h='100%' key={index}>
              <RoomComponent r={r} /> 
            </GridItem>
          ))}
        </SimpleGrid>


      </div>
    );
  } else if (selectedRoom) {
    for (const player of selectedRoom.playersInRoom) {
      if (colors.current.get(player) === undefined) {
        colors.current.set(player, Math.floor(Math.random() * 16777215).toString(16))
      }
    }
    return (
      <Box m='2'>
        <RoomSidebar colors={colors} ourPlayerID={ourPlayerID} id={selectedRoom.id} otherPlayers={selectedRoom.playersInRoom}/>
      <ul>
      
      <Input
        mt='10'
        value={textToSend}
        onChange={(e) => setTextToSend(e.target.value)}
        placeholder='Send a Message!'
        size='sm'
      />
    
      <VStack>
      <Button 
      mt='5'
      onClick={() => {
        lobby.sendMessage(textToSend, selectedRoom?.id as number)
        setTextToSend("")
      }}>Send Message!
      </Button>
      {selectedRoom.messages.map((playerToMessage: string[]) => {

        return <Box>
          <Text backgroundColor={hexToRGB('#'+colors.current.get(playerToMessage[0]), .5)} as='span'>{playerToMessage[0]}</Text> → {playerToMessage[1]}</Box>
      })}
      
      </VStack>

      
      </ul>
      </Box>
    )
  } else {
    return (
      <></>
    )
  }
}
