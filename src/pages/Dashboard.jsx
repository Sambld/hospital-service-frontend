import {
    Heading,
    Text,
    Box,
    Grid,
    GridItem,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Button,
    Textarea,
    Badge,
    Spinner,
    Center,
    IconButton,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    VStack,
    Input,
    FormControl,
    Flex,

} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillFolderOpen, AiOutlineSend } from "react-icons/ai";
import { MdOutlineMarkUnreadChatAlt } from 'react-icons/md'
import { BiRefresh } from 'react-icons/bi'
import { Form, NavLink, useOutletContext } from "react-router-dom";
import useLoader from "../hooks/useLoader";
import Calendar from '../components/Calendar';
import { BsFileEarmarkMedical } from "react-icons/bs";
import { HiOutlineDocumentText, HiOutlineEmojiSad } from "react-icons/hi";


const Dashboard = () => {
    const user = useOutletContext()
    const [data, setData] = useState({
        headerTitle: '',
        column: [],
        data: [],
        count: 0
    })
    const [patientCount, setPatientCount] = useState(0)
    const [userCount, setUserCount] = useState(0)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [tabIndex, setTabIndex] = useState(0)

    const [StaffInfo, setStaffInfo] = useState([])


    const [infoLoading, setInfoLoading] = useState(true)
    useEffect(() => {
        getDashboardData()
    }, [])

    const handleTabsChange = (index) => {
        if (infoLoading) return
        setTabIndex(index)
        if (index === 1) {
            setData((prev) => ({
                ...prev,
                column: ['Medicine', 'Quantity'],
                data: []
            }))
            getPendingMedicalRequests(selectedDate, true)
        } else {
            setData((prev) => ({
                ...prev,
                column: ['Medicine', 'Quantity', 'status'],
                data: []
            }))
            getPendingMedicalRequests(selectedDate)
        }
    }

    const getDashboardData = () => {
        setData({
            headerTitle: '',
            column: [],
            data: [],
            count: 0
        })

        if (user.role === 'administrator') {
            getUserCount()
        } else if (user.role === 'doctor') {
            getPatientCount()
            getActiveMedicalRecords()
        } else if (user.role === 'nurse') {
            getPatientCount()
            getTodayFillingMonitoringSheet()
        } else if (user.role === 'pharmacist') {
            if (tabIndex === 1) {
                getPendingMedicalRequests(selectedDate, true)
            }
            else {
                getPendingMedicalRequests(selectedDate)
            }

        }
    }

    const getPatientCount = () => {
        useLoader('/patients?count=true')
            .then(res => {
                setPatientCount(res.count)
            })
            .catch(err => {
                setPatientCount(0)
            })
    }

    const getUserCount = () => {
        setInfoLoading(true)
        useLoader('/users?count=true')
            .then(res => {
                setInfoLoading(false)
                let count = []
                res.forEach((item) => {
                    count.push(item.count)
                })
                setStaffInfo(count)
            })
            .catch(err => {
                console.log('error')
                setInfoLoading(false)
                setUserCount(0)
            })
    }
    const getTodayFillingMonitoringSheet = () => {

        setInfoLoading(true)
        useLoader('/monitoring-sheets/today-available')
            .then(res => {
                console.log(res)
                setInfoLoading(false)
                setData({
                    headerTitle: 'Today Filling Monitoring Sheet',
                    column: ['First Name', 'Last Name', 'Bed Number', 'Action'],
                    data: res,
                    count: res.length
                })
            })
            .catch(err => {
                setInfoLoading(false)
                setData({
                    headerTitle: '',
                    column: [],
                    data: [],
                    count: 0
                })
            })

    }
    const getActiveMedicalRecords = () => {
        setInfoLoading(true)
        useLoader('/medical-records?doctorId=' + user.id + '&isActive=true')
            .then(res => {
                setInfoLoading(false)
                setData({
                    headerTitle: 'Active Medical Records',
                    column: ['First Name', 'Last Name', 'Bed Number', 'Action'],
                    data: res,
                    count: res.length
                })
            })
            .catch(err => {
                setInfoLoading(false)
                setData({
                    headerTitle: '',
                    column: [],
                    data: [],
                    count: 0
                })
            })

    }

    const getPendingMedicalRequests = (date, count = false) => {
        let SearchDate = date.toISOString().split('T')[0]
        setInfoLoading(true)
        useLoader('/medicine-requests?status=open&count=true')
            .then(res => {
                setData((prev) => ({
                    ...prev,
                    headerTitle: 'Pending Medical Requests',
                    count: res.count
                }))
            })
            .catch(err => {
                setInfoLoading(false)
                setData({
                    headerTitle: '',
                    column: [],
                    data: [],
                    count: 0
                })
            }
            )
        let query = count ? '&count=true' : ''
        useLoader('/medicine-requests/query?startDate=' + SearchDate + '&endDate=' + SearchDate + query)
            .then(res => {
                setInfoLoading(false)

                if (!count) {
                    res = res.map((item) => {
                        let status = null;
                        switch (item.status.toLowerCase()) {
                            case 'pending':
                                status = <Badge colorScheme='yellow'>Pending</Badge>;
                                break;
                            case 'approved':
                                status = <Badge colorScheme='green'>Approved</Badge>;
                                break;
                            case 'rejected':
                                status = <Badge colorScheme='red'>Rejected</Badge>;
                                break;
                            default:
                                status = <Badge>{item.status}</Badge>;
                                break;
                        }


                        return {
                            ...item,
                            status: status
                        }
                    })
                }
                setData((prev) => ({
                    ...prev,
                    column: count ? ['Medicine', 'Quantity'] : ['Medicine', 'Quantity', 'status'],
                    data: res
                }))
            })
            .catch(err => {
                setInfoLoading(false)
                setData({
                    headerTitle: '',
                    column: [],
                    data: [],
                    count: 0
                })
            }
            )
    }

    const setDashboardDefaultDate = (date) => {
        setSelectedDate(date)
        if (tabIndex === 1) {
            getPendingMedicalRequests(date, true)
        }
        else {
            getPendingMedicalRequests(date)
        }

    }

    return (
        <Box>
            {user && user.role === 'administrator' ? (

                <Box display='flex' alignItems='center' flexDirection='column'>
                    {/* <Box mb={5}>
                        <Heading size="lg">Dashboard</Heading>
                        <Text fontSize="sm">Welcome to the dashboard</Text>
                    </Box> */}
                    <Grid w='100%' templateColumns="repeat(4, 1fr)" gap={6}>
                        <GridItem>
                            <Box
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                                bg='black'
                                color='white'
                                borderRadius='xl'
                                mt={5}
                            >
                                <Heading size="md" mb={3} textAlign='center'>administrator Number</Heading>
                                <Flex justifyContent='center'>
                                    {infoLoading ? <Spinner size='xl' thickness="8px" mt={7} mb={7} /> : <Text textAlign='center' fontSize={69}>{StaffInfo[0]}</Text>}
                                </Flex>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                                bg='red.500'
                                color='white'
                                borderRadius='xl'
                                mt={5}
                            >
                                <Heading size="md" mb={3} textAlign='center'>Doctor Number</Heading>
                                <Flex justifyContent='center'>
                                    {infoLoading ? <Spinner size='xl' thickness="8px" mt={7} mb={7} /> : <Text textAlign='center' fontSize={69}>{StaffInfo[1]}</Text>}
                                </Flex>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                                bg='blue.500'
                                color='white'
                                borderRadius='xl'
                                mt={5}
                            >
                                <Heading size="md" mb={3} textAlign='center'>Nurse Number</Heading>
                                <Flex justifyContent='center'>
                                    {infoLoading ? <Spinner size='xl' thickness="8px" mt={7} mb={7} /> : <Text textAlign='center' fontSize={69}>{StaffInfo[2]}</Text>}
                                </Flex>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                                bg='green.500'
                                color='white'
                                borderRadius='xl'
                                mt={5}
                            >
                                <Heading size="md" mb={3} textAlign='center'>Pharmacist Number</Heading>
                                <Flex justifyContent='center'>
                                    {infoLoading ? <Spinner size='xl' thickness="8px" mt={7} mb={7} /> : <Text textAlign='center' fontSize={69}>{StaffInfo[3]}</Text>}
                                </Flex>
                            </Box>
                        </GridItem>
                    </Grid>

                </Box>
            ) : (
                <Grid
                    templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
                    templateAreas={{ base: ` "content" "state" `, md: `"content content state"` }}
                    gap={6}>
                    <GridItem area={'state'}>
                        {/* Calendar */}
                        {user?.role === 'pharmacist' && (
                            <Box mb={3}>
                                <Calendar setSelectedDate={setDashboardDefaultDate} />
                            </Box>
                        )}
                        {/* Data info */}
                        <Box
                            p={5}
                            boxShadow='md'
                            borderWidth="1px"
                            bgGradient='linear(to-l, #d01414, #803535)'
                            color='white'
                            borderRadius='xl'
                        >
                            <Heading size="md">
                                {data?.headerTitle ? data.headerTitle : '...'}
                            </Heading>
                            <Box p={5} display='flex' alignItems='center' justifyContent='flex-end'>
                                {infoLoading ? <Spinner /> : <Text textAlign='right' fontSize={40}>{data.count}</Text>}
                            </Box>


                        </Box>
                        {/* Patient info */}
                        {user?.role != 'pharmacist' &&
                            (
                                <Box
                                    p={5}
                                    shadow="md"
                                    borderWidth="1px"
                                    bgGradient='linear(to-l, #1775d2, #374083)'
                                    color='white'
                                    borderRadius='xl'
                                    mt={5}
                                >
                                    <Heading size="md">Patient Number</Heading>
                                    <Box p={5} display='flex' alignItems='center' justifyContent='flex-end'>
                                        {infoLoading ? <Spinner /> : <Text textAlign='right' fontSize={40}>{patientCount}</Text>}
                                    </Box>
                                </Box>
                            )}
                        {/* Chat */}
                        {/* <Box
                            mt={5}
                            position='relative'
                        >
                            <Box
                                position='absolute'
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                flexDirection='column'
                                w='100%'
                                h='100%'
                                bg='gray.100'
                                borderRadius='xl'
                                gap={3}
                                opacity={0.5}
                                zIndex={3}
                            >
                                <Badge variant='subtle' fontSize='1.5em' >COMING</Badge>
                                <Badge variant='subtle' fontSize='1.5em' >SOON</Badge>
                            </Box>
                            <Box
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                                bg='gray.100'
                                borderRadius='xl'
                                position='relative'
                            >

                                <Box
                                    display='flex'
                                    alignItems='center'
                                    gap={3}
                                    zIndex={1}
                                >
                                    <MdOutlineMarkUnreadChatAlt size={30} color="#374083" />
                                    <Text fontSize={25} size="md">Chat</Text>
                                </Box>
                                <Box
                                    zIndex={1}
                                    borderRadius='md'
                                    display='flex'
                                    alignItems='center'
                                    gap={2}
                                    mt={5}
                                >
                                    <Textarea
                                        bg='white'
                                        h="auto"
                                        placeholder="Type your message"
                                    />
                                    <AiOutlineSend size={40} color="#374083" />
                                </Box>
                            </Box>
                        </Box> */}

                    </GridItem>
                    <GridItem area={'content'}>
                        {user && (user.role === 'doctor' || user?.role === 'nurse') && (
                            <Box boxShadow='md'>
                                <Box
                                    shadow="md"
                                    textAlign='center'
                                    color='white'
                                    bg='blue.700'
                                    borderTopRadius='md'
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                    p={3}
                                >
                                    <Box w='80px'></Box>
                                    <Text>
                                        Today Medical Records
                                    </Text>
                                    <IconButton
                                        colorScheme='blackAlpha'
                                        bg='gray.600'
                                        borderRadius='full'
                                        aria-label='Refresh'
                                        isLoading={infoLoading}
                                        onClick={getDashboardData}
                                        icon={<BiRefresh size={25} />}
                                    />
                                </Box>
                                <Box
                                    shadow="md"
                                    bg='white'
                                    borderRadius='md'
                                    maxH='500px'
                                    overflowY='auto'
                                >
                                    <Table  variant='simple'  colorScheme='blackAlpha'>
                                        <Thead
                                            bg='#fafafa'
                                            color='white'
                                            position="sticky"
                                            top={0}
                                            zIndex={1}
                                            boxShadow='md'
                                        >
                                            <Tr>
                                                {data && data?.column.map((item, index) =>
                                                (
                                                    <Th key={index}>{item}</Th>
                                                )
                                                )}
                                            </Tr>
                                        </Thead>
                                        <Tbody>

                                            {data && data?.data.map((item, index) => (
                                                <Tr key={index} bg={(item?.patient?.gender == 'Male') ? 'blue.50' : 'pink.50'}>
                                                    <Td>{item?.patient?.first_name}</Td>
                                                    <Td>{item?.patient?.last_name}</Td>
                                                    <Td>{item?.bed_number}</Td>
                                                    <Td>
                                                        <NavLink w='100%' to={'/patients/' + item?.patient?.id + "?med=" + item?.id + (user?.role === 'nurse' ? "#monitoring" : '')}style={{'display':'block','borderRadius':'5px'}}>
                                                            <Button
                                                                leftIcon={<AiFillFolderOpen />}
                                                                variant='outline'
                                                                w='100%'
                                                                colorScheme={(item?.patient?.gender == 'Male') ? 'blue' : 'pink'}
                                                            >
                                                                Open
                                                            </Button>
                                                        </NavLink>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            </Box>
                        )}

                        {user?.role === 'pharmacist' && (
                            <Box boxShadow='md'>
                                <Box>
                                    <Box
                                        shadow="md"
                                        textAlign='center'
                                        color='white'
                                        bg='blue.700'
                                        borderTopRadius='md'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='space-between'
                                        p={3}
                                    >
                                        <Box w='80px'></Box>
                                        <Text>
                                            Medicine Requests
                                        </Text>
                                        <IconButton
                                            colorScheme='blackAlpha'
                                            bg='gray.600'
                                            borderRadius='full'
                                            aria-label='Refresh'
                                            isLoading={infoLoading}
                                            onClick={getDashboardData}
                                            icon={<BiRefresh size={25} />}
                                        />
                                    </Box>
                                    <Tabs isFitted variant='unstyled' bg='blue.800' color="gray.400" index={tabIndex} onChange={handleTabsChange}>
                                        <TabList>
                                            <Tab _selected={{ color: 'white' }}>
                                                <VStack spacing={0}>
                                                    <BsFileEarmarkMedical size={23} />
                                                    <Text fontSize={15}>Requests</Text>
                                                </VStack>
                                            </Tab>
                                            <Tab _selected={{ color: 'white' }}>
                                                <VStack spacing={0}>
                                                    <HiOutlineDocumentText size={23} />
                                                    <Text fontSize={15}>Medicine Count</Text>
                                                </VStack>
                                            </Tab>
                                        </TabList>
                                    </Tabs>
                                    <Box
                                        shadow="md"
                                        bg='white'
                                        borderRadius='md'
                                        maxH='500px'
                                        overflowY='auto'
                                    >
                                        <Table>
                                            <Thead
                                                bg='gray.100'
                                                color='white'
                                                position="sticky"
                                                top={0}
                                                zIndex={1}
                                            >
                                                <Tr>
                                                    {data && data?.column.map((item, index) =>
                                                    (
                                                        <Th key={index}>{item}</Th>
                                                    )
                                                    )}
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {!infoLoading && data && data?.data.map((item, index) =>
                                                (
                                                    <Tr key={index}>
                                                        <Td>{item.medicine.name}</Td>
                                                        <Td>{item.quantity}</Td>
                                                        {
                                                            item.status && (
                                                                <Td>
                                                                    {item.status}
                                                                </Td>
                                                            )
                                                        }

                                                    </Tr>
                                                )
                                                )}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </Box>
                            </Box>

                        )}
                        {
                            !infoLoading && data && data?.data.length === 0 && (
                                <Center p='10px' bg='white' borderBottomRadius='md' boxShadow='md'>
                                    <Text fontSize={20} color='gray.500'>No Data</Text>
                                </Center>
                            )
                        }
                        {
                            infoLoading && (
                                <Center p='10px' bg='white' borderBottomRadius='md' boxShadow='md'>
                                    <Spinner thickness='4px'
                                        speed='0.65s'
                                        emptyColor='gray.200'
                                        color='gray.500'
                                        size='lg' />
                                </Center>
                            )
                        }
                    </GridItem>
                </Grid>
            )}
        </Box>
    );
}

export default Dashboard;