import { Box, Container, Heading, HStack, Image, Text } from "@chakra-ui/react";



const Profile = () => {
    return ( 
        <Box>
            <Text fontSize='3xl' color='#2e3149' ml='20px'>Profile</Text>
            <Box bg='white' w='100%' m='10px' p='20px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                <HStack spacing={6}>
                    <Image border='2px' borderColor='gray.200' boxSize='200px' src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                    <Text fontSize='5xl' color='#2e3149'>Youcef Hemadou</Text>
                </HStack>
            </Box>
        </Box>
     );
}
 
export default Profile;