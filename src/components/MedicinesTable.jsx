import { Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftElement, Input, Image, Spinner, Center, Box, Icon, Text, IconButton, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import { TbMedicineSyrup } from 'react-icons/tb';
import {AiFillFolderOpen} from 'react-icons/ai'

const MedicinesTable = ({ initValue, medicines, count, search }) => {
    return (
        <>
            <Text fontSize='sm' color='gray.500' p='10px' align='right'>{count ? count  : medicines ? '0' : '-' } Medicines</Text>
            <Table variant='simple' colorScheme='blackAlpha'>
                <Thead>
                    <Tr bg='#fafafa'>
                        <Th maxW='154px'>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input defaultValue={initValue} variant='flushed' type='text' placeholder='Search by Name' onChange={({ target }) => { search(target.value) }} />
                            </InputGroup>
                        </Th>
                        <Th>quantity</Th>
                        <Th>expiration Date</Th>
                        <Th><Text textAlign='center'>Detail</Text></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {medicines && medicines.map((medicine, index) => (
                        <Tr key={index}>
                            <Td><Text fontWeight='normal' fontSize={20}>{medicine.name}</Text></Td>
                            <Td>{medicine.quantity}</Td>
                            <Td>{medicine.expiration_date}</Td>
                            <Td><NavLink to={medicine.id.toString()}><Button colorScheme='blue' w='100%'>Detail</Button></NavLink></Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {!medicines && <Center p='10px'>
                <Spinner thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl' />
            </Center>}
        </>
    );
}

export default MedicinesTable;