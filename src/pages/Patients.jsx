import { Text, Tabs, TabList, TabPanels, TabPanel, TableContainer, Box, Button, HStack, Spacer, Tab } from "@chakra-ui/react";
import { NavLink, Outlet, useOutlet } from "react-router-dom";
import MedicalRecord from "../components/MedicalRecord";
import PatientsTable from "../components/PatientsTable";

const Patients = () => {
    const outlet = useOutlet()
    return (
        <Box>
            <HStack>
                <Text fontSize='3xl' color='#2e3149' ml='20px'>Patients {outlet ? "/ Someone" : ""}</Text>
                <Spacer />
                <Button colorScheme='blue' variant='outline' fontWeight='normal'>CREATE NEW RECORD</Button>
            </HStack>

            <Box bg='white' w='100%' m='10px' p='20px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                <Tabs>
                    <TabList>
                        <Tab>{outlet ? "Patient" : "Patients"}</Tab>
                        <Tab isDisabled={true}>Medical Record</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <TableContainer>
                                {outlet ? <Outlet /> : <PatientsTable />}
                            </TableContainer>
                        </TabPanel>
                        <TabPanel>
                            <MedicalRecord />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    );
}

export default Patients;