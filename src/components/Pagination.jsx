import {
    Box, Button, Center, HStack, Input, Select, Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const Pagination = ({ pagination, action }) => {
    // const [loading , setLoading] = useState(false)

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
                        <Button onClick={() => { action(1) }}> 1 </Button>
                        {pagination.current_page != 3 && <Text>...</Text>}
                    </HStack>
                )}
                {pagination.current_page != 1 && (
                    <Button onClick={() => { action(pagination.current_page - 1) }}> {(pagination.current_page - 1)} </Button>
                )}
                {/* <Input type='number' defaultValue={pagination.current_page} onKeyDown={handleKeyPress} w='100px' textAlign='center' /> */}
                {pagination.last_page == 2 ? (
                    <Button colorScheme='blue' isDisabled> {pagination.current_page} </Button>
                ) : (
                    <Select defaultValue={pagination.current_page} onChange={(e) => { action(e.target.value) }} textAlign='center'>
                        {[...Array(pagination.last_page).keys()].map((i) => (
                            <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                    </Select>
                )}
                {pagination.current_page != pagination.last_page && (
                    <Button onClick={() => { action(pagination.current_page + 1) }}> {(pagination.current_page + 1)} </Button>
                )}
                {pagination.current_page != pagination.last_page && pagination.current_page != (pagination.last_page - 1) && (
                    <HStack>
                        {pagination.current_page != (pagination.last_page - 2) && <Text>...</Text>}
                        <Button onClick={() => { action(pagination.last_page) }}> {pagination.last_page} </Button>
                    </HStack>
                )}
            </HStack>
        </Center>


    );
}

export default Pagination;