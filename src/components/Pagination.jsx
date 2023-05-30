import {
    Box, Button, Center, HStack, Input, Select, Text,useColorModeValue
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const Pagination = ({ pagination, action }) => {
    // const [loading , setLoading] = useState(false)

    const colorModeValue = useColorModeValue('gray.100', 'gray.300')

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            action(e.target.value)
        }
    }
    return (

        <Center mt={5}>
            <HStack>
                {pagination.current_page != 1 && pagination.current_page != 2 && (
                    <HStack>
                        <Button bg={colorModeValue} onClick={() => { action(1) }}> 1 </Button>
                        {pagination.current_page != 3 && <Text color={useColorModeValue('gray.900', 'white')}>...</Text>}
                    </HStack>
                )}
                {pagination.current_page != 1 && (
                    <Button bg={colorModeValue} onClick={() => { action(pagination.current_page - 1) }}> {(pagination.current_page - 1)} </Button>
                )}
                {/* <Input type='number' defaultValue={pagination.current_page} onKeyDown={handleKeyPress} w='100px' textAlign='center' /> */}
                {pagination.last_page == 2 ? (
                    <Button bg={colorModeValue} colorScheme='blue' isDisabled> {pagination.current_page} </Button>
                ) : (
                    <Select defaultValue={pagination.current_page} onChange={(e) => { action(e.target.value) }} textAlign='center' bg={colorModeValue} colorScheme='blue' w='100px'>
                        {[...Array(pagination.last_page).keys()].map((i) => (
                            <option key={i} value={i + 1} style={{ backgroundColor: 'white' }} >
                                {i + 1}</option>
                        ))}
                    </Select>
                )}
                {pagination.current_page != pagination.last_page && (
                    <Button bg={colorModeValue} onClick={() => { action(pagination.current_page + 1) }}> {(pagination.current_page + 1)} </Button>
                )}
                {pagination.current_page != pagination.last_page && pagination.current_page != (pagination.last_page - 1) && (
                    <HStack>
                        {pagination.current_page != (pagination.last_page - 2) && <Text color={useColorModeValue('gray.900', 'white')}>...</Text>}
                        <Button bg={colorModeValue} onClick={() => { action(pagination.last_page) }}> {pagination.last_page} </Button>
                    </HStack>
                )}
            </HStack>
        </Center>


    );
}

export default Pagination;