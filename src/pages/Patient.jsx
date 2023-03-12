import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, HStack, ListItem, SimpleGrid, Stack, StackDivider, Tab, TableContainer, TabList, TabPanel, TabPanels, Tabs, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NavLink, useLoaderData } from "react-router-dom";
import MedicalRecord from "../components/MedicalRecord";


const Patient = () => {
    const med = useLoaderData()

    const [tabIndex, setTabIndex] = useState(med['ok'] ? 1 : 0)
    const handleTabsChange = (index) => {
        setTabIndex(index)
    }
    useEffect(() => {
        if(med['ok']) setTabIndex(1)
        else console.log("error")
    }, [med])
    return (
        <Tabs index={tabIndex} onChange={handleTabsChange}>
            <TabList>
                <Tab>Patient</Tab>
                <Tab isDisabled={!med['ok']}>Medical Record</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <TableContainer>
                        <Box>
                            <Card>
                                <CardHeader>
                                    <Heading size='md'>Patient: Youcef Hemadou</Heading>
                                </CardHeader>

                                <CardBody>
                                    <Stack divider={<StackDivider />} spacing='4'>
                                        <Box>
                                            <Heading size='xs' textTransform='uppercase'>
                                                Summary
                                            </Heading>
                                            <HStack spacing={4} pl='3'>
                                                <Text pt='2' fontSize='sm'>
                                                    Birth date: 22-11-2000
                                                </Text>
                                                <Text pt='2' fontSize='sm'>
                                                    on Setif
                                                </Text>
                                            </HStack>
                                            <Text pt='2' pl='3' fontSize='sm'>
                                                gender: Male
                                            </Text>
                                            <HStack spacing={4} pl='3'>
                                                <Text pt='2' fontSize='sm'>
                                                    nationality: Algerian
                                                </Text>
                                                <Text pt='2' fontSize='sm'>
                                                    address: setif setif
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <Box>
                                            <Heading size='xs' color='red' textTransform='uppercase'>
                                                Emergency Contact
                                            </Heading>
                                            <HStack spacing={4} pl='3'>
                                                <Text pt='2' fontSize='sm'>
                                                    Name: beluga
                                                </Text>
                                                <Text pt='2' fontSize='sm'>
                                                    Phone: 0555555555
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <Box>
                                            <Heading size='xs' textTransform='uppercase'>
                                                Medical Records
                                            </Heading>
                                            <SimpleGrid pl='3' pt='5' spacing={4} templateColumns='repeat(auto-fill, minmax(250px, 1fr))'>
                                                <Card bg='#f8f8fb' border='2px' borderColor='gray.200' boxShadow='md'>
                                                    <CardHeader>
                                                        <Heading size='md'>Medical Record #1</Heading>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Text pt='2' fontSize='sm'>
                                                            entry day: 10-03-2023
                                                        </Text>
                                                        <Text pt='2' fontSize='sm'>
                                                            Leaving day: 15-03-2023
                                                        </Text>
                                                    </CardBody>
                                                    <CardFooter>
                                                        <NavLink to='?med=1' m='auto'>
                                                            <Button colorScheme='blue'>Open</Button>
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
                                                        <NavLink to='?med=2'>
                                                            <Button colorScheme='blue'>Open</Button>
                                                        </NavLink>
                                                    </CardFooter>
                                                </Card>

                                            </SimpleGrid>

                                        </Box>
                                    </Stack>
                                </CardBody>
                            </Card>
                        </Box>
                    </TableContainer>
                </TabPanel>
                <TabPanel>
                    <MedicalRecord />
                </TabPanel>
            </TabPanels>
        </Tabs>

    );
}

export default Patient;
export const RecordLoader = async ({ request }) => {
    if(request.url.split('?')[1] == undefined) return { 'ok': false }
    const medicalRecordId = request.url.split('?')[1].split('=')[1]
    const patientId = request.url.split('/')[4].split('?')[0]
    const res = {
        'ok': medicalRecordId == '2' ? true : false,
        'data': {
            'id': 1,
            'BedNumber': 1,
            'patientEntryDate': '2021-01-01',
            'patientLeavingDate': '2021-01-05'
        }
    }
    return res
}