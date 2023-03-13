import { Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Grid, GridItem, Heading, HStack, ListItem, SimpleGrid, Spinner, Stack, StackDivider, Tab, TableContainer, TabList, TabPanel, TabPanels, Tabs, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NavLink, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import MedicalRecord from "../components/MedicalRecord";
import axios from '../components/axios'

const PatientLoader = async (id) => {
    const abortCont = new AbortController();
    const { data } = await axios.get('/patients/' + id, { signal: abortCont.signal })
        .then(res => {
            if (res.data.error == undefined) {
                return res.data
            }
            return []
        })
        .catch(err => () => abortCont.abort())
    return data
}
const RecordLoader = async (patient_id, record_id) => {
    const abortCont = new AbortController();
    const { data } = await axios.get("/patients/" + patient_id + "/medical-records/" + record_id, { signal: abortCont.signal })
        .then(res => res.data)
        .catch(err => () => abortCont.abort())
    return data
}
const SummaryItem = ({ label, children }) => (
    <Box>
        <Text pt='2' fontSize='sm' fontWeight="bold">{label}:</Text>
        <Text pt='2' fontSize='sm'>{children}</Text>
    </Box>
);

const Patient = () => {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const [patient, setpatient] = useState(null)
    const setPatientInfo = useOutletContext()
    const [NotFound, setNotFound] = useState(false)

    const [med, setMed] = useState({ 'ok': false })


    useEffect(() => {
        if (searchParams.get('med')) {
            RecordLoader(id, searchParams.get('med')).then(res => setMed(res))
        }
        PatientLoader(id).then(res => {
            // if res is undefined then abort
            if (!res){
                setPatientInfo({first_name: "Patient", last_name: "Not Found"})
                setNotFound(true)
                return null
            }
            setpatient(res.patient)
            setPatientInfo(res.patient)
        })
    }, [])

    const [tabIndex, setTabIndex] = useState(0)
    const handleTabsChange = (index) => {
        setTabIndex(index)
    }
    const handleMedChange = (med) => {
        RecordLoader(id, med).then(res => setMed(res))
    }
    // useEffect(() => {
    //     if (med['ok']) setTabIndex(1)
    //     else console.log("error")
    // }, [med])
    if(NotFound) return <Center><Heading>Patient Not Found</Heading></Center>
    return (
        <Tabs index={tabIndex} onChange={handleTabsChange}>
            <TabList>
                <Tab>Patient</Tab>
                <Tab isDisabled>Medical Record</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <TableContainer>
                        {patient && <Box>
                            <Card>
                                <CardHeader>
                                    <Heading size='md'>Patient: {patient.first_name + " " + patient.last_name}</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Grid templateColumns={{ base: '1fr 1fr 1fr', lg: 'repeat(2, 1fr)' }} gap={4}>
                                        <GridItem>
                                            <Stack spacing={4} divider={<StackDivider borderColor='gray.200' />}>
                                                <Box>
                                                    <Stack spacing={4} divider={<StackDivider borderColor='gray.200' />}>
                                                        <Box>
                                                            <Heading size='xs' textTransform='uppercase'>
                                                                Summary
                                                            </Heading>
                                                            <VStack spacing={2} align="start" pl='3'>
                                                                <SummaryItem label="Birth date">{patient.birth_date}</SummaryItem>
                                                                <SummaryItem label="Place of birth">{patient.place_of_birth}</SummaryItem>
                                                                <SummaryItem label="Gender">{patient.gender}</SummaryItem>
                                                                <SummaryItem label="Nationality">{patient.nationality}</SummaryItem>
                                                                <SummaryItem label="Address">{patient.address}</SummaryItem>
                                                            </VStack>
                                                        </Box>
                                                        <Box>
                                                            <Heading size='xs' color='red' textTransform='uppercase'>
                                                                Emergency Contact
                                                            </Heading>
                                                            <VStack spacing={2} align="start" pl='3'>
                                                                <SummaryItem label="Name">{patient.emergency_contact_name}</SummaryItem>
                                                                <SummaryItem label="Phone">{patient.emergency_contact_number}</SummaryItem>
                                                            </VStack>
                                                        </Box>
                                                    </Stack>
                                                </Box>

                                            </Stack>
                                        </GridItem>
                                        <GridItem>
                                            <Box>
                                                <Heading size='xs' textTransform='uppercase'>
                                                    Medical Records
                                                </Heading>
                                                <SimpleGrid pl='3' pt='5' spacing={4} templateColumns='repeat(auto-fill, minmax(250px, 1fr))'>
                                                    <Card bg='#f8f8fb' border='2px' borderColor='gray.200' boxShadow='md'>
                                                        <CardHeader>
                                                            <Heading size='md'>
                                                                Medical Record #1
                                                            </Heading>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <Text pt='2' fontSize='sm'>
                                                                Entry day: 10-03-2023
                                                            </Text>
                                                            <Text pt='2' fontSize='sm'>
                                                                Leaving day: 15-03-2023
                                                            </Text>
                                                        </CardBody>
                                                        <CardFooter>
                                                            <NavLink to='?med=1' m='auto'>
                                                                <Button colorScheme='blue'>
                                                                    Open
                                                                </Button>
                                                            </NavLink>
                                                        </CardFooter>
                                                    </Card>

                                                    <Card bg='#f8f8fb' border='2px' borderColor='gray.200' boxShadow='md'>
                                                        <CardHeader>
                                                            <Heading size='md'>Medical Record #2</Heading>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <Text pt='2' fontSize='sm'>
                                                                entry day: 10-03-2023
                                                            </Text>
                                                            <Text pt='2' fontSize='sm'>
                                                                Leaving day: still in hospital
                                                            </Text>
                                                        </CardBody>
                                                        <CardFooter>
                                                            <NavLink to='?med=2' onClick={() => handleMedChange(2)}>
                                                                <Button colorScheme='blue'>Open</Button>
                                                            </NavLink>
                                                        </CardFooter>
                                                    </Card>

                                                </SimpleGrid>

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
                    <MedicalRecord />
                </TabPanel>
            </TabPanels>
        </Tabs>

    );
}

export default Patient;
