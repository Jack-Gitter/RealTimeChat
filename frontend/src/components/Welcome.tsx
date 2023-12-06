import { Flex, Stack, Heading, FormControl, InputGroup, Input, InputRightElement, Button} from "@chakra-ui/react";
import useLobby from "../hooks/useLobby";

interface WelcomeProps {
    username: string, 
    setUsername: React.Dispatch<React.SetStateAction<string>>
}

export default function Welcome({username, setUsername}: WelcomeProps): JSX.Element {
    let LobbyComponent = useLobby()
    let lobby = LobbyComponent.lobby;
    return (
        <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center">
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
          backgroundColor='gray.100'
          padding='50'
          borderRadius={'10'}> 
          <Heading color="teal.400">Dead Simple Chat Application</Heading>
            <FormControl pt={10} >
              <InputGroup >
                <Input placeholder="enter username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <InputRightElement width='7rem'>
                  <Button size='sm' color={'gray.540'} background={'gray.200'}
                  onClick={() => {
                    lobby.addUserToLobby(username);
                  }}>
                  Enter Lobby
                </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>
      </Flex>
    )
}