import { useEffect, useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    Button,
    Grid,
    GridItem,
    Flex,
    Text,
    NumberInputField,
    NumberInput,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Box,
    HStack,
    InputGroup,
    InputLeftAddon,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { BsPersonAdd } from 'react-icons/bs';
import usePost from '../hooks/usePost';
import useLoader from '../hooks/useLoader';

const SummaryItem = ({ label, children }) => (
    <HStack>
        <Text pt='2' fontSize='lg' fontWeight="bold">{label}:</Text>
        <Text pl='10' pt='2' fontSize='lg'>{children}</Text>
    </HStack>
);

const RecordForm = ({ closeModal, closeAndRefresh, userId , patientId }) => {
    const [formData, setFormData] = useState({
        patient_id: patientId || '',
        user_id: userId,
        medical_specialty: 'Infectious Diseases',
        condition_description: '',
        state_upon_enter: '',
        standard_treatment: '',
        bed_number: '',
        patient_entry_date: new Date().toISOString().slice(0, 10),
    });
    const [Patient, setPatient] = useState(null);
    const [LoadingPatient, setLoadingPatient] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (patientId != '') {
            setLoadingPatient(true);
            useLoader('/patients/' + patientId).then((res) => {
                setLoadingPatient(false);
                if (res == undefined) {
                    setPatient(null);
                    return;
                }
                setPatient(res.patient);
            });
        }
    }, []);
            
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        usePost('/patients/' + formData.patient_id + '/medical-records', formData).then((res) => {
            setLoading(false);
            if (res.message === 'Medical record created successfully.') {
                closeAndRefresh(
                    {
                        title: 'Medical Record created successfully.',
                        status: 'success',
                        redirect: '/patients/' + formData.patient_id ,
                    }
                )
            } else {
                closeAndRefresh(
                    {
                        title: 'Error',
                        description: res.message,
                        status: 'error',
                    }
                )
            }
        });
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleNumberChange = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            bed_number: value,
        }));
    };

    const handlePatientChange = (value) => {
        setPatient(null);
        if (value != '') {
            setLoadingPatient(true);
            useLoader('/patients/' + value).then((res) => {
                setLoadingPatient(false);
                if (res == undefined) {
                    setPatient(null);
                    return;
                }
                setPatient(res.patient);
            });
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            patient_id: value,
        }));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormControl mb={3} id="patient_id" isRequired>
                <FormLabel>Patient ID</FormLabel>
                <InputGroup>
                    <InputLeftAddon children='#' />
                    <NumberInput
                        name="patient_id"
                        onChange={handlePatientChange}
                        defaultValue={formData.patient_id}
                        w='100%'
                        isDisabled={patientId != ''}
                    >
                        <NumberInputField borderLeftRadius={0} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </InputGroup>
            </FormControl>
            {Patient &&
                (<Box m={2} p={5} border='2px' borderColor='gray.300' borderRadius={10} color="blue.900">
                    <SummaryItem label="Patient Name">{Patient.first_name} {Patient.last_name}</SummaryItem>
                    <SummaryItem label="Patient Birth Date">{Patient.birth_date}</SummaryItem>
                    <SummaryItem label="Patient Place of Birth">{Patient.place_of_birth}</SummaryItem>
                    <SummaryItem label="Patient Gender">{Patient.gender}</SummaryItem>
                </Box>)
            }
            {LoadingPatient && <Text textAlign='center'>Loading Patient...</Text>}

            <FormControl mb={3} id="medical_specialty" isRequired>
                <FormLabel>Medical Especiality</FormLabel>
                <Select name="medical_specialty" onChange={handleChange} value={formData.medical_specialty} isDisabled>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Infectious Diseases">Infectious Diseases</option>
                    <option value="Nephrology">Nephrology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Rheumatology">Rheumatology</option>
                    <option value="Urology">Urology</option>
                </Select>
            </FormControl>
            <FormControl mb={3} id="patient_entry_date" isRequired>
                <FormLabel>Patient Entry Date</FormLabel>
                <Input
                    type="Date"
                    name="patient_entry_date"
                    value={formData.patient_entry_date}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl mb={3} id="bed_number" isRequired>
                <FormLabel>Bed Number</FormLabel>
                <NumberInput name="bed_number" onChange={handleNumberChange} defaultValue={formData.bed_number}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <FormControl mb={3} id="condition_description" isRequired>
                <FormLabel>Conditions Description</FormLabel>
                <Textarea
                    name="condition_description"
                    value={formData.condition_description}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl mb={3} id="state_upon_enter" isRequired>
                <FormLabel>State Upon Enter</FormLabel>
                <Input
                    type="text"
                    name="state_upon_enter"
                    value={formData.state_upon_enter}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl mb={3} id="standard_treatment" isRequired>
                <FormLabel>Standard Treatment</FormLabel>
                <Textarea
                    name="standard_treatment"
                    value={formData.standard_treatment}
                    onChange={handleChange}
                />
            </FormControl>
            {/* <FormControl mb={3} id="state_upon_exit">
                <FormLabel>State Upon Exit</FormLabel>
                <Input
                    type="text"
                    name="state_upon_exit"
                    value={formData.state_upon_exit}
                    onChange={handleChange}
                />
            </FormControl> */}
            <Flex justifyContent='center' mt='10px'>
                <Button colorScheme='blue' mr={3} onClick={closeModal}>
                    Close
                </Button>
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText="Adding" >
                    {/* add icon */}
                    <BsPersonAdd />
                    <Text ml="5px" >Add</Text>
                </Button>
            </Flex>
        </Form>)
}

export default RecordForm;