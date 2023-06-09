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
    Textarea,
    Heading,
    Select,
    Skeleton,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaExclamationCircle, FaPrescriptionBottleAlt, FaUserMd } from "react-icons/fa";
import { AiFillFile, AiOutlineClockCircle } from "react-icons/ai";
import { IoClose, IoCheckmarkSharp } from "react-icons/io5";
import { MdSick } from "react-icons/md";
import axios from "../components/axios";
import { useEffect, useState } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import Pagination from "../components/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import useLoader from "../hooks/useLoader";
import { useTranslation } from "react-i18next";


const Prescriptions = () => {
    const [PendingPrescriptions, setPrescriptions] = useState([])
    const [PastPrescriptions, setPastPrescriptions] = useState([])

    const [PrescriptionDetail, setPrescriptionDetail] = useState(null)
    const [SelectedPrescription, setSelectedPrescription] = useState(0)

    const [rejectSelecteItem, setRejectSelecteItem] = useState(null)
    const [review, setReview] = useState(null)


    const [PendingPagination, setPendingPagination] = useState(null)
    const [PastPagination, setPastPagination] = useState(null)

    const [PendingLoading, setPendingLoading] = useState(false)
    const [PastLoading, setPastLoading] = useState(false)

    const [reviewLoading, setReviewLoading] = useState(false)
    const [AllActionLoading, setAllActionLoading] = useState(false)

    const [singleButtonLoading, setSingleButtonLoading] = useState(
        {
            index: null,
            status: null,
            isLoading: false
        }
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure()

    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [tabIndex, setTabIndex] = useState(0)

    const { t, i18n } = useTranslation();

    const colorModeValue = useColorModeValue('white', 'gray.700');
    const colorModeValueGray = useColorModeValue('gray.500', 'gray.300');
    const colorModeValueBlue = useColorModeValue('blue.600', 'blue.200');
    const colorModeValueBlueHover = useColorModeValue('gray.100', 'gray.700');
    const colorModeValueGrayBg = useColorModeValue('gray.50', 'gray.600');
    const colorModeValueGrayText = useColorModeValue('gray.50', 'gray.50');
    const tableBorderColor = useColorModeValue(null, 'gray.900');
    const acceptButtonColorScheme = useColorModeValue('green', 'green');
    const rejectButtonColorScheme = useColorModeValue('red', 'red');
    const acceptedTagColorScheme = useColorModeValue('green', 'green');
    const rejectedTagColorScheme = useColorModeValue('red', 'red');
    const colorModeValue1 = useColorModeValue(null, '2px');





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

    const changeFormat = (date) => {
        let date_ = new Date(date)
        return date_.getUTCDate() + '-' + (date_.getUTCMonth() + 1) + '-' + date_.getUTCFullYear() + '/' + date_.getUTCHours() + ':' + date_.getUTCMinutes()
    }

    const getPendingPrescriptions = () => {
        setPrescriptions([])
        setPendingPagination(null)
        setPendingLoading(true)

        useLoader(`/prescriptions?status=open&page=${searchParams.get('page') || 1}`)
            .then(res => {
                setPendingLoading(false)
                const { data, ...pagination } = res;
                setPrescriptions(data)
                setPendingPagination(pagination)
            })
            .catch(err => {
                setPendingLoading(false)
            })

    }
    const getPastPrescriptions = () => {
        setPastPrescriptions([])
        setPastPagination(null)
        setPastLoading(true)
        useLoader(`/prescriptions?status=closed&page=${searchParams.get('page') || 1}`)
            .then(res => {
                setPastLoading(false)
                const { data, ...pagination } = res;
                setPastPrescriptions(data)
                setPastPagination(pagination)
            })
            .catch(err => {
                setPastLoading(false)
            })
    }

    const rejectMedicineRequestWithReason = async (MainInfo, message) => {
        try {
            setReviewLoading(true)
            if (rejectSelecteItem === null) {
                await changeAllMedicineRequestStatus(MainInfo, message)
            } else {
                await changeMedicineRequestStatus(MainInfo, rejectSelecteItem, 'Rejected', {
                    status: 'Rejected',
                })
                // if (MainInfo.medicine_requests.filter(medicine => medicine.status.toLowerCase() === 'pending').length === 1) {
                //     onClose();
                //     setPrescriptions(null);
                //     getPendingPrescriptions();
                // }
            }
            setReviewLoading(false)
            setRejectSelecteItem(null)
            onReviewClose();
            setReview(null);

        } catch (err) {
            toast({
                title: "There was an error",
                description: "The prescription was not completed",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setReviewLoading(false)
        }
    }



    const changeAllMedicineRequestStatus = async (MainInfo, message) => {
        let error = false;
        setAllActionLoading(true)
        for (const medicine of PrescriptionDetail.prescriptions[SelectedPrescription].medicine_requests.filter(medicine => medicine.status.toLowerCase() === 'pending')) {
            try {
                await changeMedicineRequestStatus(PrescriptionDetail, medicine, message, null, true);
            } catch (err) {
                error = true;
            }
        }
        if (!error) {
            // setPrescriptions(null);
            // getPendingPrescriptions();
            toast({
                title: t('prescription.prescriptionInfo.completed'),
                description: t('prescription.prescriptionInfo.hasCompleted'),
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            // onClose();
        } else {
            toast({
                title: "There was an error",
                description: "some of the medicines were not completed",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        }
        setAllActionLoading(false)
        onReviewClose();
        setReview(null);
    }
    const changeMedicineRequestStatus = async (MainInfo, MedInfo, message, loading = null, stopNotification = false) => {
        try {
            if (loading) setSingleButtonLoading({ index: loading.index, status: loading.status, isLoading: true });
            const res = await axios.put(`/patients/${MainInfo.patient_id}/medical-records/${MainInfo.id}/prescriptions/${MedInfo.prescription_id}/medicine-requests/${MedInfo.id}`, { status: message, review: message === 'Rejected' ? review : null });
            if (loading) setSingleButtonLoading({ index: loading.index, status: loading.status, isLoading: false });

            setPrescriptionDetail((prev) => (
                {
                    ...prev,
                    prescriptions: prev.prescriptions.map((item, index) => {
                        if (index === SelectedPrescription) {
                            return {
                                ...item,
                                medicine_requests: item.medicine_requests.map(medicine => {
                                    if (medicine.id === MedInfo.id) {
                                        return {
                                            ...medicine,
                                            status: message,
                                            review: message === 'Rejected' ? review : null
                                        }
                                    }
                                    return medicine;
                                })
                            }
                        }
                        return item;
                    })
                }
            ))

            if (!stopNotification) {
                toast({
                    title: `${t('prescription.medicine')} ${t('prescription.' + message.toLowerCase())}`,
                    description: `${t('prescription.prescriptionInfo.hasBeen')} ${t('prescription.' + message.toLowerCase())}`,
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
                const pendingMedicines = PrescriptionDetail.prescriptions[SelectedPrescription].medicine_requests.filter(item => item.status.toLowerCase() === 'pending');
                if (pendingMedicines.length === 1) {
                    // setPrescriptions(null);
                    // getPendingPrescriptions();
                    toast({
                        title: t('prescription.prescriptionInfo.completed'),
                        description: t('prescription.prescriptionInfo.hasCompleted'),
                        status: "success",
                        duration: 5000,
                        isClosable: true
                    });
                }
            }
            return Promise.resolve();
        } catch (err) {
            if (loading) setSingleButtonLoading({ index: loading.index, status: loading.status, isLoading: false });
            const response = JSON.parse(err.request.response);
            if (response.message) {
                toast({
                    title: response.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
            return Promise.reject(new Error('error'));
        }
    }
    const handlePrescriptionDetail = (info) => {
        setPrescriptionDetail(info)
        setSelectedPrescription(0)
        onOpen();
    }

    const handleSelectPrescription = (index) => {
        setSelectedPrescription(parseInt(index))
    }

    const handleTabsChange = (index) => {
        if (index === 0) {
            setPastLoading(true)
            setPrescriptions([])
            setTabIndex(index)
            navigate('/prescriptions?status=pending')
        } else if (index === 1) {
            setPendingLoading(true)
            setPastPrescriptions([])
            setTabIndex(index)
            navigate('/prescriptions?status=past')
        }
    }

    const handleClose = () => {
        setPrescriptionDetail(null)
        setSelectedPrescription(0)

        setPrescriptions(null);
        if (tabIndex === 0) {
            getPendingPrescriptions();
        } else if (tabIndex === 1) {
            getPastPrescriptions();
        }
        onClose();
    }

    const handlePagination = (e) => {
        if (searchParams.get('status')) {
            navigate('/prescriptions?status=' + searchParams.get('status') + '&page=' + e)
        } else {
            navigate('/prescriptions?page=' + e)
        }
    }

    return (
        <Box style={{ direction: i18n.dir() }} bg={useColorModeValue('white', 'gray.800')} m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
            <Tabs index={tabIndex} variant='unstyled' colorScheme='green' onChange={handleTabsChange} isFitted>
                <TabList bg={useColorModeValue('gray.300', 'gray.700')} color={useColorModeValue('gray.700', 'gray.300')} p='3px' borderRadius='md'>
                    <Tab
                        borderRadius='md'
                        _selected={{ color: 'white', bg: 'blue.500' }}
                    >
                        {t('prescription.pendingPrescription')}
                    </Tab>
                    <Tab
                        borderRadius='md'
                        _selected={{ color: 'white', bg: 'green.500' }}
                    >
                        {t('prescription.pastPrescription')}
                    </Tab>
                </TabList>
                <Box dispaly='flex' justifyContent='center' alignItems='center' p='10px'>
                    {
                        <>
                            <Grid templateColumns={{ base: '1f', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={6}>
                                {(tabIndex === 0 ? PendingPrescriptions : PastPrescriptions).map((item, index) => {
                                    const prescriptionCount = item.prescriptions.length;
                                    const doctorFullName = item.assigned_doctor.first_name + " " + item.assigned_doctor.last_name;
                                    const patientFullName = item.patient.first_name + " " + item.patient.last_name;
                                    const conditionDescription = item.condition_description;

                                    return (
                                        <GridItem key={index}>
                                            <Box h='100%' bg={colorModeValue} borderRadius='md' boxShadow='md' overflow='hidden' display='flex' flexDirection='column' justifyContent='space-between'>
                                                <Flex alignItems='center' bg='blue.500' p={3} color='white' borderTopRadius='md' gap={1}>
                                                    <Icon as={FaPrescriptionBottleAlt} fontSize='20px' mr='5px' />
                                                    <Text>
                                                        {t('prescription.prescriptions')}
                                                    </Text>
                                                    <Tag colorScheme='gray' ml='auto'>{prescriptionCount}</Tag>
                                                </Flex>
                                                <Flex justifyContent='flex-start' flexDirection='column' gap={3} p={3}>
                                                    <Text color={colorModeValueGray}>
                                                        {t('medicalRecord.medicalRecord')} <Tag colorScheme='blue'>#{item.id}</Tag>
                                                    </Text>
                                                    <Text color={colorModeValueGray}>
                                                        {t('prescription.doctor')}: {doctorFullName}
                                                    </Text>
                                                    <Text color={colorModeValueGray}>
                                                        {t('prescription.patient')}: {patientFullName}
                                                    </Text>
                                                    <Text color={colorModeValueGray}>
                                                        {t('prescription.description')}: {
                                                            conditionDescription.length > 50 ?
                                                                conditionDescription.substring(0, 50) + '...' :
                                                                conditionDescription
                                                        }
                                                    </Text>
                                                </Flex>
                                                <Flex justifyContent='space-between' bg='gray.100' borderBottomRadius='md' pt='1px' gap='1px'>
                                                    <Button
                                                        bg={colorModeValueGrayBg}
                                                        color={colorModeValueBlue}
                                                        leftIcon={<AiFillFile color='blue.700' />}
                                                        colorScheme='blue'
                                                        borderRadius={0}
                                                        border={0}
                                                        variant='outline'
                                                        p='10px'
                                                        px={5}
                                                        w='100%'
                                                        _hover={{ bg: colorModeValueBlueHover }}
                                                        onClick={() => handlePrescriptionDetail(item)}
                                                    >
                                                        <Text mr='5px' fontSize={15} fontWeight='normal'>
                                                            {t('global.detail')}
                                                        </Text>
                                                    </Button>
                                                </Flex>
                                            </Box>
                                        </GridItem>
                                    );
                                })}
                            </Grid>
                            {(tabIndex == 0 ? PendingLoading : PastLoading) && (
                                <Box>
                                    <Grid templateColumns={{ base: '1f', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={6}>
                                        {[1].map((i) => (
                                            <Box display='flex' p='0px' key={i} borderRadius='md' boxShadow='md' overflow='hidden'>
                                                <Skeleton w='100%' h='250px'>
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
                            {(tabIndex == 0 ? PendingPrescriptions : PastPrescriptions) && (tabIndex == 0 ? PendingPrescriptions : PastPrescriptions).length === 0 && !(tabIndex == 0 ? PendingLoading : PastLoading) &&
                                <Flex justifyContent='center' alignItems='center' h='100px'>
                                    <Icon as={FaExclamationCircle} fontSize='50px' color='gray.500' />
                                    <Text ml={2} fontSize='20px' fontWeight='bold' color='gray.500'>
                                        No {tabIndex == 0 ? 'Pending' : 'Past'} Prescriptions
                                    </Text>
                                </Flex>
                            }
                            {(tabIndex == 0 ? PendingPrescriptions : PastPrescriptions) && (tabIndex == 0 ? PendingPrescriptions : PastPrescriptions).last_page > 1 &&
                                <Flex justifyContent='center' alignItems='center' h='100px'>
                                    <Pagination pagination={(tabIndex == 0 ? PendingPrescriptions : PastPrescriptions)} action={handlePagination} />
                                </Flex>
                            }
                        </>
                    }
                </Box>
            </Tabs>


            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                {PrescriptionDetail && (
                    <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }} maxW='800px' p={3}>
                        <ModalHeader>{t('medicalRecord.medicalRecord')} #{PrescriptionDetail.id} {t('prescription.prescriptions')} </ModalHeader>
                        <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0.75rem', left: i18n.dir() == 'rtl' ? '0.75rem' : 'unset' }} />
                        <ModalBody>
                            {/* doctor name */}
                            <Flex justifyContent='flex-start' alignItems='center' gap={3} mb={2}>
                                <FaUserMd fontSize='20px' />
                                <Text>{PrescriptionDetail.assigned_doctor.first_name + " " + PrescriptionDetail.assigned_doctor.last_name}</Text>
                            </Flex>
                            {/* time */}
                            <Flex justifyContent='flex-start' alignItems='center' gap={3}>
                                <MdSick fontSize='20px' />
                                <Text>{PrescriptionDetail.patient.first_name + " " + PrescriptionDetail.patient.last_name} #{PrescriptionDetail.patient_id}</Text>
                            </Flex>
                            <Divider mt={3} mb={3} />
                            <Select onChange={(e) => handleSelectPrescription(e.target.value)}>
                                {PrescriptionDetail.prescriptions.length > 0 && PrescriptionDetail.prescriptions.map((item, index) => (
                                    <option key={index} value={index}>#{item.id} {item.name} ({changeFormat(item.created_at)})</option>

                                ))}
                            </Select>
                            <Divider mt={3} mb={3} />
                            {PrescriptionDetail.prescriptions[SelectedPrescription] && (
                                <Box maxH='50vh' overflow='auto' >
                                    <Text mb={2} fontSize='20px' fontWeight='bold'>
                                        {t('prescription.prescriptionDetail')}
                                    </Text>
                                    <Table variant='simple' colorScheme='blackAlpha' border={colorModeValue1} borderColor={tableBorderColor}>
                                        <Thead>
                                            <Tr>
                                                <Th w='300px'>{t('prescription.medicine')}</Th>
                                                <Th textAlign='center'>{t('medicine.quantity')}</Th>
                                                {tabIndex === 0 && <Th textAlign='center'>{t('prescription.available')}</Th>}
                                                <Th></Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {PrescriptionDetail.prescriptions[SelectedPrescription].medicine_requests.length > 0 &&
                                                PrescriptionDetail.prescriptions[SelectedPrescription].medicine_requests.map((item, index) => {
                                                    const isPending = item.status.toLowerCase() === 'pending';
                                                    const isApproved = item.status.toLowerCase() === 'approved';
                                                    const isRejected = item.status.toLowerCase() === 'rejected';

                                                    return (
                                                        <Tr key={index}>
                                                            <Td>{item.medicine.name}</Td>
                                                            <Td textAlign='center'>{item.quantity}</Td>
                                                            {tabIndex === 0 && <Td textAlign='center'>{item.medicine.quantity}</Td>}
                                                            <Td>
                                                                {isPending ? (
                                                                    <>
                                                                        <IconButton
                                                                            mx={2}
                                                                            aria-label='Accept'
                                                                            icon={<CheckIcon />}
                                                                            colorScheme={acceptButtonColorScheme}
                                                                            isLoading={
                                                                                singleButtonLoading.isLoading &&
                                                                                singleButtonLoading.index === index &&
                                                                                singleButtonLoading.status === 'Approved'
                                                                            }
                                                                            onClick={() =>
                                                                                changeMedicineRequestStatus(PrescriptionDetail, item, 'Approved', {
                                                                                    index,
                                                                                    status: 'Approved',
                                                                                })
                                                                            }
                                                                        />

                                                                        <IconButton
                                                                            aria-label='Decline'
                                                                            icon={<CloseIcon />}
                                                                            colorScheme={rejectButtonColorScheme}
                                                                            isLoading={
                                                                                singleButtonLoading.isLoading &&
                                                                                singleButtonLoading.index === index &&
                                                                                singleButtonLoading.status === 'Rejected'
                                                                            }
                                                                            onClick={(event) => {
                                                                                setRejectSelecteItem(item);
                                                                                onReviewOpen();
                                                                            }}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {isApproved && (
                                                                            <Tag w='100%' h='40px' colorScheme={acceptedTagColorScheme}>
                                                                                <Text w='100%' textAlign='center' fontSize='15px' fontWeight='bold'>
                                                                                    {t('prescription.accepted')}
                                                                                </Text>
                                                                            </Tag>
                                                                        )}
                                                                        {isRejected && (
                                                                            <Tag w='100%' h='40px' colorScheme={rejectedTagColorScheme}>
                                                                                <Text w='100%' textAlign='center' fontSize='15px' fontWeight='bold'>
                                                                                    {t('prescription.rejected')}
                                                                                </Text>
                                                                            </Tag>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </Td>
                                                        </Tr>
                                                    );
                                                })}
                                        </Tbody>
                                    </Table>
                                </Box>
                            )}

                        </ModalBody>
                        {!AllActionLoading && PrescriptionDetail.prescriptions[SelectedPrescription] && PrescriptionDetail.prescriptions[SelectedPrescription]?.medicine_requests.filter((item) => item.status.toLowerCase() === 'pending').length > 0 && (
                            <ModalFooter gap={5}>
                                <Button
                                    bg='white'
                                    leftIcon={<IoClose color="red.700" />}
                                    colorScheme='red'
                                    variant='outline'
                                    p='10px'
                                    px={5}
                                    w='50%'
                                    isLoading={AllActionLoading}
                                    onClick={() => onReviewOpen()}
                                >
                                    <Text mr='5px' fontSize={15} fontWeight='normal'>
                                        {t('prescription.rejectAll')}
                                    </Text>
                                </Button>
                                <Button
                                    leftIcon={<IoCheckmarkSharp color="green.700" />}
                                    colorScheme='green'
                                    variant='solid'
                                    p='10px'
                                    px={5}
                                    w='50%'
                                    isLoading={AllActionLoading}
                                    onClick={() => changeAllMedicineRequestStatus(PrescriptionDetail, 'Approved')}
                                >
                                    <Text mr='5px' fontSize={15} fontWeight='normal'>
                                        {t('prescription.acceptAll')}
                                    </Text>
                                </Button>
                            </ModalFooter>
                        )}

                        {AllActionLoading && (
                            <Flex justifyContent='center' alignItems='center' h='72px'>
                                <Spinner />
                            </Flex>
                        )}

                    </ModalContent>
                )}
            </Modal>
            <Modal blockScrollOnMount={false} isOpen={isReviewOpen} onClose={onReviewClose}>
                <ModalOverlay />
                <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }} maxW='800px'>
                    <ModalHeader>
                        {t('prescription.reviewPrescription')}
                    </ModalHeader>
                    <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0.75rem', left: i18n.dir() == 'rtl' ? '0.75rem' : 'unset' }} />
                    <ModalBody>
                        <Textarea placeholder={t('prescription.writeYourReviewHere')} value={review || ''} onChange={(event) => setReview(event.target.value)} />
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            leftIcon={<IoCheckmarkSharp color="green.700" />}
                            colorScheme='green'
                            variant='solid'
                            p='10px'
                            px={5}
                            w='50%'
                            isLoading={reviewLoading}
                            onClick={() => rejectMedicineRequestWithReason(PrescriptionDetail, 'Rejected')}
                        >
                            <Text mr='5px' fontSize={15} fontWeight='normal'>
                                {t('global.submit')}
                            </Text>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Prescriptions;