import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    Grid,
    GridItem,
    Heading,
    HStack,
    ListItem,
    SimpleGrid,
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
    UnorderedList,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Divider,
    useToast,
    Table,
    Tr,
    Td,
    Tbody,
    Thead,
    Th,
} from "@chakra-ui/react";

import { NavLink, useOutletContext, useParams, useSearchParams } from "react-router-dom";

// Styles
import styles from "../styles/Patient.module.css";

// Components
import MedicalRecord from "../components/MedicalRecord";

// Hooks
import { useEffect, useState } from "react";
import useLoader from "../hooks/useLoader";

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

    const [patient, setpatient] = useState(null)
    const { setPatient: setPatientInfo, user, handleRecordEdit } = useOutletContext()

    const [RecordList, setRecordList] = useState(null)
    const [NotFound, setNotFound] = useState(false)


    const [loading, setLoading] = useState(false)
    const [loadingRecord, setLoadingRecord] = useState(false)

    const [med, setMed] = useState({ 'ok': false })

    const [tabIndex, setTabIndex] = useState(med['ok'] ? 1 : 0)


    useEffect(() => {
        if (searchParams.get('med')) {
            setTabIndex(1)
            if (!loadingRecord) handleMedChange(searchParams.get('med'))
        } else {
            setTabIndex(0)
        }

        if (!patient) {
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
                setPatientInfo({ first_name: "Patient", last_name: "Not Found" })
                setNotFound(true)
                toast({
                    title: "Error",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            })
        }

    }, [searchParams])

    useEffect(() => {
        if (med['ok']) setTabIndex(1)
    }, [med])



    const handleTabsChange = (index) => {
        setTabIndex(index)
    }
    const handleMedChange = (med) => {
        setLoadingRecord(true)
        setLoading(true)
        setMed({ 'ok': false })

        useLoader("/patients/" + id + "/medical-records/" + med).then(res => {
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
                Patient Not Found
            </Text>
            <Text textAlign='center' fontSize={15}>
                (Please check the id and try again)
            </Text>
        </Box>
    )
    return (
        <Tabs index={tabIndex} onChange={handleTabsChange}>
            <TabList>
                <Tab>Patient</Tab>
                <Tab isDisabled={med['ok'] ? false : true}>Medical Record</Tab>
            </TabList>

            <TabPanels>
                <TabPanel p={0}>
                    <TableContainer whiteSpace="normal">
                        {patient && <Box>
                            <Card>
                                <CardBody>
                                    <Grid maxW='100%' templateColumns={{ base: '1fr', xl: 'repeat(2, 1fr)' }} gap={4}>
                                        <GridItem>
                                            <Stack spacing={4} divider={<StackDivider borderColor='gray.200' />}>
                                                <Box>
                                                    <Stack spacing={4}>
                                                        <Box bg='gray.50' border='2px' borderRadius='lg' borderColor='gray.300' p='20px' px='20px' boxShadow='sm'>
                                                            <Text
                                                                fontSize={25}
                                                                color='gray.700'
                                                            >
                                                                Information:
                                                            </Text>
                                                            <Box mt={4}>
                                                                <Table className={styles.table} variant="unstyled">
                                                                    <Tbody fontSize={18}>
                                                                        <Tr >
                                                                            <Td color='gray.700'><Text>Name:</Text></Td>
                                                                            <Td color='gray.500'>{patient.first_name + " " + patient.last_name}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td color='gray.700'>Phone number:</Td>
                                                                            <Td color='gray.500'>{patient.phone_number}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td color='gray.700'>Birth date:</Td>
                                                                            <Td color='gray.500'>{patient.birth_date}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td color='gray.700'>Place of birth:</Td>
                                                                            <Td color='gray.500'>{patient.place_of_birth}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td color='gray.700'>Gender:</Td>
                                                                            <Td color='gray.500'>{patient.gender}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td color='gray.700'>Nationality:</Td>
                                                                            <Td color='gray.500'>{patient.nationality}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td color='gray.700'>Address:</Td>
                                                                            <Td color='gray.500'>{patient.address}</Td>
                                                                        </Tr>
                                                                    </Tbody>
                                                                </Table>
                                                            </Box>
                                                        </Box>
                                                        <Box bg='gray.50' border='2px' borderRadius='lg' borderColor='red.300' p='20px' px='20px' boxShadow='sm'>
                                                            <Text
                                                                fontSize={25}
                                                                color='red.700'
                                                            >
                                                                Emergency Information:
                                                            </Text>
                                                            <Box mt={4}>
                                                                <Table className={styles.tableRed} variant="unstyled">
                                                                    <Tbody fontSize={18}>
                                                                        <Tr >
                                                                            <Td color='red.700'><Text>Emergency Contact Name:</Text></Td>
                                                                            <Td color='gray.500'>{patient.emergency_contact_name}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td color='red.700'>Emergency Contact Phone:</Td>
                                                                            <Td color='gray.500'>{patient.emergency_contact_number}</Td>
                                                                        </Tr>
                                                                    </Tbody>
                                                                </Table>
                                                            </Box>
                                                        </Box>
                                                    </Stack>
                                                </Box>

                                            </Stack>
                                        </GridItem>
                                        <GridItem>
                                            <Box p={0} bg='gray.50' boxShadow='lg' borderRadius='lg' border='2px' borderColor='gray.300' overflow='hidden'>
                                                <Heading p='10px' size='md' color='gray.700' textTransform='uppercase' w='100%'>
                                                    Medical Records
                                                </Heading>
                                                {/* only doctor  */}
                                                <Box p={2} >
                                                    <Accordion p={0} bg='gray.50' width='100%' border='4px' borderColor='gray.300' borderRadius='md' allowToggle>
                                                        {/* if there is no record */}
                                                        {RecordList && RecordList.length === 0 && <Text bg='gray.100' textAlign='center' p={2} mt='0' fontSize={20}>NO MEDICAL RECORDS FOUND</Text>}
                                                        {RecordList && RecordList.map((record, index) => (
                                                            <AccordionItem bg='white' key={index}>
                                                                <h2>
                                                                    <AccordionButton _expanded={{ bg: record.patient_leaving_date ? 'red.500' : 'green.500', color: 'white' }}>
                                                                        <Box fontSize='lg' as="span" flex='1' textAlign='left'>
                                                                            <Text>Medical Record #{record.id}
                                                                                {record.patient_leaving_date ? ' - Discharged ' : ' - In Hospital '}
                                                                                {record.user_id == user.id ? '(owned)' : ''}
                                                                            </Text>
                                                                        </Box>
                                                                        <AccordionIcon />
                                                                    </AccordionButton>
                                                                </h2>
                                                                <AccordionPanel border='4px' borderTop={0} borderColor={record.patient_leaving_date ? 'red.500' : 'green.500'} pb={4} color='gray.900'>
                                                                    <Text pt='2' fontSize='md'>
                                                                        Entry day: {record.patient_entry_date}
                                                                    </Text>
                                                                    <Text pt='2' mb='5' fontSize='md'>
                                                                        Leaving day: {record.patient_leaving_date ? record.patient_leaving_date : 'still in hospital'}
                                                                    </Text>
                                                                    <NavLink to={"?med=" + record.id} onClick={() => handleMedChange(record.id)}>
                                                                        <Button colorScheme={record.patient_leaving_date ? 'red' : 'green'} width='100%' variant='solid' isLoading={loading}>
                                                                            Open
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
                    {!patient && <Center p='10px'>
                        <Spinner thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl' />
                    </Center>}
                </TabPanel>
                <TabPanel>
                    {med['ok'] && <MedicalRecord medical_record={med['data']} user={user} editRecord={handleRecordEdit} />}
                    {loadingRecord && <Center p='10px'><Spinner thickness='4px' /></Center>}
                </TabPanel>
            </TabPanels>
        </Tabs>

    );
}

export default Patient;
