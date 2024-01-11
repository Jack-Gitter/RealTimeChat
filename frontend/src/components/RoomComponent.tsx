import { AbsoluteCenter, Text, Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Divider, HStack, Heading, Input, VStack, useToast, Stack } from "@chakra-ui/react"
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
        
    })
    return (<>
       <Card background={'#d4d6d9'} color='gray.600'>

        <CardHeader>
            <Heading size='md'>Room ID: {r.id}</Heading>
        </CardHeader>

        <CardBody borderRadius='lg'>
        <VStack>
            <Box><Text as='b'>Users In Room: </Text></Box>
           {r.playersInRoom.map(pid => <Box>{pid}</Box>)}
            </VStack>
        </CardBody>
        <Divider />
            <CardFooter position={'relative'} w='100%'>
                <Stack w='100%' spacing={3}>
                    <>
                <Button color='gray.600' m='5px' w='100%' onClick={() => {
                    lobby.joinRoom(r.id, pass)
                }}>Join Room</Button>
                {r.owner === lobby.ourPlayerID ? <Button color='gray.600' m='5px' w='100%' onClick={() => {
                    lobby.deleteRoom(r.id)
                }}>Delete Room</Button>: <></> } 
                </>
                {r.password === '' ?  <></> : <Input whiteSpace="pre-line" m='5px' placeholder="password" value={pass} onChange={(e) => setPass(e.target.value)}></Input> }
                </Stack>
            </CardFooter>
        </Card>
    </>)
}