import { Button, Card, CardBody, CardFooter, CardHeader, Divider, HStack, Heading, VStack } from "@chakra-ui/react"
import Room from "../classes/Room"
import useLobby from "../hooks/useLobby"

interface RoomComponentProps {
    r: Room
}
export default function RoomComponent({r}: RoomComponentProps): JSX.Element {
    let LobbyComponent = useLobby();
    let lobby = LobbyComponent.lobby;
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
                        lobby.joinRoom(r.id)
                    }}>Join Room</Button>
                    <Button onClick={() => {
                        lobby.deleteRoom(r.id)
                    }}>Delete Room</Button>
                </HStack>
            </CardFooter>
            
            
        </Card>
    </>)
}