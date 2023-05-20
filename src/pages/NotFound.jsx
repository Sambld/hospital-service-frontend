import { Box, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                bg={useColorModeValue('blue.700', 'blue.300')}
                backgroundClip="text"
            >
                404
            </Heading>
            <Text fontSize="18px" mt={3} mb={2} color={useColorModeValue('gray.500', 'gray.50')}>
                Page Not Found
            </Text>
            <Text color={useColorModeValue('gray.500', 'gray.50')}
                mb={6}>
                The page you're looking for does not seem to exist
            </Text>
            <Link to='/'>
                <Button
                    colorScheme="teal"
                    bg="blue.700"
                    color="white"
                    variant="solid">
                    Go to Home
                </Button>
            </Link>

        </Box>
    );
}

export default NotFound;