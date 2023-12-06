import { Button, Card, CardBody, CardFooter, CardHeader, Divider, HStack, Heading, Input, VStack, useToast } from "@chakra-ui/react"
import Room from "../classes/Room"
import useLobby from "../hooks/useLobby"
import { useEffect, useState } from "react";

interface RoomComponentProps {
    r: Room
}
export default function RoomComponent({r}: RoomComponentProps): JSX.Element {
    let toast = useToast()
    let LobbyComponent = useLobby();
    let lobby = LobbyComponent.lobby;
    let [pass, setPass] = useState("")
    
    useEffect(() => {
        console.log("ourplayer is " + lobby.ourPlayerID)
        lobby.addListener("joinRoomError", () => {
            toast({
              title: 'room password is incorrect',
              description: 'fuck you',
              status: 'error',
              duration: 2000,
              isClosable: true,
            })
          })
    })
    return (<>
       <Card background={'#d4d6d9'}>

        <CardHeader>
            <Heading size='md'>Room ID: {r.id}</Heading>
        </CardHeader>

        <CardBody borderRadius='lg'>
            Users In Room: 
            <VStack>
           {r.playersInRoom.map(pid => <>{pid}</>)}
            </VStack>

        </CardBody>
        
        <Divider />
            <CardFooter>
                <HStack>
                    <Button onClick={() => {
                        lobby.joinRoom(r.id, pass)
                    }}>Join Room</Button>
                    <Input value={pass} onChange={(e) => setPass(e.target.value)}></Input>
                    {r.owner === lobby.ourPlayerID ? <Button onClick={() => {
                        lobby.deleteRoom(r.id)
                    }}>Delete Room</Button>: <></> } 
                </HStack>
            </CardFooter>
            
            
        </Card>
    </>)
}