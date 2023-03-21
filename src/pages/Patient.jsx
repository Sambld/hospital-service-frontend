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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NavLink, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import MedicalRecord from "../components/MedicalRecord";
import useLoader from "../hooks/useLoader";

const SummaryItem = ({ label, children }) => (
    <Box>
        <Text pt='2' fontSize='lg' fontWeight="bold">{label}:</Text>
        <Text pl='10' pt='2' fontSize='lg'>{children}</Text>
    </Box>
);

const Patient = () => {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const toast = useToast()

    const [patient, setpatient] = useState(null)
    const { setPatient: setPatientInfo, user } = useOutletContext()
    const [RecordList, setRecordList] = useState(null)
    const [NotFound, setNotFound] = useState(false)

    const [loading, setLoading] = useState(false)
    const [loadingRecord, setLoadingRecord] = useState(false)

    const [med, setMed] = useState({ 'ok': false })

    const [tabIndex, setTabIndex] = useState(med['ok'] ? 1 : 0)


    useEffect(() => {
        if (searchParams.get('med')) {
            setTabIndex(1)
            console.log('first useEffect')
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


    if (NotFound) return <Center><Heading>Patient Not Found</Heading></Center>
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
                                    <Grid maxW='100%' templateColumns={{ base: '1fr', xl: 'repeat(2, 50%)' }} gap={4}>
                                        <GridItem>
                                            <Stack spacing={4} divider={<StackDivider borderColor='gray.200' />}>
                                                <Box>
                                                    <Stack spacing={4}>
                                                        <Box p='0px' borderRadius={8}>
                                                            <Heading bg='blue.700' p='10px' borderTopRadius={8} size='sm' color='gray.100' textTransform='uppercase' w='100%'>
                                                                Patient information
                                                            </Heading>
                                                            <VStack bg='gray.50' color='blue.900' p='20px' spacing={2} align="start" pl='3' borderBottomRadius={8}>
                                                                <SummaryItem label="Name ">{patient.first_name + " " + patient.last_name}</SummaryItem>
                                                                <SummaryItem label="Birth date">{patient.birth_date}</SummaryItem>
                                                                <SummaryItem label="Place of birth">{patient.place_of_birth}</SummaryItem>
                                                                <SummaryItem label="Gender">{patient.gender}</SummaryItem>
                                                                <SummaryItem label="Nationality">{patient.nationality}</SummaryItem>
                                                                <SummaryItem label="Address">{patient.address}</SummaryItem>
                                                                <Divider />
                                                                <Box color="red">
                                                                    {/* Emergency Contact */}
                                                                    <SummaryItem label="Emergency Contact Name">{patient.emergency_contact_name}</SummaryItem>
                                                                    <SummaryItem label="Emergency Contact Phone">{patient.emergency_contact_number}</SummaryItem>
                                                                </Box>

                                                            </VStack>
                                                        </Box>
                                                        {/* <Box bg='red' p='0px' borderRadius={20}>
                                                            <Heading p='10px' bg='red' borderTopRadius={5} size='md' color='gray.100' textTransform='uppercase'>
                                                                Emergency Contact
                                                            </Heading>
                                                            <VStack bg='red.50' p='20px' spacing={2} align="start" pl='3' fontSize={30} borderRadius={20} borderTopRadius={0}>
                                                                <SummaryItem label="Name">{patient.emergency_contact_name}</SummaryItem>
                                                                <SummaryItem label="Phone">{patient.emergency_contact_number}</SummaryItem>
                                                            </VStack>
                                                        </Box> */}
                                                    </Stack>
                                                </Box>

                                            </Stack>
                                        </GridItem>
                                        <GridItem>
                                            <Box p={0}>
                                                <Heading p='10px' bg='blue.700' size='md' color='gray.200' textTransform='uppercase' w='100%' borderTopRadius={8}>
                                                    Medical Records
                                                </Heading>
                                                {/* only doctor  */}
                                                <Accordion p={0} bg='gray.100' width='100%' allowToggle>
                                                    {/* if there is no record */}
                                                    {RecordList && RecordList.length === 0 && <Text bg='gray.100' textAlign='center' p={2} mt='0' fontSize={20}>NO MEDICAL RECORDS FOUND</Text>}
                                                    {RecordList && RecordList.map((record, index) => (
                                                        <AccordionItem bg='white' key={index}>
                                                            <h2>
                                                                <AccordionButton _expanded={{ bg: record.patient_leaving_date ? 'green.500' : 'red.500', color: 'white' }}>
                                                                    <Box fontSize='lg' as="span" flex='1' textAlign='left'>
                                                                        <Text>Medical Record #{record.id}
                                                                            {record.patient_leaving_date ? ' - Discharged ' : ' - In Hospital '}
                                                                            {record.user_id == user.id ? '(owned)' : ''}
                                                                        </Text>
                                                                    </Box>
                                                                    <AccordionIcon />
                                                                </AccordionButton>
                                                            </h2>
                                                            <AccordionPanel border='4px' borderTop={0} borderColor={record.patient_leaving_date ? 'green.500' : 'red.500'} pb={4} color='gray.900'>
                                                                <Text pt='2' fontSize='md'>
                                                                    Entry day: {record.patient_entry_date}
                                                                </Text>
                                                                <Text pt='2' mb='5' fontSize='md'>
                                                                    Leaving day: {record.patient_leaving_date ? record.patient_leaving_date : 'still in hospital'}
                                                                </Text>
                                                                <NavLink to={"?med=" + record.id} onClick={() => handleMedChange(record.id)}>
                                                                    <Button colorScheme={record.patient_leaving_date ? 'green' : 'red'} width='100%' variant='solid' isLoading={loading}>
                                                                        Open
                                                                    </Button>
                                                                </NavLink>
                                                            </AccordionPanel>
                                                        </AccordionItem>
                                                    ))}
                                                    {!RecordList && <Center p='10px'><Spinner thickness='4px' /></Center>}
                                                </Accordion>
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
                    {med['ok'] && <MedicalRecord medical_record={med['data']} user={user} />}
                    {loadingRecord && <Center p='10px'><Spinner thickness='4px' /></Center>}
                </TabPanel>
            </TabPanels>
        </Tabs>

    );
}

export default Patient;
