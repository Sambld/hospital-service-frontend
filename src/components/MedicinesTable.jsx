import { Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftElement, Input, Image, Spinner, Center, Box, Icon, Text, IconButton, Button, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import { TbMedicineSyrup } from 'react-icons/tb';
import { AiFillFolderOpen } from 'react-icons/ai'

import { useTranslation } from "react-i18next";

const MedicinesTable = ({ initValue, medicines, count, search }) => {

    const { t, i18n } = useTranslation();
    const colorModeValue = useColorModeValue('gray.600', 'gray.50');

    return (
        <>
            <Text fontSize='sm' color='gray.500' p='10px' align='right'>{count ? count : medicines ? '0' : '-'} Medicines</Text>
            <Table variant='simple' colorScheme='blackAlpha'>
                <Thead>
                    <Tr bg={useColorModeValue('#fafafa', 'gray.800')}>
                        <Th>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input defaultValue={initValue} variant='flushed' type='text' placeholder='Search by Name' onChange={({ target }) => { search(target.value) }} />
                            </InputGroup>
                        </Th>
                        <Th display={{ base: 'none', lg: 'table-cell' }}>
                            {t('medicine.quantity')}
                        </Th>
                        <Th display={{ base: 'none', xl: 'table-cell' }}>
                            {t('medicine.expirationDate')}
                        </Th>
                        <Th>
                            <Text textAlign='center'>
                                {t('medicine.detail')}
                            </Text>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {medicines && medicines.map((medicine, index) => (
                        <Tr key={index}>
                            <Td>
                                <Text color={colorModeValue} fontWeight='normal' fontSize={20}>
                                    {medicine.name}
                                </Text>
                            </Td>
                            <Td color={colorModeValue} display={{ base: 'none', lg: 'table-cell' }}>
                                {medicine.quantity}
                            </Td>
                            <Td color={colorModeValue} display={{ base: 'none', xl: 'table-cell' }}>
                                {medicine.expiration_date}
                            </Td>
                            <Td>
                                <NavLink to={medicine.id.toString()}>
                                    <Button colorScheme='blue' w='100%'>
                                        {t('medicine.detail')}
                                    </Button>
                                </NavLink>
                            </Td>
                        </Tr>
                    ))}
                    {medicines && medicines.length === 0 && (
                        <Tr>
                            <Td colSpan='5'>
                                <Text textAlign='center' fontWeight='bold' fontSize='xl'>
                                    {t('global.noData')}
                                </Text>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
            {!medicines && (
                <Box>
                    {[...Array(15)].map((i, index) => (
                        <Box display='flex' p='10px' key={index.toString() + 'skeleton'}>
                            <Skeleton w='60%' ml='5' h='50px'>
                                <Text ml='5'>Loading...</Text>
                            </Skeleton>
                            <Skeleton w='10%' ml='5'>
                                <Text ml='5'>Loading...</Text>
                            </Skeleton>
                            <Skeleton w='30%' ml='5'>
                                <Text ml='5'>Loading...</Text>
                            </Skeleton>
                            <Skeleton w='20%' ml='5'>
                                <Text ml='5'>Loading...</Text>
                            </Skeleton>
                        </Box>
                    ))}
                    <Center p='10px' gap={2}>
                        {['abc'].map((i) => (
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

export default MedicinesTable;