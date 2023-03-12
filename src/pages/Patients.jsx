import { Text, Box, Button, HStack, Spacer } from "@chakra-ui/react";
import { Outlet, useOutlet } from "react-router-dom";
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

            <Box bg='white' w='100%' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                {outlet ? <Outlet /> : <PatientsTable />}
            </Box>
        </Box>
    );
}
export default Patients;
