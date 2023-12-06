import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, Text, DrawerHeader, DrawerOverlay, Heading, Input, VStack, useDisclosure, AbsoluteCenter, DrawerFooter } from "@chakra-ui/react";
import React from "react";
import useLobby from "../hooks/useLobby";

interface SidebarProps {
    otherPlayers: string[]
    id: number
    ourPlayerID: string
}

export default function RoomSidebar({otherPlayers, id, ourPlayerID}: SidebarProps): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure()

    let LobbyComponent = useLobby();
    let lobby = LobbyComponent.lobby;
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
                <Text><Text as='b'>Room ID: </Text>{id}</Text>
                <Text as='b' size='sm'>Other Users in Room: </Text>
                {otherPlayers.map((pID) => (
                    ourPlayerID !== pID ?  <Box>{pID}</Box> : <></>
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
