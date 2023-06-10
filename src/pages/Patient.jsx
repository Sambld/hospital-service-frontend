import {
    Box,
    Button,
    Card,
    CardBody,
    Center,
    Grid,
    GridItem,
    Heading,
    Spinner,
    Stack,
    StackDivider,
    Tab,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useToast,
    Table,
    Tr,
    Td,
    Tbody,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogOverlay,
    Skeleton,
    useColorModeValue,
} from "@chakra-ui/react";

import { NavLink, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";

// Styles
import styles from "../styles/Patient.module.css";

// Components
import MedicalRecord from "../components/MedicalRecord";

// Hooks
import { useEffect, useState } from "react";
import useLoader from "../hooks/useLoader";

// Icons
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import useDelete from "../hooks/useDelete";

// Translations
import { useTranslation } from "react-i18next";

const SummaryItem = ({ label, children }) => (
    <Box w='100%' display='flex' flexDirection='row' justifyContent='space-between'>
        <Text pt='2' fontSize='lg' fontWeight="bold">{label}:</Text>
        <Text pl='10' pt='2' fontSize='lg'>{children}</Text>
    </Box>
);

const Patient = () => {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const toast = useToast()

    const { t, i18n } = useTranslation()
    const boxBgLight = useColorModeValue('white', 'gray.700');
    const boxBgDark = useColorModeValue('gray.700', 'white');

    const textColorLight = useColorModeValue('gray.700', 'gray.200');
    const textColorDark = useColorModeValue('gray.200', 'gray.700');

    const tableTdColorLight = useColorModeValue('gray.500', 'gray.400');
    const tableTdColorDark = useColorModeValue('gray.400', 'gray.500');

    const redTextColorLight = useColorModeValue('red.700', 'red.200');
    const redTextColorDark = useColorModeValue('red.200', 'red.700');

    const textColorLightTwo = useColorModeValue('gray.700', 'gray.200');
    const bgColorLightTwo = useColorModeValue('gray.300', 'gray.700');
    const bgColorDarkTwo = useColorModeValue('gray.50', 'gray.700');
    const textColorDarkTwo = useColorModeValue('gray.900', 'gray.200');
    const buttonBgLightTwo = useColorModeValue('white', 'gray.700');

    const colorModeValue1 = useColorModeValue('gray.50', 'gray.700');

    const [patient, setpatient] = useState(null)
    const { setPatient: setPatientInfo, user, handleRecordEdit, handlePatientEdit } = useOutletContext()

    const { isOpen: isPatientDeleteOpen, onOpen: onPatientDeleteOpen, onClose: onPatientDeleteClose } = useDisclosure()

    const [RecordList, setRecordList] = useState(null)
    const [NotFound, setNotFound] = useState(false)


    const [loading, setLoading] = useState(false)
    const [loadingRecord, setLoadingRecord] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [med, setMed] = useState({ 'ok': false })

    const [tabIndex, setTabIndex] = useState(med['ok'] ? 1 : 0)

    const navigate = useNavigate()


    useEffect(() => {
        if (searchParams.get('med')) {
            setTabIndex(1)
            if (!loadingRecord) handleMedChange(searchParams.get('med'))
        } else {
            setTabIndex(0)
        }

        if (!patient) {
            getPatientInfo()
        }

    }, [searchParams])

    useEffect(() => {
        if (med['ok']) setTabIndex(1)
    }, [med])


    const handleTabsChange = (index) => {
        setTabIndex(index)
    }


    const getPatientInfo = () => {
        useLoader('/patients/' + id).then(res => {
            // CHECK IF PATIENT EXISTS
            if (!res.data) {
                console.log('not found')
                setPatientInfo({ first_name: "Patient", last_name: "Not Found" })
                setNotFound(true)
                return null
            }
            // SET PATIENT INFO
            setpatient(res.data.patient)
            setPatientInfo(res.data.patient)
            // SET MEDICAL RECORDS
            useLoader("/patients/" + id + "/medical-records").then(res => {
                setRecordList(res.data)
            })
        }).catch(err => {
            console.log(err)
            setPatientInfo({ first_name: "Patient", last_name: "Not Found" })
            setNotFound(true)
            toast({
                title: "Error",
                description: err.response.data.error,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        })
    }

    const handleMedChange = (med) => {
        setLoadingRecord(true)
        setLoading(true)
        setMed({ 'ok': false })

        useLoader("/patients/" + id + "/medical-records/" + med + "?withDoctor=true").then(res => {
            setLoadingRecord(false)
            setLoading(false)
            if (res?.data == undefined) {
                throw Error('Error loading medical record')
            }
            const medical_record = {
                'ok': true,
                'data': res.data,
            }
            setMed(medical_record)
        })
            .catch(err => {
                toast({
                    title: "Error",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
                setLoadingRecord(false)
                setLoading(false)
                setMed({ 'ok': false })
                setTabIndex(0)
            })
    }

    const handlePatientDelete = () => {
        setDeleteLoading(true)
        useDelete('/patients/' + id).then(res => {
            toast({
                title: "Success",
                description: "Patient deleted successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            navigate('/patients')
        }).catch(err => {
            toast({
                title: "Error",
                description: err.response.data.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        })
            .finally(() => {
                setDeleteLoading(false)
                onPatientDeleteClose()
            })

    }



    if (NotFound) return (
        <Box>
            <Text
                as="h2"
                fontSize={50}
                fontWeight='bold'
                bg='blue.700'
                textAlign='center'
                backgroundClip="text">
                404
            </Text>
            <Text textAlign='center' fontSize={30}>
                {t('patientNotFound')}
            </Text>
            <Text textAlign='center' fontSize={15}>
                ({t('checkId')})
            </Text>
        </Box>
    )
    return (
        <>
            <Tabs index={tabIndex} onChange={handleTabsChange}>
                <TabList color={useColorModeValue('gray.700', 'gray.200')}>
                    <Tab>
                        {t('patient.patient')}
                    </Tab>
                    <Tab isDisabled={med['ok'] ? false : true}>
                        {t('medicalRecord.medicalRecord')}
                    </Tab>
                </TabList>

                <TabPanels>
                    <TabPanel p={0} >
                        <TableContainer whiteSpace="normal" >
                            {patient && <Box>
                                <Card bg='transparent' boxShadow='none' >
                                    <CardBody >
                                        <Grid maxW='100%' templateColumns={{ base: '1fr', xl: 'repeat(2, 1fr)' }} gap={4}>
                                            <GridItem>
                                                <Stack spacing={4} divider={<StackDivider borderColor='gray.200' />}>
                                                    <Box>
                                                        <Stack spacing={4}>
                                                            <Box bg={boxBgLight} border='2px' borderRadius='lg' borderColor='gray.300' p='20px' px='20px' boxShadow='sm'>
                                                                <Text fontSize={25} color={textColorLight}>
                                                                    {t('patient.details.information')}:
                                                                </Text>
                                                                <Box mt={4}>
                                                                    <Table className={styles.table} variant="unstyled">
                                                                        <Tbody fontSize={18}>
                                                                            <Tr>
                                                                                <Td color={textColorLight}>
                                                                                    <Text>{t('patient.details.name')}:</Text>
                                                                                </Td>
                                                                                <Td color={tableTdColorLight}>{patient.first_name + " " + patient.last_name}</Td>
                                                                            </Tr>
                                                                            <Tr>
                                                                                <Td color={textColorLight}>{t('patient.details.gender')}:</Td>
                                                                                <Td color={tableTdColorLight}>{patient.gender}</Td>
                                                                            </Tr>

                                                                            {user?.role == 'doctor' && (
                                                                                <>
                                                                                    <Tr>
                                                                                        <Td color={textColorLight}>{t('patient.phoneNumber')}:</Td>
                                                                                        <Td color={tableTdColorLight}>{patient.phone_number}</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td color={textColorLight}>{t('patient.birthDate')}:</Td>
                                                                                        <Td color={tableTdColorLight}>{patient.birth_date}</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td color={textColorLight}>{t('patient.details.placeOfBirth')}:</Td>
                                                                                        <Td color={tableTdColorLight}>{patient.place_of_birth}</Td>
                                                                                    </Tr>

                                                                                    <Tr>
                                                                                        <Td color={textColorLight}>{t('patient.details.nationality')}:</Td>
                                                                                        <Td color={tableTdColorLight}>{patient.nationality}</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td color={textColorLight}>{t('patient.details.address')}:</Td>
                                                                                        <Td color={tableTdColorLight}>{patient.address}</Td>
                                                                                    </Tr>
                                                                                </>
                                                                            )}
                                                                        </Tbody>
                                                                    </Table>
                                                                </Box>
                                                            </Box>
                                                            {user?.role == 'doctor' && (
                                                                <Box bg={colorModeValue1} border='2px' borderRadius='lg' borderColor='red.300' p='20px' px='20px' boxShadow='sm'>
                                                                    <Text fontSize={25} color={redTextColorLight}>
                                                                        {t('patient.details.emergencyInformation')}:
                                                                    </Text>
                                                                    <Box mt={4}>
                                                                        <Table className={styles.tableRed} variant="unstyled">
                                                                            <Tbody fontSize={18}>
                                                                                <Tr>
                                                                                    <Td color={redTextColorLight}>
                                                                                        <Text>{t('patient.details.emergencyContactName')}:</Text>
                                                                                    </Td>
                                                                                    <Td color={tableTdColorLight}>{patient.emergency_contact_name}</Td>
                                                                                </Tr>
                                                                                <Tr>
                                                                                    <Td color={redTextColorLight}>{t('patient.details.emergencyContactPhone')}:</Td>
                                                                                    <Td color={tableTdColorLight}>{patient.emergency_contact_number}</Td>
                                                                                </Tr>
                                                                            </Tbody>
                                                                        </Table>
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                            </GridItem>
                                            <GridItem>
                                                {user.role === 'doctor' && (
                                                    <Box
                                                        mb={4}
                                                        bg={bgColorLightTwo}
                                                        display='flex'
                                                        border='1px'
                                                        borderColor='gray.300'
                                                        borderRadius='lg'
                                                        overflow='hidden'
                                                        gap='1px'
                                                    >
                                                        <Button
                                                            leftIcon={<EditIcon />}
                                                            bg={buttonBgLightTwo}
                                                            w='50%'
                                                            variant='outline'
                                                            border={0}
                                                            colorScheme="green"
                                                            type="submit"
                                                            borderRadius={0}
                                                            onClick={() => handlePatientEdit(patient)}
                                                        >
                                                            {t('patient.details.edit')}
                                                        </Button>
                                                        <Button
                                                            leftIcon={<DeleteIcon />}
                                                            bg={buttonBgLightTwo}
                                                            w='50%'
                                                            variant='outline'
                                                            border={0}
                                                            colorScheme="red"
                                                            type="submit"
                                                            borderRadius={0}
                                                            onClick={() => onPatientDeleteOpen()}
                                                        >
                                                            {t('patient.details.delete')}
                                                        </Button>
                                                    </Box>
                                                )}
                                                <Box
                                                    p={0}
                                                    bg={bgColorDarkTwo}
                                                    boxShadow='lg'
                                                    borderRadius='lg'
                                                    border='2px'
                                                    borderColor='gray.300'
                                                    overflow='hidden'
                                                >
                                                    <Heading
                                                        p='10px'
                                                        size='md'
                                                        color={textColorLightTwo}
                                                        textTransform='uppercase'
                                                        w='100%'
                                                    >
                                                        {t('medicalRecord.title')}
                                                    </Heading>
                                                    {/* only doctor */}
                                                    <Box p={2}>
                                                        <Accordion
                                                            p={0}
                                                            bg={bgColorDarkTwo}
                                                            width='100%'
                                                            border='4px'
                                                            borderColor='gray.300'
                                                            borderRadius='md'
                                                            allowToggle
                                                        >
                                                            {/* if there is no record */}
                                                            {RecordList && RecordList.length === 0 && (
                                                                <Text
                                                                    bg={buttonBgLightTwo}
                                                                    textAlign='center'
                                                                    p={2}
                                                                    mt='0'
                                                                    fontSize={20}
                                                                >
                                                                    {t('patient.details.noMedicalRecordFound')}
                                                                </Text>
                                                            )}
                                                            {RecordList && RecordList.map((record, index) => (
                                                                <AccordionItem
                                                                    bg={buttonBgLightTwo}
                                                                    key={index}
                                                                >
                                                                    <h2>
                                                                        <AccordionButton
                                                                            _expanded={{
                                                                                bg: record.patient_leaving_date ? 'red.500' : 'green.500',
                                                                                color: 'white'
                                                                            }}
                                                                        >
                                                                            <Box fontSize='lg' as="span" flex='1' textAlign='left'>
                                                                                <Text>
                                                                                    {t('medicalRecord.medicalRecord')} #{record.id}
                                                                                    {record.patient_leaving_date
                                                                                        ? ' - ' + t('medicalRecord.discharged') + ' '
                                                                                        : ' - ' + t('medicalRecord.inHospital') + ' '}
                                                                                    {record.user_id == user.id ? '(' + t('medicalRecord.owned') + ')' : ''}
                                                                                </Text>
                                                                            </Box>
                                                                            <AccordionIcon />
                                                                        </AccordionButton>
                                                                    </h2>
                                                                    <AccordionPanel
                                                                        border='4px'
                                                                        borderTop={0}
                                                                        borderColor={record.patient_leaving_date ? 'red.500' : 'green.500'}
                                                                        pb={4}
                                                                        color={textColorDarkTwo}
                                                                    >
                                                                        <Text pt='2' fontSize='md'>
                                                                            {t('medicalRecord.entry_Day')}: {record.patient_entry_date}
                                                                        </Text>
                                                                        <Text pt='2' mb='5' fontSize='md'>
                                                                            {t('medicalRecord.discharge_Day')}: {record.patient_leaving_date ? record.patient_leaving_date : t('medicalRecord.stillInHospital')}
                                                                        </Text>
                                                                        <NavLink to={"?med=" + record.id} onClick={() => handleMedChange(record.id)}>
                                                                            <Button
                                                                                colorScheme={record.patient_leaving_date ? 'red' : 'green'}
                                                                                width='100%'
                                                                                variant='solid'
                                                                                isLoading={loading}
                                                                            >
                                                                                {t('patient.open')}
                                                                            </Button>
                                                                        </NavLink>
                                                                    </AccordionPanel>
                                                                </AccordionItem>
                                                            ))}
                                                            {!RecordList && <Center p='10px'><Spinner thickness='4px' /></Center>}
                                                        </Accordion>
                                                    </Box>
                                                </Box>
                                            </GridItem>
                                        </Grid>
                                    </CardBody>
                                </Card>
                            </Box>}
                        </TableContainer>
                        {!patient && (
                            <Box mt={5}>
                                <Grid maxW='100%' templateColumns={{ base: '1fr', xl: 'repeat(2, 1fr)' }} gap={4}>
                                    <Box ml={5} display='flex' flexDirection='column' justifyContent='center' gap={4}>
                                        <Skeleton w='100%' h='450px' borderRadius='md'>
                                            <Text>Loading...</Text>
                                        </Skeleton>
                                        <Skeleton w='100%' h='250px' borderRadius='md'>
                                            <Text>Loading...</Text>
                                        </Skeleton>
                                    </Box>
                                    <Box ml={5} display='flex' flexDirection='column' gap={4}>
                                        <Skeleton w='100%' h='130px' borderRadius='md'>
                                            <Text>Loading...</Text>
                                        </Skeleton>
                                    </Box>

                                </Grid>
                            </Box>
                        )}
                    </TabPanel>
                    <TabPanel>
                        {med['ok'] && <MedicalRecord medical_record={med['data']} user={user} editRecord={handleRecordEdit} />}
                        {loadingRecord && <Center p='10px'><Spinner thickness='4px' /></Center>}
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <AlertDialog
                isOpen={isPatientDeleteOpen}
                onClose={onPatientDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent maxW='300px' p={5}>

                        <AlertDialogBody textAlign='center'>
                            <Text fontSize='lg' fontWeight='bold'>
                                {t('global.areYouSure')}
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter justifyContent='center'>
                            <Button onClick={onPatientDeleteClose}>
                                {t('global.cancel')}
                            </Button>
                            <Button colorScheme='red' onClick={handlePatientDelete} ml={3} isLoading={deleteLoading}>
                                {t('global.delete')}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

        </>
    );
}

export default Patient;
