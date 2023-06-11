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
    Skeleton,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    useDisclosure,
    Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Form, NavLink, useOutletContext } from "react-router-dom";
import useLoader from "../hooks/useLoader";
import Calendar from '../components/Calendar';



// Icons
import { HiOutlineDocumentText, HiOutlineEmojiSad } from "react-icons/hi";
import { BsFileEarmarkMedical } from "react-icons/bs";
import { AiFillFolderOpen, AiOutlineMedicineBox } from "react-icons/ai";
import { BiCalendar, BiRefresh } from 'react-icons/bi';
import { FaNotesMedical, FaClock } from 'react-icons/fa';
import { RiCalendarCheckLine, RiFileList2Line, RiChatCheckLine } from 'react-icons/ri';

// Translation
import { useTranslation } from "react-i18next";


const Dashboard = () => {
    const user = useOutletContext()
    const { t, i18n } = useTranslation()
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

    const { isOpen, onOpen, onClose } = useDisclosure()

    const tableHeaderBgColor = useColorModeValue('#fafafa', 'gray.800');
    const tableHeaderTextColor = 'white';
    const tableRowBgColor = useColorModeValue('gray.50', 'gray.900');
    const tableCellTextColor = useColorModeValue('gray.600', 'gray.50');
    const tableHeaderBgColorTwo = useColorModeValue('#fafafa', 'gray.800');
    const tableRowBgColorTwo = useColorModeValue('gray.50', 'gray.900');
    const tableCellTextColorTwo = useColorModeValue('gray.600', 'gray.50');




    useEffect(() => {
        getDashboardData()
    }, [])

    const handleTabsChange = (index) => {
        if (infoLoading) return
        setTabIndex(index)
        if (index === 1) {
            if (user.role === 'doctor') {
                setData((prev) => ({
                    ...prev,
                    column: [t('dashboard.medicalRecord'), t('dashboard.filledBy'), t('dashboard.updatedAt'), t('dashboard.action')],
                    data: []
                }))
                getLatestUpdate()
            } else if (user.role === 'nurse') {
                setData((prev) => ({
                    ...prev,
                    column: [t('dashboard.firstName'), t('dashboard.lastName'), t('dashboard.bedNumber'), t('dashboard.action')],
                    data: []
                }))
                getLastestFillingMonitoringSheet()
            } else if (user.role === 'pharmacist') {
                setData((prev) => ({
                    ...prev,
                    column: [t('dashboard.medicine'), t('dashboard.quantity')],
                    data: []
                }))
                getPendingMedicalRequests(selectedDate, true)
            }

        } else {
            if (user.role === 'doctor') {
                setData((prev) => ({
                    ...prev,
                    column: [t('dashboard.firstName'), t('dashboard.lastName'), t('dashboard.bedNumber'), t('dashboard.action')],
                    data: []
                }))
                getActiveMedicalRecords()
            } else if (user.role === 'nurse') {
                setData((prev) => ({
                    ...prev,
                    column: [t('dashboard.firstName'), t('dashboard.lastName'), t('dashboard.bedNumber'), t('dashboard.action')],
                    data: []
                }))
                getTodayAvailableMonitoringSheet()
            } else if (user.role === 'pharmacist') {
                setData((prev) => ({
                    ...prev,
                    column: [t('dashboard.medicine'), t('dashboard.quantity'), t('dashboard.status')],
                    data: []
                }))
                getPendingMedicalRequests(selectedDate)
            }
        }
    }

    const changeFormat = (date) => {
        let date_ = new Date(date)
        return date_.getDate() + '-' + (date_.getUTCMonth() + 1) + '-' + date_.getUTCFullYear() + '/' + date_.getUTCHours() + ':' + date_.getUTCMinutes()
    }
    const formatDate = (date) => {
        let date_ = new Date(date)
        return date_.getDate() + '-' + (date_.getUTCMonth() + 1) + '-' + date_.getUTCFullYear()
    }

    const getDashboardData = () => {
        setData((prev) => ({
            ...prev,
            headerTitle: '',
            column: [],
            data: [],
        }))

        if (user.role === 'administrator') {
            getUserCount()
        } else if (user.role === 'doctor') {
            getPatientCount()
            if (tabIndex === 0) {
                getActiveMedicalRecords()
            }
            else {
                getLatestUpdate()
            }
        } else if (user.role === 'nurse') {
            getPatientCount()
            if (tabIndex === 0) {
                getTodayAvailableMonitoringSheet()
            }
            else {
                getLastestFillingMonitoringSheet()
            }
        } else if (user.role === 'pharmacist') {
            if (tabIndex === 0) {
                getPendingMedicalRequests(selectedDate)
            }
            else {
                getPendingMedicalRequests(selectedDate, true)
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


    // Administator Functions
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

    // Doctor Functions
    const getLatestUpdate = () => {
        setInfoLoading(true)
        useLoader('/monitoring-sheets/latest-updates')
            .then(res => {
                setInfoLoading(false)
                const data = res.map((item) => {
                    const link = `/patients/${item.medical_record.patient_id}?med=${item.record_id}#monitoring`;
                    const text = t('global.open');
                    const ColorScheme = 'blue';
                    const Icon = <AiFillFolderOpen />;
                    return [
                        `${t('medicalRecord.monitoringSheet')} #${item.id}`,
                        `${item.filled_by.first_name} ${item.filled_by.last_name}`,
                        `${changeFormat(item.updated_at)}`,
                        [
                            link,
                            text,
                            ColorScheme,
                            Icon
                        ]
                    ]
                })
                setData((prevFormData) => ({
                    ...prevFormData,
                    headerTitle: t('dashboard.activeMedicalRecords'),
                    column: [t('medicalRecord.monitoringSheet'), t('dashboard.filledBy'), t('dashboard.updatedAt'), t('dashboard.action')],
                    data: data,
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
            })
    }
    const getActiveMedicalRecords = () => {
        setInfoLoading(true)
        useLoader('/medical-records?isActive=true')
            .then(res => {
                setInfoLoading(false)
                const data = res.map((item) => {
                    const link = `/patients/${item.patient.id}?med=${item.id}`;
                    const text = t('global.open');
                    const ColorScheme = (item.patient.gender == 'Male') ? 'blue' : 'pink';
                    const Icon = <AiFillFolderOpen />;
                    return [
                        item.patient.first_name,
                        item.patient.last_name,
                        item.bed_number,
                        [
                            link,
                            text,
                            ColorScheme,
                            Icon
                        ]
                    ]
                })
                setData({
                    headerTitle: t('dashboard.activeMedicalRecords'),
                    column: [t('dashboard.firstName'), t('dashboard.lastName'), t('dashboard.bedNumber'), t('dashboard.action')],
                    data: data,
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

    // Nurse Functions
    const getTodayAvailableMonitoringSheet = () => {
        setInfoLoading(true)
        useLoader('/monitoring-sheets/today-available')
            .then(res => {
                setInfoLoading(false)
                const data = res.map((item) => {
                    const link = `/patients/${item.medical_record.patient.id}?med=${item.record_id}#monitoring`;
                    const text = t('global.open');
                    const ColorScheme = (item.medical_record.patient.gender == 'Male') ? 'blue' : 'pink';
                    const Icon = <AiFillFolderOpen />;
                    return [
                        item.medical_record.patient.first_name,
                        item.medical_record.patient.last_name,
                        item.medical_record.bed_number,
                        [
                            link,
                            text,
                            ColorScheme,
                            Icon
                        ]
                    ]
                })
                setData({
                    headerTitle: t('dashboard.todayAvailableMonitoringSheet'),
                    column: [t('dashboard.firstName'), t('dashboard.lastName'), t('dashboard.bedNumber'), t('dashboard.action')],
                    data: data,
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

    const getLastestFillingMonitoringSheet = () => {
        setInfoLoading(true)
        useLoader('/monitoring-sheets/my-latest-filled')
            .then(res => {

                setInfoLoading(false)
                const data = res.map((item) => {
                    const link = `/patients/${item.medical_record.patient.id}?med=${item.record_id}#monitoring`;
                    const text = t('global.open');
                    const ColorScheme = (item.medical_record.patient.gender == 'Male') ? 'blue' : 'pink';
                    const Icon = <AiFillFolderOpen />;
                    return [
                        item.medical_record.patient.first_name,
                        item.medical_record.patient.last_name,
                        item.medical_record.bed_number,
                        [
                            link,
                            text,
                            ColorScheme,
                            Icon
                        ]
                    ]
                })
                setData((pres) => ({
                    ...pres,
                    headerTitle: t('dashboard.latestFilledMonitoringSheet'),
                    column: [t('dashboard.firstName'), t('dashboard.lastName'), t('dashboard.bedNumber'), t('dashboard.action')],
                    data: data,
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
            })

    }

    // Pharmacist Functions
    const getPendingMedicalRequests = (date, count = false) => {
        let SearchDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        setInfoLoading(true)
        useLoader('/prescriptions?status=open&count=true')
            .then(res => {
                setData((prev) => ({
                    ...prev,
                    headerTitle: t('prescription.pendingPrescription'),
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
                    column: count ? [t('dashboard.medicine'), t('dashboard.quantity')] : [t('dashboard.medicine'), t('dashboard.quantity'), t('dashboard.status')],
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
                                borderWidth={useColorModeValue("1px", "0px")}
                                bg='black'
                                color='white'
                                borderRadius='xl'
                                mt={5}
                            >
                                <Heading size="md" mb={3} textAlign='center'>
                                    {t('dashboard.administratorNumber')}
                                </Heading>
                                <Flex justifyContent='center'>
                                    {infoLoading ? <Spinner size='xl' thickness="8px" mt={7} mb={7} /> : <Text textAlign='center' fontSize={69}>{StaffInfo[0] || '0'}</Text>}
                                </Flex>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box
                                p={5}
                                shadow="md"
                                borderWidth={useColorModeValue("1px", "0px")}
                                bg='red.500'
                                color='white'
                                borderRadius='xl'
                                mt={5}
                            >
                                <Heading size="md" mb={3} textAlign='center'>
                                    {t('dashboard.doctorNumber')}
                                </Heading>
                                <Flex justifyContent='center'>
                                    {infoLoading ? <Spinner size='xl' thickness="8px" mt={7} mb={7} /> : <Text textAlign='center' fontSize={69}>{StaffInfo[1] || '0'}</Text>}
                                </Flex>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box
                                p={5}
                                shadow="md"
                                borderWidth={useColorModeValue("1px", "0px")}
                                bg='blue.500'
                                color='white'
                                borderRadius='xl'
                                mt={5}
                            >
                                <Heading size="md" mb={3} textAlign='center'>
                                    {t('dashboard.nurseNumber')}
                                </Heading>
                                <Flex justifyContent='center'>
                                    {infoLoading ? <Spinner size='xl' thickness="8px" mt={7} mb={7} /> : <Text textAlign='center' fontSize={69}>{StaffInfo[2] || '0'}</Text>}
                                </Flex>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box
                                p={5}
                                shadow="md"
                                borderWidth={useColorModeValue("1px", "0px")}
                                bg='green.500'
                                color='white'
                                borderRadius='xl'
                                mt={5}
                            >
                                <Heading size="md" mb={3} textAlign='center'>
                                    {t('dashboard.pharmacistNumber')}
                                </Heading>
                                <Flex justifyContent='center'>
                                    {infoLoading ? <Spinner size='xl' thickness="8px" mt={7} mb={7} /> : <Text textAlign='center' fontSize={69}>{StaffInfo[3] || '0'}</Text>}
                                </Flex>
                            </Box>
                        </GridItem>
                    </Grid>

                </Box>
            ) : (
                <Grid
                    templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
                    templateAreas={{ base: `"state" "content"`, md: `"content content state"` }}
                    gap={6}>
                    <GridItem area={'state'}>
                        {/* Calendar */}
                        {user?.role === 'pharmacist' && (
                            <Box
                                p={2}
                                mb={3}
                                h='100px'
                                fontSize={25}
                                bg={useColorModeValue("gray.100", "gray.700")}
                                color={useColorModeValue("gray.700", "gray.100")}
                                borderRadius='xl'
                                border='2px solid'
                                borderColor={useColorModeValue("gray.300", "gray.300")}
                                cursor='pointer'
                                onClick={() => onOpen()}
                                readOnly
                                display='flex'
                                justifyContent='center'
                                alignItems='center'
                                gap={3}
                            >
                                {formatDate(selectedDate)}
                                <Icon as={BiCalendar} fontSize='35px' />
                            </Box>
                        )}



                        {/* Data info */}
                        <Box
                            p={5}
                            boxShadow='md'
                            borderWidth={useColorModeValue("1px", "0px")}
                            bgGradient={`linear(to-l, ${useColorModeValue("#56ff69", "#8c1010")}, ${useColorModeValue("#04951a", "#550707")})`}
                            color='white'
                            borderRadius='xl'
                        >
                            <Heading size="md">
                                {user?.role == "doctor" ? t('dashboard.activeMedicalRecords') : user?.role == 'nurse' ? t('dashboard.todayAvailableMonitoringSheet') : t('prescription.pendingPrescription')}
                            </Heading>
                            <Box p={5} display='flex' alignItems='center' justifyContent='flex-end'>
                                <Text textAlign='right' fontSize={40}>{data.count || 0}</Text>
                            </Box>


                        </Box>
                        {/* Patient info */}
                        {user?.role != 'pharmacist' &&
                            (
                                <Box
                                    p={5}
                                    boxShadow='md'
                                    borderWidth={useColorModeValue("1px", "0px")}
                                    bgGradient={`linear(to-l, ${useColorModeValue("#1775d2", "#0a3c6f")}, ${useColorModeValue("#374083", "#080d33")})`}
                                    color='white'
                                    borderRadius='xl'
                                    overflow='hidden'
                                    mt={5}
                                >
                                    <Heading size="md">
                                        {t('dashboard.patientNumber')}
                                    </Heading>
                                    <Box p={5} display='flex' alignItems='center' justifyContent='flex-end'>
                                        <Text textAlign='right' fontSize={40}>{patientCount || 0}</Text>
                                    </Box>
                                </Box>
                            )}

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
                                        {t('medicalRecord.title')}
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
                                                {user?.role === 'doctor' && (
                                                    <>
                                                        <FaNotesMedical size={23} />
                                                        <Text pt={1} fontSize={15}>
                                                            {t('dashboard.activeMedicalRecords')}
                                                        </Text>
                                                    </>
                                                )}
                                                {user?.role === 'nurse' && (
                                                    <>
                                                        <RiCalendarCheckLine size={23} />
                                                        <Text pt={1} fontSize={15}>
                                                            {t('dashboard.todayAvailable')}
                                                        </Text>
                                                    </>
                                                )}
                                            </VStack>
                                        </Tab>
                                        <Tab _selected={{ color: 'white' }}>
                                            <VStack spacing={0}>
                                                {user?.role === 'doctor' && (
                                                    <>
                                                        <FaClock size={23} />
                                                        <Text pt={1} fontSize={15}>
                                                            {t('dashboard.latestUpdate')}
                                                        </Text>
                                                    </>
                                                )}
                                                {user?.role === 'nurse' && (
                                                    <>
                                                        <RiFileList2Line size={23} />
                                                        <Text pt={1} fontSize={15}>
                                                            {t('dashboard.latestFilling')}
                                                        </Text>
                                                    </>
                                                )}
                                            </VStack>
                                        </Tab>
                                    </TabList>
                                </Tabs>
                                <Box
                                    shadow="md"
                                    bg='white'
                                    maxH='500px'
                                    overflowY='auto'
                                >
                                    <Table variant='simple' colorScheme='blackAlpha'>
                                        <Thead
                                            bg={tableHeaderBgColor}
                                            color={tableHeaderTextColor}
                                            position="sticky"
                                            top={0}
                                            zIndex={1}
                                            boxShadow='md'
                                        >
                                            <Tr>
                                                {data && data?.column.map((item, index) => (
                                                    <Th key={index}>{item}</Th>
                                                ))}
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {data && data?.data.map((item, index) => (
                                                <Tr key={index} bg={tableRowBgColor}>
                                                    {item.slice(0, -1).map((item2, index2) => (
                                                        <Td color={tableCellTextColor} key={index2}>{item2}</Td>
                                                    ))}
                                                    <Td>
                                                        <NavLink w='100%' to={item.at(-1)[0]} style={{ display: 'block', borderRadius: '5px' }}>
                                                            <Button leftIcon={item.at(-1)[3] || null} variant='outline' w='100%' colorScheme={item.at(-1)[2]}>
                                                                {item.at(-1)[1]}
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
                                            {t('dashboard.medicineRequests')}
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
                                                    <RiChatCheckLine size={23} />
                                                    <Text pt={1} fontSize={15}>
                                                        {t('dashboard.requests')}
                                                    </Text>
                                                </VStack>
                                            </Tab>
                                            <Tab _selected={{ color: 'white' }}>
                                                <VStack spacing={0}>
                                                    <AiOutlineMedicineBox size={23} />
                                                    <Text pt={1} fontSize={15}>
                                                        {t('dashboard.medicineCount')}
                                                    </Text>
                                                </VStack>
                                            </Tab>
                                        </TabList>
                                    </Tabs>
                                    <Box
                                        shadow="md"
                                        bg='white'
                                        maxH='500px'
                                        overflowY='auto'
                                    >
                                        <Table>
                                            <Thead
                                                bg={tableHeaderBgColorTwo}
                                                color='white'
                                                position="sticky"
                                                top={0}
                                                zIndex={1}
                                            >
                                                <Tr>
                                                    {data && data?.column.map((item, index) => (
                                                        <Th key={index} w='70%'>{item}</Th>
                                                    ))}
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {!infoLoading && data && data?.data.map((item, index) => (
                                                    <Tr key={index} color={tableCellTextColorTwo} bg={tableRowBgColorTwo}>
                                                        <Td>{item.medicine.name}</Td>
                                                        <Td>{item.quantity}</Td>
                                                        {item.status && (
                                                            <Td>{item.status}</Td>
                                                        )}
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </Box>
                            </Box>

                        )}
                        {
                            !infoLoading && data && data?.data.length === 0 && (
                                <Center p='10px' bg={useColorModeValue('white', 'gray.900')} borderBottomRadius='md' boxShadow='md'>
                                    <Text fontSize={20} color='gray.500'>
                                        {t('global.noData')}
                                    </Text>
                                </Center>
                            )
                        }
                        {
                            infoLoading && (
                                <Box bg={useColorModeValue('white', 'gray.900')} borderBottomRadius='md' boxShadow='md'>
                                    {[1, 2].map((i) => (
                                        <Box display='flex' p='10px' key={i}>
                                            <Skeleton w='100%' h='50px'>
                                                <Text ml='5'>Loading...</Text>
                                            </Skeleton>
                                            <Skeleton w='30%' ml={2} h='50px'>
                                                <Text ml='5'>Loading...</Text>
                                            </Skeleton>
                                        </Box>
                                    ))}

                                </Box>
                            )
                        }
                    </GridItem>
                </Grid>
            )}

            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <Calendar
                        startDate={
                            () => {
                                let date = new Date(selectedDate);
                                return date
                            }}
                        setSelectedDate={
                            (date) => {
                                let choosenDate = new Date(date);
                                setDashboardDefaultDate(choosenDate);
                                onClose()
                            }
                        } />
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Dashboard;