import { Container, Text, Icon, Center } from "@chakra-ui/react";
import {HiEmojiSad} from 'react-icons/hi'

const NotFound = () => {
    return ( 
        <Container fontWeight='bold'>
            <Center><Icon as={HiEmojiSad} boxSize={20} color='yellow.500' /></Center>
            <Text textAlign='center' fontSize='3xl' color='#2e3149'>404</Text>
            <Text textAlign='center' fontSize='3xl' color='#2e3149'>Page not found</Text>
        </Container>
     );
}
 
export default NotFound;