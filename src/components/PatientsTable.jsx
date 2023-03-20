import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    InputGroup,
    InputLeftElement,
    Input,
    Image,
    Spinner,
    Center,
    Box,
    Icon,
    Text,
    IconButton,
    Button
} from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';
import { AiFillFolderOpen } from 'react-icons/ai'

const PatientsTable = ({ initValue, patients, count, search }) => {
    return (
        <>
            <Text fontSize='sm' color='gray.500' p='10px' align='right'>{count ? count  : patients ? '0' : '-' } Patients</Text>
            <Table variant='simple' colorScheme='blackAlpha'>
                <Thead>
                    <Tr bg='#fafafa'>
                        <Th w='50px' p='5'><Text fontSize='sm' p='0px'>#</Text></Th>
                        <Th maxW='172px'>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input defaultValue={initValue} variant='flushed' type='text' placeholder='Search by Name' onChange={({ target }) => { search(target.value) }} />
                            </InputGroup>
                        </Th>
                        <Th>birth place</Th>
                        <Th>birth Date</Th>
                        <Th w='200px'><Text textAlign='center'>Open</Text></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {patients && patients.map((patient, index) => (
                        <Tr key={index}>
                            <Td p='2'>
                                <IconButton
                                    colorScheme={(patient.gender == 'Male') ? 'blue' : 'pink'}
                                    aria-label='Gender'
                                    size='md'
                                    icon={(patient.gender == 'Male') ? <BsGenderMale size={25} /> : <BsGenderFemale size={25} />}
                                />
                            </Td>
                            <Td><Text fontWeight='normal' fontSize={{base:'sm',lg:'lg'}}>{patient.first_name + " " + patient.last_name}</Text></Td>
                            <Td fontSize={{base:'sm',lg:'lg'}}>{patient.place_of_birth}</Td>
                            <Td fontSize={{base:'sm',lg:'lg'}}>{patient.birth_date}</Td>
                            <Td p={1}>
                                <NavLink to={patient.id.toString()} style={{'display':'block','borderRadius':'5px'}}>
                                    <Button colorScheme='green' w='100%' p={0}>
                                        <AiFillFolderOpen size={20} />
                                        <Text ml={1}>Open</Text>
                                    </Button>
                                </NavLink>
                            </Td>
                        </Tr>
                    ))}
                    {patients && patients.length == 0 && <Tr><Td colSpan='5'><Text textAlign='center' fontWeight='bold' fontSize='xl'>No Data</Text></Td></Tr>}
                </Tbody>
            </Table>
            {!patients && <Center p='10px'>
                <Spinner thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl' />
            </Center>}
        </>
    );
}

export default PatientsTable;