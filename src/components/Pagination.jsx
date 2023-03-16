import {
    Box, Button, Center, HStack, Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const Pagination = ({ pagination, action }) => {
    // const [loading , setLoading] = useState(false)

    return (

        <Center mt={5}>
                <HStack>
                    {pagination.current_page != 1 && pagination.current_page != 2 && (
                        <HStack>
                            <Button onClick={() => { action(1) }}> 1 </Button>
                            <Text>...</Text>
                        </HStack>
                    )}
                    {pagination.current_page != 1 && (
                        <Button onClick={() => { action(pagination.current_page - 1) }}> {(pagination.current_page - 1)} </Button>
                    )}

                    <Button colorScheme='blue' isDisabled> {pagination.current_page} </Button>

                    {pagination.current_page != pagination.last_page && (
                        <Button onClick={() => { action(pagination.current_page + 1) }}> {(pagination.current_page + 1)} </Button>
                    )}
                    {pagination.current_page != pagination.last_page && pagination.current_page != (pagination.last_page - 1) && (
                        <HStack>
                            <Text>...</Text>
                            <Button onClick={() => { action(pagination.last_page) }}> {pagination.last_page} </Button>
                        </HStack>
                    )}
                </HStack>
        </Center>


    );
}

export default Pagination;