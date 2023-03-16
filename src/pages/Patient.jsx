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
    const {user} = useOutletContext()
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const [patient, setpatient] = useState(null)
    const setPatientInfo = useOutletContext()
    const [RecordList, setRecordList] = useState(null)
    const [NotFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(false)

    const [med, setMed] = useState({ 'ok': false })

    const [tabIndex, setTabIndex] = useState(med['ok'] ? 1 : 0)

    useEffect(() => {
        
        if (searchParams.get('med')) {
            setTabIndex(1)
            handleMedChange(searchParams.get('med'))
        }
        useLoader('/patients/' + id).then(res => {
            // CHECK IF PATIENT EXISTS
            if (res.error != undefined) res = []
            if (!res) {
                setPatientInfo({ first_name: "Patient", last_name: "Not Found" })
                setNotFound(true)
                return null
            }
            // SET PATIENT INFO
            setpatient(res.patient)
            setPatientInfo(res.patient)
            // SET MEDICAL RECORDS
            useLoader("/patients/" + id + "/medical-records").then(res => {
                setRecordList(res.reverse())
            })
        })
    }, [])

    useEffect(() => {
        if (med['ok']) setTabIndex(1)
    }, [med])

    useEffect(() => {
        if (searchParams.get('med')) {
            setTabIndex(1)
            handleMedChange(searchParams.get('med'))
        }else{
            setTabIndex(0)
        }
    }, [searchParams])

    const handleTabsChange = (index) => {
        setTabIndex(index)
    }
    const handleMedChange = (med) => {
        setLoading(true)
        useLoader("/patients/" + id + "/medical-records/" + med).then(res => {
            setLoading(false)
            if (res == undefined) {
                setMed({ 'ok': false })
            }
            const medical_record = {
                'ok': true,
                'data': res,
            }
            setMed(medical_record)
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
                                                        <Box bg='gray.700' p='0px' borderRadius={5} border='4px' borderColor='gray.700'>
                                                            <Heading p='10px' bg='gray.700' borderTopRadius={5} size='md' color='gray.200' textTransform='uppercase' w='100%'>
                                                                Patient information
                                                            </Heading>
                                                            <VStack bg='gray.100' p='20px' spacing={2} align="start" pl='3'>
                                                                <SummaryItem label="Name ">{patient.first_name + " " + patient.last_name}</SummaryItem>
                                                                <SummaryItem label="Birth date">{patient.birth_date}</SummaryItem>
                                                                <SummaryItem label="Place of birth">{patient.place_of_birth}</SummaryItem>
                                                                <SummaryItem label="Gender">{patient.gender}</SummaryItem>
                                                                <SummaryItem label="Nationality">{patient.nationality}</SummaryItem>
                                                                <SummaryItem label="Address">{patient.address}</SummaryItem>
                                                            </VStack>
                                                        </Box>
                                                        <Box bg='red' p='0px' borderRadius={5} border='4px' borderColor='red'>
                                                            <Heading p='10px' bg='red' borderTopRadius={5} size='md' color='gray.100' textTransform='uppercase'>
                                                                Emergency Contact
                                                            </Heading>
                                                            <VStack bg='red.50' p='20px' spacing={2} align="start" pl='3' fontSize={30}>
                                                                <SummaryItem label="Name">{patient.emergency_contact_name}</SummaryItem>
                                                                <SummaryItem label="Phone">{patient.emergency_contact_number}</SummaryItem>
                                                            </VStack>
                                                        </Box>
                                                    </Stack>
                                                </Box>

                                            </Stack>
                                        </GridItem>
                                        <GridItem>
                                            <Box p={0}>
                                                <Heading p='10px' bg='gray.700' size='md' color='gray.200' textTransform='uppercase' w='100%'>
                                                    Medical Records
                                                </Heading>
                                                <Accordion p={0} bg='gray.100' width='100%' allowToggle>
                                                    {/* if there is no record */}
                                                    {RecordList && RecordList.length === 0 && <Text bg='gray.100' textAlign='center' p={2} mt='0' fontSize={20}>NO MEDICAL RECORDS FOUND</Text>}
                                                    {RecordList && RecordList.map((record, index) => (
                                                        <AccordionItem bg='white' key={index}>
                                                            <h2>
                                                                <AccordionButton _expanded={{ bg: record.patient_leaving_date ? 'green' : 'red', color: 'white' }}>
                                                                    <Box fontSize='lg' as="span" flex='1' textAlign='left'>
                                                                        <Text>Medical Record #{record.id}  {record.patient_leaving_date ? ' - Discharged' : ' - In Hospital'}</Text>
                                                                    </Box>
                                                                    <AccordionIcon />
                                                                </AccordionButton>
                                                            </h2>
                                                            <AccordionPanel border='4px' borderTop={0} borderColor={record.patient_leaving_date ? 'green' : 'red'} pb={4} color='gray.900'>
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
                </TabPanel>
            </TabPanels>
        </Tabs>

    );
}

export default Patient;
