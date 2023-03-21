import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Grid,
    GridItem,
    Spacer,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Tag,
    useToast,
    Center,
    Spinner,
} from "@chakra-ui/react";
import { FaUserMd } from "react-icons/fa";
import { AiFillFile, AiOutlineClockCircle } from "react-icons/ai";
import { IoClose, IoCheckmarkSharp } from "react-icons/io5";
import { MdSick } from "react-icons/md";
import axios from "../components/axios";
import { useEffect, useState } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import Pagination from "../components/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import useLoader from "../hooks/useLoader";


const Prescriptions = () => {
    const [PendingPrescriptions, setPrescriptions] = useState([])
    const [PastPrescriptions, setPastPrescriptions] = useState([])

    const [PrescriptionDetail, setPrescriptionDetail] = useState(null)

    const [PendingPagination, setPendingPagination] = useState(null)
    const [PastPagination, setPastPagination] = useState(null)

    const [PendingLoading, setPendingLoading] = useState(false)
    const [PastLoading, setPastLoading] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [tabIndex, setTabIndex] = useState(0)


    const toast = useToast()

    useEffect(() => {
        if (searchParams.get('status')) {
            if (searchParams.get('status').toLowerCase() === 'pending') {
                setTabIndex(0)
                getPendingPrescriptions()
            } else if (searchParams.get('status').toLowerCase() === 'past') {
                setTabIndex(1)
                getPastPrescriptions()
            }
        } else {
            getPendingPrescriptions()
        }
    }, [searchParams])

    const getPendingPrescriptions = () => {
        // abortCont = new AbortController();
        setPrescriptions([])
        setPendingPagination(null)
        setPendingLoading(true)
        useLoader(`/medicine-requests?status=open&page=${searchParams.get('page') || 1}`)
            .then(res => {
                setPendingLoading(false)
                const { data, ...pagination } = res;
                setPrescriptions(data)
                setPendingPagination(pagination)
            })
        // .catch(err => () => abortCont.abort())

    }
    const getPastPrescriptions = () => {
        // abortCont = new AbortController();
        setPastPrescriptions([])
        setPastPagination(null)
        setPastLoading(true)
        useLoader(`/medicine-requests?status=closed&page=${searchParams.get('page') || 1}`)
            .then(res => {
                setPastLoading(false)
                const { data, ...pagination } = res;
                setPastPrescriptions(data)
                setPastPagination(pagination)
            })
        // .catch(err => () => abortCont.abort())
    }

    const changeMedicineRequestStatus = async (MainInfo, MedInfo, message) => {
        await axios.put(`/patients/${MainInfo.patient_id}/medical-records/${MainInfo.medical_record_id}/medicine-requests/${MedInfo.id}`, {
            status: message,
            review: ''
        }).then(res => {
            if (res.data.message) {
                toast({
                    title: "Medicine " + message,
                    description: "The medicine has been " + message.toLowerCase(),
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
                setPrescriptionDetail((prevState) => {
                    return {
                        ...prevState,
                        medicine_requests:
                            prevState.medicine_requests.map((item) => {
                                if (item.id === MedInfo.id) {
                                    return {
                                        ...item,
                                        status: message
                                    }
                                }
                                return item
                            })

                    }
                })
                if (PrescriptionDetail.medicine_requests.filter(item => item.status.toLowerCase() === 'pending').length == 1) {
                    setPrescriptions(null)
                    getPendingPrescriptions()
                    toast({
                        title: "Prescription Completed",
                        description: "The prescription has been completed",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    })
                    onClose()
                }
            }
        }).catch(err => {
            const response = JSON.parse(err.request.response)
            console.log(response)
            if (response.message) {
                toast({
                    title: response.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }

        })

    }
    const handlePrescriptionDetail = (info) => {
        setPrescriptionDetail(info)
        onOpen();
    }

    const handleTabsChange = (index) => {
        if (index === 0) {
            setPrescriptions([])
            setTabIndex(index)
            navigate('/prescriptions?status=pending')
        } else if (index === 1) {
            setPastPrescriptions([])
            setTabIndex(index)
            navigate('/prescriptions?status=past')
        }
    }
    const handleTabChange = (e) => {
        if (e === 0) {
            setPrescriptions([])
            navigate('/prescriptions?status=pending')
        } else if (e === 1) {
            setPastPrescriptions([])
            navigate('/prescriptions?status=past')
        }
    }
    const handlePagination = (e) => {
        if (searchParams.get('status')) {
            navigate('/prescriptions?status=' + searchParams.get('status') + '&page=' + e)
        } else {
            navigate('/prescriptions?page=' + e)
        }
    }

    return (
        <Box bg='white' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
            <Tabs index={tabIndex} variant='unstyled' colorScheme='green' onChange={handleTabsChange} isFitted>
                <TabList bg='gray.300' p='3px' borderRadius='3xl'>
                    <Tab
                        borderRadius='3xl'
                        _selected={{ color: 'white', bg: 'blue.500' }}
                    >
                        Pending Requests
                    </Tab>
                    <Tab
                        borderRadius='3xl'
                        _selected={{ color: 'white', bg: 'green.500' }}
                    >
                        Past Requests
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Grid templateColumns={{ base: '1f', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={6}>
                            {PendingPrescriptions && PendingPrescriptions
                                .map((item, index) => (
                                    <GridItem key={index}>
                                        <Box borderRadius='md' boxShadow='md' overflow='hidden'>
                                            <Flex alignItems='center' bg='blue.500' p={3} color='white' borderTopRadius='md' gap={1}>
                                                <Icon as={MdSick} fontSize='20px' mr='5px' />
                                                <Text>{item.patient}</Text>
                                            </Flex>
                                            <Flex justifyContent='flex-start' alignItems='center' gap={3} p={3}>
                                                <Avatar
                                                    bg='red'
                                                    size={'md'}
                                                    icon={<FaUserMd fontSize='20px' />}
                                                />
                                                <Text>{item.doctor}</Text>
                                            </Flex>
                                            <Flex justifyContent='space-between' bg='gray.100' borderBottomRadius='md' pt='1px' gap='1px'>
                                                <Button
                                                    bg='white'
                                                    leftIcon={<IoClose color="red.700" />}
                                                    colorScheme='red'
                                                    borderRadius={0}
                                                    border={0}
                                                    variant='outline'
                                                    p='10px'
                                                    px={5}
                                                    w='50%'>
                                                    <Text mr='5px' fontSize={15} fontWeight='normal'>Reject</Text>
                                                </Button>

                                                <Button
                                                    bg='white'
                                                    leftIcon={<AiFillFile color='blue.700' />}
                                                    colorScheme='blue'
                                                    borderRadius={0}
                                                    border={0}
                                                    variant='outline'
                                                    p='10px'
                                                    px={5}
                                                    w='50%'
                                                    onClick={() => handlePrescriptionDetail(item)}
                                                >
                                                    <Text mr='5px' fontSize={15} fontWeight='normal'>Detail</Text>
                                                </Button>
                                            </Flex>
                                        </Box>
                                    </GridItem>
                                ))}
                        </Grid>
                        {PendingLoading && <Center p='10px'>
                            <Spinner thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl' />
                        </Center>}

                        {PendingPrescriptions && PendingPrescriptions.length === 0 && !PendingLoading &&
                            <Flex justifyContent='center' alignItems='center' h='100px'>
                                <Text fontSize='20px' fontWeight='bold'>No Pending Prescriptions</Text>
                            </Flex>
                        }
                        {PendingPagination && PendingPagination.last_page > 1 &&
                            <Flex justifyContent='center' alignItems='center' h='100px'>
                                <Pagination pagination={PendingPagination} action={handlePagination} />
                            </Flex>
                        }
                    </TabPanel>
                    <TabPanel>
                        <Grid templateColumns={{ base: '1f', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={6}>
                            {PastPrescriptions && PastPrescriptions
                                .map((item, index) => (
                                    <GridItem key={index}>
                                        <Box borderRadius='md' boxShadow='md' overflow='hidden'>
                                            <Flex alignItems='center' bg='blue.500' p={3} color='white' borderTopRadius='md' gap={1}>
                                                <Icon as={MdSick} fontSize='20px' mr='5px' />
                                                <Text>{item.patient}</Text>
                                            </Flex>
                                            <Flex justifyContent='flex-start' alignItems='center' gap={3} p={3}>
                                                <Avatar
                                                    bg='red'
                                                    size={'md'}
                                                    icon={<FaUserMd fontSize='20px' />}
                                                />
                                                <Text>{item.doctor}</Text>
                                            </Flex>
                                            <Flex justifyContent='space-between' bg='gray.100' borderBottomRadius='md' pt='1px' gap='1px'>
                                                <Button
                                                    bg='white'
                                                    leftIcon={<IoClose color="red.700" />}
                                                    colorScheme='red'
                                                    borderRadius={0}
                                                    border={0}
                                                    variant='outline'
                                                    p='10px'
                                                    px={5}
                                                    w='50%'>
                                                    <Text mr='5px' fontSize={15} fontWeight='normal'>Reject</Text>
                                                </Button>

                                                <Button
                                                    bg='white'
                                                    leftIcon={<AiFillFile color='blue.700' />}
                                                    colorScheme='blue'
                                                    borderRadius={0}
                                                    border={0}
                                                    variant='outline'
                                                    p='10px'
                                                    px={5}
                                                    w='50%'
                                                    onClick={() => handlePrescriptionDetail(item)}
                                                >
                                                    <Text mr='5px' fontSize={15} fontWeight='normal'>Detail</Text>
                                                </Button>
                                            </Flex>
                                        </Box>

                                    </GridItem>
                                ))}
                        </Grid>
                        {PastLoading && <Center p='10px'>
                            <Spinner thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl' />
                        </Center>}

                        {PastPrescriptions && PastPrescriptions.length === 0 && !PastLoading &&
                            <Flex justifyContent='center' alignItems='center' h='100px'>
                                <Text fontSize='20px' fontWeight='bold'>No Pending Prescriptions</Text>
                            </Flex>
                        }
                        {PastPagination && PastPagination.last_page > 1 &&
                            <Flex justifyContent='center' alignItems='center' h='100px'>
                                <Pagination pagination={PastPagination} action={handlePagination} />
                            </Flex>
                        }
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                {PrescriptionDetail && (
                    <ModalContent maxW='800px'>
                        <ModalHeader>Medical Record #{PrescriptionDetail.medical_record_id} Prescription </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {/* doctor name */}
                            <Flex justifyContent='flex-start' alignItems='center' gap={3} mb={2}>
                                <FaUserMd fontSize='20px' />
                                <Text>{PrescriptionDetail.doctor}</Text>
                            </Flex>
                            {/* time */}
                            <Flex justifyContent='flex-start' alignItems='center' gap={3}>
                                <MdSick fontSize='20px' />
                                <Text>{PrescriptionDetail.patient} #{PrescriptionDetail.patient_id}</Text>
                            </Flex>
                            <Divider mt={3} mb={3} />
                            <Box maxH='50vh' overflow='auto'>
                                <Table variant='simple' colorScheme='blackAlpha'>
                                    <Thead>
                                        <Tr>
                                            <Th>Medicine</Th>
                                            <Th>Quantity</Th>
                                            <Th>Remains</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    {PrescriptionDetail.medicine_requests && PrescriptionDetail.medicine_requests
                                        .filter(
                                            (item) => PrescriptionDetail.all_requests_responded_to ? true : item.status.toLowerCase() == 'pending'
                                        )
                                        .map((item, index) => (
                                            <Tbody key={index}>
                                                <Tr>
                                                    <Td>{item.medicine.name}</Td>
                                                    <Td>{item.quantity}</Td>
                                                    <Td>{item.medicine.quantity}</Td>
                                                    <Td>
                                                        {!PrescriptionDetail.all_requests_responded_to && item.status.toLowerCase() == 'pending' && (
                                                            <>
                                                                <IconButton
                                                                    mr={2}
                                                                    aria-label='Accept'
                                                                    icon={<CheckIcon />}
                                                                    colorScheme='green'
                                                                    onClick={() => changeMedicineRequestStatus(PrescriptionDetail, item, 'Approved')}
                                                                />

                                                                <IconButton
                                                                    aria-label='Decline'
                                                                    icon={<CloseIcon />}
                                                                    colorScheme='red'
                                                                    onClick={() => changeMedicineRequestStatus(PrescriptionDetail, item, 'Rejected')}
                                                                />
                                                            </>
                                                        )}
                                                        {PrescriptionDetail.all_requests_responded_to && PrescriptionDetail.all_requests_responded_to && item.status.toLowerCase() == 'approved' && (
                                                            <Tag colorScheme='green'>Accepted</Tag>
                                                        )}
                                                        {PrescriptionDetail.all_requests_responded_to && item.status.toLowerCase() == 'rejected' && (
                                                            <Tag colorScheme='red'>Rejected</Tag>
                                                        )}

                                                    </Td>
                                                </Tr>
                                            </Tbody>
                                        ))}
                                </Table>
                            </Box>

                        </ModalBody>

                        <ModalFooter gap={5}>
                            <Button
                                bg='white'
                                leftIcon={<IoClose color="red.700" />}
                                colorScheme='red'
                                variant='outline'
                                p='10px'
                                px={5}
                                w='50%'>
                                <Text mr='5px' fontSize={15} fontWeight='normal'>Reject All</Text>
                            </Button>
                            <Button
                                leftIcon={<IoCheckmarkSharp color="green.700" />}
                                colorScheme='green'
                                variant='solid'
                                p='10px'
                                px={5}
                                w='50%'>
                                <Text mr='5px' fontSize={15} fontWeight='normal'>Accept All</Text>
                            </Button>
                        </ModalFooter>

                    </ModalContent>
                )}
            </Modal>
        </Box>
    );
}

export default Prescriptions;