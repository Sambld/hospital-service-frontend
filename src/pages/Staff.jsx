import { SearchIcon } from "@chakra-ui/icons";
import { Box, Icon, Button, Editable, EditableInput, EditablePreview, HStack, Image, Spacer, Tab, Table, TableCaption, TableContainer, TabList, TabPanel, TabPanels, Tabs, Tbody, Td, Text, Tfoot, Th, Thead, Tr, InputLeftElement, Input, InputGroup } from "@chakra-ui/react";



const Staff = () => {
    return (
        <Box>
            <HStack>
                <Text fontSize='3xl' color='#2e3149' ml='20px'>Staff</Text>
                <Spacer />
                <Button colorScheme='blue' variant='outline' fontWeight='normal'>IMPORT DATA</Button>
            </HStack>
            <Box bg='white' w='100%' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                <Text fontSize='sm' color='gray.500' p='10px' align='right'>10,000 Patients</Text>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr bg='#fafafa'>
                                <Th w='50px' p='5'>#</Th>
                                <Th maxW='100px'>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents='none'
                                            children={<SearchIcon color='gray.300' />}
                                        />
                                        <Input variant='flushed' type='text' placeholder='Search by Name' />
                                    </InputGroup>
                                </Th>
                                <Th>Role</Th>
                                <Th>Options</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td p='1'><Image border='2px' borderColor='gray.200' boxSize='40px' src='https://bit.ly/dan-abramov' alt='Dan Abramov' /></Td>
                                <Td>Youcef Hemadou</Td>
                                <Td>SUPER ADMIN</Td>
                                <Td>EDIT DELETE</Td>
                            </Tr>
                            <Tr>
                                <Td p='1'><Image border='2px' borderColor='gray.200' boxSize='40px' src='https://bit.ly/dan-abramov' alt='Dan Abramov' /></Td>
                                <Td>Bouloudnine Sami</Td>
                                <Td>SUPER ADMIN</Td>
                                <Td>EDIT DELETE</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Staff;