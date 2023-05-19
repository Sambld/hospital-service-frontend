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
    Spinner,
    Skeleton,
    Breadcrumb,
    BreadcrumbItem,
} from "@chakra-ui/react"

// Icons
import { AiFillFile, AiFillFilter } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";

// Hooks
import useLoader from "../hooks/useLoader";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";

// Components
import Pagination from "../components/Pagination";

// Translations
import { useTranslation } from "react-i18next";



const MedicalRecords = () => {
    const user = useOutletContext()
    const [data, setData] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(true);

    const { t, i18n } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        getMedicalRecords();
    }, [searchParams])

    const requestUrl = () => {
        const { q, id, startDate, endDate, status, page } = Object.fromEntries(searchParams.entries());
        const SEARCH_PARAMS = {
            q: q && `q=${q}`,
            startDate: startDate && `startDate=${startDate}`,
            endDate: endDate && `endDate=${endDate}`,
            status: status && status !== 'all' ? status === 'active' ? `isActive=${status}` : `isInactive=${status}` : null,
            page: page && `page=${page}`,
            pagination: 'withPagination=true',
            id: id && id == 'mineOnly' ? `mineOnly=true` : null, // 'mine' or 'all
            Userid: user.role === 'doctor' ? `doctorId=${user.id}` : user.role === 'nurse' ? `nurseId=${user.id}` : null
        };

        const PARAMS = Object.values(SEARCH_PARAMS).filter(Boolean).join('&');
        const BASE_URL = '/medical-records';
        const DELIMITER = '&';

        // console.log(`${BASE_URL}${PARAMS ? `?${PARAMS}` : ''}`)
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
            <Box mb={5} mt={1}>
                <Breadcrumb fontSize={{ base: "md", lg: '3xl' }}>
                    <BreadcrumbItem>
                        <Text color="gray.500" fontSize={{ base: "md", lg: '3xl' }} ml='20px'>
                            {t('medicalRecord.title')}
                        </Text>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Box>
            <Box bg='white' w='100%' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                <Text fontSize='sm' color='gray.500' p='10px' align='right'>Showing {data && data.data.length} of {data && data.total} Medical Records</Text>

                <Box p='10px' mb='10px' w='100%' display='flex' justifyContent='space-between' gap={2}>
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents='none'
                            children={<SearchIcon color='gray.300' />}
                        />
                        <Input defaultValue={searchParams.get('q') || ''} variant='outline' type='text' placeholder={t('medicalRecord.searchPlaceholder')} onChange={(e) => handleSearchParams({ q: e.target.value ? e.target.value : null })} />
                    </InputGroup>
                    <Button colorScheme='blue' leftIcon={<AiFillFilter />} onClick={() => setShowFilter((prev) => !prev)}>
                        {t('medicalRecord.filter')}
                    </Button>
                    <IconButton
                        colorScheme='blackAlpha'
                        bg='gray.600'
                        aria-label='Refresh'
                        icon={<BiRefresh size={25} />}
                        onClick={getMedicalRecords}
                    />
                </Box>
                {showFilter &&
                    <Box bg='gray.50' border='2px' borderColor='gray.100' borderRadius={10} p='10px' mb='10px' w='100%' display='flex' flexDirection='column' gap={2}>
                        <Box w='100%' display='flex' flexDirection='column' gap={2}>
                            <Text fontWeight='bold' fontSize='md'>
                                {t('medicalRecord.filterByDate')}
                            </Text>
                            <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                                <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                                    <Text>
                                        {t('medicalRecord.from')}:
                                    </Text>
                                    <Input
                                        type='date'
                                        bg='white'
                                        value={searchParams.get('startDate') || ''}
                                        onChange={(e) => handleSearchParams({ startDate: e.target.value })}
                                    />
                                </Box>
                                <Divider orientation='vertical' />
                                <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                                    <Text>
                                        {t('medicalRecord.to')}:
                                    </Text>
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
                            <Text fontWeight='bold' fontSize='md'>
                                {t('medicalRecord.filterByStatus')}
                            </Text>
                            <Box w='100%' display='flex' gap={2}>
                                <Button
                                    bg={searchParams.get('status') != 'active' && searchParams.get('status') != 'close' ? 'gray.600' : 'gray.50'}
                                    color={searchParams.get('status') != 'active' && searchParams.get('status') != 'close' ? 'white' : null}
                                    onClick={() => handleSearchParams({ status: 'all' })}
                                >
                                    {t('medicalRecord.all')}
                                </Button>
                                <Button
                                    bg={searchParams.get('status') === 'active' ? 'green.600' : 'gray.50'}
                                    color={searchParams.get('status') === 'active' ? 'white' : null}
                                    onClick={() => handleSearchParams({ status: 'active' })}
                                >
                                    {t('medicalRecord.active')}
                                </Button>
                                <Button
                                    bg={searchParams.get('status') === 'close' ? 'red.600' : 'gray.50'}
                                    color={searchParams.get('status') === 'close' ? 'white' : null}
                                    onClick={() => handleSearchParams({ status: 'close' })}
                                >
                                    {t('medicalRecord.close')}
                                </Button>
                            </Box>
                        </Box>
                        <Box w='100%' display='flex' flexDirection='column' gap={2}>
                            <Text fontWeight='bold' fontSize='md'>Filter By Id</Text>
                            <Box w='100%' display='flex' gap={2}>
                                <Button
                                    bg={searchParams.get('id') != 'all' && searchParams.get('id') != 'mineOnly' ? 'gray.600' : 'gray.50'}
                                    color={searchParams.get('id') != 'all' && searchParams.get('id') != 'mineOnly' ? 'white' : null}
                                    onClick={() => handleSearchParams({ id: null })}
                                >
                                    {t('medicalRecord.all')}
                                </Button>
                                <Button
                                    bg={searchParams.get('id') === 'mineOnly' ? 'green.600' : 'gray.50'}
                                    color={searchParams.get('id') === 'mineOnly' ? 'white' : null}
                                    onClick={() => handleSearchParams({ id: 'mineOnly' })}
                                >
                                    {t('medicalRecord.mineOnly')}
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
                        {/* <Box w='100%' display='flex' flexDirection='column' gap={2}>
                        <Text fontWeight='bold' fontSize='md'>Filter By Medical Record ID</Text>
                        <Input
                            type='text'
                            bg='white'
                            value={searchParams.get('id') || ''}
                            onChange={(e) => handleSearchParams({ id: e.target.value })}
                        />
                    </Box> */}


                        {/* <Button
                        colorScheme='blackAlpha'
                        bg='gray.600'
                        leftIcon={<BiRefresh size={25} />}
                        onClick={getMedicalRecords}
                    >
                        Refresh
                    </Button> */}

                    </Box>
                }
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
                                        <Box bg={item.patient_leaving_date ? 'red.100' : 'green.100'} p={2}>
                                            <Text fontWeight='bold' fontSize='md' textAlign='center' color='gray.500'>
                                                {t('medicalRecord.medicalRecord')} #{item.id}
                                            </Text>
                                        </Box>

                                        <Box p={3}>
                                            <Text fontSize='sm' color='gray.500'>{t('medicalRecord.patient')}: {item.patient.first_name} {item.patient.last_name}</Text>
                                            <Text fontSize='sm' color='gray.500'>{t('medicalRecord.entry_Day')}: {item.patient_entry_date}</Text>
                                            <Text fontSize='sm' color='gray.500'>{t('medicalRecord.discharge_Day')}: {item.patient_leaving_date || 'still in hospital'}</Text>
                                            <Text fontSize='sm' color='gray.500'>{t('medicalRecord.state')}: {item.state_upon_enter}</Text>
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
                                                <Text mr='5px' fontSize={15} fontWeight='normal'>
                                                    {t('medicalRecord.detail')}
                                                </Text>
                                            </Button>
                                        </Box>
                                    </Box>
                                </GridItem>
                            ))}
                        </Grid>
                        {data?.data?.length === 0 && <Text textAlign='center' fontWeight='bold' fontSize='xl'>No Data</Text>}
                        {/* {loading && <Center p='10px'>
                            <Spinner thickness='5px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='gray.500'
                                size='xl' />
                        </Center>} */}
                        {loading && (
                            <Box>
                                <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                                    {[1, 2, 3, 4].map((i) => (
                                        <Box display='flex' p='0px' key={i} borderRadius='md' boxShadow='md' overflow='hidden'>
                                            <Skeleton w='100%' h='200px'>
                                                <Text>Loading...</Text>
                                            </Skeleton>
                                        </Box>
                                    ))}
                                </Grid>
                                <Center p='10px' gap={2} mt={5}>
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i}>
                                            <Text p={2} ml='5'>1</Text>
                                        </Skeleton>
                                    ))}
                                </Center>
                            </Box>
                        )}
                        {
                            data && data.last_page > 1 &&
                            <Pagination pagination={data} action={handlePagination} />
                        }
                    </Box>
                </Box>
            </Box>
        </Box >
    );
}

export default MedicalRecords;