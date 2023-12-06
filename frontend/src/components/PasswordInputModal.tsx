import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import useLobby from "../hooks/useLobby";
import { useState } from "react";

export default function PasswordInputModal() : JSX.Element {

    const {isOpen, onOpen, onClose} = useDisclosure()
    let LobbyComponent = useLobby();
    let lobby = LobbyComponent.lobby;
    let [roomPass, setRoomPass] = useState("")

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={roomPass} onChange={(e) => setRoomPass(e.target.value)} placeholder="room password"></Input>
            <Button onClick={() => lobby.createNewRoom(roomPass) }></Button>
          </ModalBody>
          </ModalContent>
        </Modal>

    );
}