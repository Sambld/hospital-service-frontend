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
    Button,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';

import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';
import { AiFillFolderOpen } from 'react-icons/ai'

// Translation
import { useTranslation } from 'react-i18next';


const PatientsTable = ({ initValue, patients, count, search }) => {

    const colorModeValue = useColorModeValue('gray.600', 'gray.50');
    const colorModeValue2 = useColorModeValue('gray.500', 'gray.300');
    const colorModeValue3 = useColorModeValue('blue.50', 'blue.900');
    const colorModeValue4 = useColorModeValue('pink.50', 'pink.900');
    const colorModeValue5 = useColorModeValue('gray.50', 'gray.50');

    const { t, i18n } = useTranslation();

    return (
        <>
            <Table variant='simple' colorScheme='blackAlpha'>
                <Thead>
                    <Tr bg={useColorModeValue('#fafafa', 'gray.800')}>
                        <Th w='50px' p='5'><Text fontSize='sm' p='0px'>#</Text></Th>
                        <Th>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input defaultValue={initValue} variant='flushed' type='text' placeholder={t('patient.placeholder')} onChange={({ target }) => { search(target.value) }} />
                            </InputGroup>
                        </Th>
                        <Th display={{ base: 'none', lg: 'table-cell' }}>
                            {t('patient.phoneNumber')}
                        </Th>
                        <Th display={{ base: 'none', xl: 'table-cell' }}>
                            {t('patient.birthDate')}
                        </Th>
                        <Th w='200px'>
                            <Text fontSize='sm' color='gray.500' p='10px' align='right'>
                                {count ? count : patients ? '0' : '-'} {" "}
                                {t('patient.title')}
                            </Text>

                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {patients && patients.map((patient, index) => (
                        <Tr
                            key={index}
                            bg={(patient.gender === 'Male') ? colorModeValue3 : colorModeValue4}
                        >
                            <Td p='2'>
                                <IconButton
                                    colorScheme={(patient.gender === 'Male') ? 'blue' : 'pink'}
                                    color={colorModeValue5}
                                    aria-label='Gender'
                                    size='md'
                                    icon={(patient.gender === 'Male') ? <BsGenderMale size={25} /> : <BsGenderFemale size={25} />}
                                />
                            </Td>
                            <Td>
                                <Text color={colorModeValue} fontWeight='normal' fontSize={{ base: 'sm', lg: 'lg' }}>
                                    {patient.first_name + " " + patient.last_name}
                                </Text>
                            </Td>
                            <Td color={colorModeValue} display={{ base: 'none', lg: 'table-cell' }} fontSize={{ base: 'sm', lg: 'lg' }}>
                                {patient.phone_number}
                            </Td>
                            <Td display={{ base: 'none', xl: 'table-cell' }} fontSize={{ base: 'sm', lg: 'lg' }}>
                                <Text color={colorModeValue} fontSize={{ base: 'sm', lg: 'lg' }}>
                                    {patient.birth_date}
                                </Text>
                                <Text fontSize={{ base: 'xs', lg: 'sm' }} color={colorModeValue2}>
                                    {patient.place_of_birth}
                                </Text>
                            </Td>
                            <Td p={1}>
                                <NavLink to={patient.id.toString()} style={{ 'display': 'block', 'borderRadius': '5px' }}>
                                    <Button colorScheme={(patient.gender === 'Male') ? 'blue' : 'pink'} w='100%' p={0}>
                                        <AiFillFolderOpen size={20} />
                                        <Text mx={3}>
                                            {t('patient.open')}
                                        </Text>
                                    </Button>
                                </NavLink>
                            </Td>
                        </Tr>
                    ))}
                    {patients && patients.length === 0 && (
                        <Tr>
                            <Td colSpan='5'>
                                <Text textAlign='center' fontWeight='bold' fontSize='xl'>
                                    No Data
                                </Text>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
            {/* {!patients && <Center p='10px'>
                <Spinner thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl' />
            </Center>} */}
            {!patients && (
                <Box>
                    {/* array 1 to 15 */}
                    {[...Array(15)].map((i,index) => (
                        <Box display='flex' p='10px' key={index.toString() + 'skeleton'}>
                            <Skeleton boxSize='50px' borderRadius='md'>
                                <Text>Loading...</Text>
                            </Skeleton>
                            <Skeleton w='30%' ml='5' borderRadius='md'>
                                <Text ml='5'>Loading...</Text>
                            </Skeleton>
                            <Skeleton w='30%' ml='5' borderRadius='md'>
                                <Text ml='5'>Loading...</Text>
                            </Skeleton>
                            <Skeleton w='30%' ml='5' borderRadius='md'>
                                <Text ml='5'>Loading...</Text>
                            </Skeleton>
                            <Skeleton w='20%' ml='5' borderRadius='md'>
                                <Text ml='5'>Loading...</Text>
                            </Skeleton>
                        </Box>
                    ))}
                    <Center p='10px' gap={2}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i}>
                                <Text p={2} ml='5'>1</Text>
                            </Skeleton>
                        ))}
                    </Center>

                </Box>

            )}
        </>
    );
}

export default PatientsTable;