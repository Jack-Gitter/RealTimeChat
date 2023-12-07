import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, Text, DrawerHeader, DrawerOverlay, Heading, Input, VStack, useDisclosure, AbsoluteCenter, DrawerFooter } from "@chakra-ui/react";
import React from "react";
import useLobby from "../hooks/useLobby";

interface SidebarProps {
    otherPlayers: string[]
    id: number
    ourPlayerID: string
    colors: React.MutableRefObject<Map<any, any>>
}

export default function RoomSidebar({otherPlayers, id, ourPlayerID, colors}: SidebarProps): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure()


    let LobbyComponent = useLobby();
    let lobby = LobbyComponent.lobby;


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


    return (
    <>
        <Button ml='1' mt='1' background='gray.500' color={'white'} onClick={onOpen}>
        ≡
        </Button>
        <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        >
        <DrawerOverlay />
        <DrawerContent>
        <DrawerCloseButton />
            <DrawerHeader>Room Information</DrawerHeader>
            <DrawerBody>
                <Text color='gray.600'><Text as='b'>Room ID: </Text>{id}</Text>
                <Text color='gray.600' as='b' size='sm'>Other Users in Room: </Text>
                {otherPlayers.map((pID) => (
                    ourPlayerID !== pID ?  <Box backgroundColor={hexToRGB('#'+colors.current.get(pID), .5)}>{pID}</Box> : <></>
                ))}
            </DrawerBody>
            <DrawerFooter>
                <Button float='left' onClick={() => {
                    lobby.leaveRoom(id as number)
                }}>Leave room</Button>
            </DrawerFooter>
        </DrawerContent>
        </Drawer>
    </>
    )
}
