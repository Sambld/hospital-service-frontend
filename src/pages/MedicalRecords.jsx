import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    Text,
    Divider,
    GridItem,
    Grid,
    Center,
    Spinner
} from "@chakra-ui/react"

// Icons
import { AiFillFile } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";

// Hooks
import useLoader from "../hooks/useLoader";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Components
import Pagination from "../components/Pagination";



const MedicalRecords = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        getMedicalRecords();
    }, [searchParams])

    const requestUrl = () => {
        const { q, startDate, endDate, status, page } = Object.fromEntries(searchParams.entries());
        const SEARCH_PARAMS = {
            q: q && `q=${q}`,
            startDate: startDate && `startDate=${startDate}`,
            endDate: endDate && `endDate=${endDate}`,
            status: status && status !== 'all' ? status === 'In hospital' ? `isActive=${status}` : `isInactive=${status}` : null,
            page: page && `page=${page}`,
            pagination: 'withPagination=true'
        };

        const PARAMS = Object.values(SEARCH_PARAMS).filter(Boolean).join('&');
        const BASE_URL = '/medical-records';
        const DELIMITER = '&';

        console.log(`${BASE_URL}${PARAMS ? `?${PARAMS}` : ''}`)
        return `${BASE_URL}${PARAMS ? `?${PARAMS}` : ''}`;
    };

    const getMedicalRecords = () => {
        setData(null);
        setLoading(true);
        useLoader(requestUrl()).then((res) => {
            setData(res);
            setLoading(false);
        }).catch((err) => {
            setData(null);
            setLoading(false);
        })
    }

    const handleSearchParams = (paramsToUpdate) => {
        setSearchParams((prevParams) => {
            const newParams = Object.fromEntries(prevParams.entries());
            Object.entries(paramsToUpdate).forEach(([key, value]) => {
                if (value === null || value === undefined) {
                    delete newParams[key];
                } else {
                    newParams[key] = value;
                }
            });
            return newParams;
        });
    };

    const handlePagination = (e) => {
        setData(null)
        handleSearchParams({ page: e })
    }
    return (
        <Box>
            <Heading>Medical Records</Heading>
            <Box bg='white' w='100%' m='10px' p='20px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                <Text fontSize='sm' color='gray.500' p='10px' align='right'>Showing {data && data.data.length} of {data && data.total} Medical Records</Text>

                {/* <Box p='10px' mb='10px' w='100%' display='flex' justifyContent='space-between' gap={2}>
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents='none'
                            children={<SearchIcon color='gray.300' />}
                        />
                        <Input defaultValue={searchParams.get('q') || ''} variant='outline' type='text' placeholder='Search by Name' onChange={(e) => setSearchParams({ q: e.target.value })} />
                    </InputGroup>
                    <Button colorScheme='blue'>
                        Filter
                    </Button>
                    <IconButton
                        colorScheme='blackAlpha'
                        bg='gray.600'
                        aria-label='Refresh'
                        icon={<BiRefresh size={25} />}
                        onClick={getMedicalRecords}
                    />
                </Box> */}
                <Box bg='gray.50' border='2px' borderColor='gray.100' borderRadius={10} p='10px' mb='10px' w='100%' display='flex' flexDirection='column' gap={2}>
                    <Box w='100%' display='flex' flexDirection='column' gap={2}>
                        <Text fontWeight='bold' fontSize='md'>Filter By Date</Text>
                        <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                            <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                                <Text>From</Text>
                                <Input
                                    type='date'
                                    bg='white'
                                    value={searchParams.get('startDate') || ''}
                                    onChange={(e) => handleSearchParams({ startDate: e.target.value })}
                                />
                            </Box>
                            <Divider orientation='vertical' />
                            <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                                <Text>To:</Text>
                                <Input
                                    type='date'
                                    bg='white'
                                    value={searchParams.get('endDate') || ''}
                                    onChange={(e) => handleSearchParams({ endDate: e.target.value })}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box w='100%' display='flex' flexDirection='column' gap={2}>
                        <Text fontWeight='bold' fontSize='md'>Filter By Status</Text>
                        <Box w='100%' display='flex' gap={2}>
                            <Button
                                bg={searchParams.get('status') === 'all' ? 'gray.600' : 'gray.50'}
                                color={searchParams.get('status') === 'all' ? 'white' : null}
                                onClick={() => handleSearchParams({ status: 'all' })}
                            >
                                All
                            </Button>
                            <Button
                                bg={searchParams.get('status') === 'In hospital' ? 'red.600' : 'gray.50'}
                                color={searchParams.get('status') === 'In hospital' ? 'white' : null}
                                onClick={() => handleSearchParams({ status: 'In hospital' })}
                            >
                                In hospital
                            </Button>
                            <Button
                                bg={searchParams.get('status') === 'Discharged' ? 'green.600' : 'gray.50'}
                                color={searchParams.get('status') === 'Discharged' ? 'white' : null}
                                onClick={() => handleSearchParams({ status: 'Discharged' })}
                            >
                                Discharged
                            </Button>
                        </Box>
                    </Box>
                    {/* <IconButton
                        colorScheme='blackAlpha'
                        bg='gray.600'
                        aria-label='Refresh'
                        icon={<BiRefresh size={25} />}
                        onClick={getMedicalRecords}
                    /> */}
                    <Button
                        colorScheme='blackAlpha'
                        bg='gray.600'
                        leftIcon={<BiRefresh size={25} />}
                        onClick={getMedicalRecords}
                    >
                        Refresh
                    </Button>

                </Box>
                <Box>
                    <Box>
                        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                            {data?.data?.map((item, index) => (
                                <GridItem key={index}>
                                    <Box bg='gray.50' borderRadius='md' border='2px' borderColor='gray.200' overflow='hidden'>
                                        {/* <Box bg={item.patient_leaving_date ? 'green.500' : 'red.500'} p={2}>
                                            <Text fontWeight='bold' fontSize='md' textAlign='center' color='white'>
                                                {item.patient_leaving_date ? 'Discharged' : 'In hospital'}
                                            </Text>
                                        </Box> */}
                                        <Box bg={item.patient_leaving_date ? 'green.100' : 'red.100'} p={2}>
                                            <Text fontWeight='bold' fontSize='md' textAlign='center' color='gray.500'>
                                                Medical Record #{item.id}
                                            </Text>
                                        </Box>

                                        <Box p={3}>
                                            <Text fontSize='sm' color='gray.500'>Patient: {item.patient.first_name} {item.patient.last_name}</Text>
                                            <Text fontSize='sm' color='gray.500'>Entry day: {item.patient_entry_date}</Text>
                                            <Text fontSize='sm' color='gray.500'>Discharge day: {item.patient_leaving_date || 'still in hospital'}</Text>
                                        </Box>
                                        <Box bg='gray.100' p={0}>
                                            <Button
                                                bg='white'
                                                leftIcon={<AiFillFile color='blue.700' />}
                                                colorScheme='blue'
                                                borderRadius={0}
                                                border={0}
                                                variant='outline'
                                                p='10px'
                                                px={5}
                                                w='100%'
                                                onClick={() => navigate(`/patients/${item.patient_id}?med=${item.id}`)}
                                            >
                                                <Text mr='5px' fontSize={15} fontWeight='normal'>Detail</Text>
                                            </Button>
                                        </Box>
                                    </Box>
                                </GridItem>
                            ))}
                        </Grid>
                        {data?.data?.length === 0 && <Text textAlign='center' fontWeight='bold' fontSize='xl'>No Data</Text>}
                        {loading && <Center p='10px'>
                            <Spinner thickness='5px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='gray.500'
                                size='xl' />
                        </Center>}
                        {
                            data && data.last_page > 1 &&
                            <Pagination pagination={data} action={handlePagination} />
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default MedicalRecords;