import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, Text, DrawerHeader, DrawerOverlay, Heading, Input, VStack, useDisclosure, AbsoluteCenter } from "@chakra-ui/react";
import React from "react";

interface SidebarProps {
    ourPlayerID: string
    otherPlayers: string[]
}
export default function Sidebar({ourPlayerID, otherPlayers}: SidebarProps): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
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
            <DrawerHeader>Lobby Information</DrawerHeader>
            <DrawerBody>
            <VStack borderRadius={10} p={5}>
                <Text><Text as='b'>Username:</Text> {ourPlayerID}</Text>
                <Text as='b' size='sm'>Other Users in Lobby: </Text>
                {otherPlayers.map((pID) => (
                    <Box>{pID}</Box>
                ))}
            </VStack>
            </DrawerBody>
        </DrawerContent>
        </Drawer>
    </>
    )
}
