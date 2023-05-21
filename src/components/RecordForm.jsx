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
    Divider,
    Heading,
    useColorModeValue,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { BsPersonAdd } from 'react-icons/bs';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import usePost from '../hooks/usePost';
import usePut from '../hooks/usePut';
import useLoader from '../hooks/useLoader';

import { useTranslation } from 'react-i18next';

const SummaryItem = ({ label, children }) => (
    <HStack color={useColorModeValue('gray.600', 'gray.400')} >
        <Text w='230px' pt='2' fontSize='lg' fontWeight="bold">{label}:</Text>
        <Text pl='10' pt='2' fontSize='lg'>{children}</Text>
    </HStack>
);

const RecordForm = ({ closeModal, closeAndRefresh, userId, patientId, editMode, initialData }) => {
    const [formData, setFormData] = useState({
        patient_id: patientId || '',
        user_id: userId,
        medical_specialty: 'Infectious Diseases',
        condition_description: initialData?.condition_description || '',
        state_upon_enter: initialData?.state_upon_enter || '',
        standard_treatment: initialData?.standard_treatment || '',
        bed_number: initialData?.bed_number || '',
        state_upon_exit: initialData?.state_upon_exit || '',
        patient_entry_date: initialData?.patient_entry_date || '',
        patient_leaving_date: initialData?.patient_leaving_date || '',
    });
    const [Patient, setPatient] = useState(null);
    const [LoadingPatient, setLoadingPatient] = useState(false);
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (patientId != null) {
            setLoadingPatient(true);
            useLoader('/patients/' + patientId).then((res) => {
                setLoadingPatient(false);
                if (res?.data == undefined) {
                    setPatient(null);
                    return;
                }
                setPatient(res.data.patient);
            });
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (editMode) {
            handleEdit();
        }
        else {
            handleAdd();
        }

    };

    const handleAdd = (event) => {
        usePost('/patients/' + formData.patient_id + '/medical-records', formData).then((res) => {
            setLoading(false);
            if (res.message === 'Medical record created successfully.') {
                closeAndRefresh(
                    {
                        title: 'Medical Record created successfully.',
                        status: 'success',
                        redirect: '/patients/' + formData.patient_id + '?med=' + res.data.id,
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
    const handleEdit = (event) => {
        usePut('/patients/' + formData.patient_id + '/medical-records/' + initialData.id, formData).then((res) => {
            setLoading(false);
            if (res.message === 'Medical record updated successfully.') {
                closeAndRefresh(
                    {
                        title: 'Medical Record updated successfully.',
                        status: 'success',
                        redirect: '/patients/' + formData.patient_id + '?med=' + initialData.id
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
                setPatient(res.data.patient);
            }).catch((err) => {
                setLoadingPatient(false);
                setPatient(null);
            });
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            patient_id: value,
        }));
    };

    return (
        <Form onSubmit={handleSubmit} color={useColorModeValue('gray.700', 'whiteAlpha.900')}>
            <FormControl mb={3} id="patient_id" isRequired>
                <FormLabel>
                    {t('patient.patientID')}
                </FormLabel>
                <InputGroup>
                    <InputLeftAddon children='#' />
                    <NumberInput
                        name="patient_id"
                        onChange={handlePatientChange}
                        defaultValue={formData.patient_id}
                        w='100%'
                        isDisabled={patientId != null}
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
                (<Box p={5} border='2px' borderColor='gray.300' borderRadius={10} color="blue.900">
                    <SummaryItem label="Patient Name">{Patient.first_name} {Patient.last_name}</SummaryItem>
                    <SummaryItem label="Patient Birth Date">{Patient.birth_date}</SummaryItem>
                    <SummaryItem label="Patient Place of Birth">{Patient.place_of_birth}</SummaryItem>
                    <SummaryItem label="Patient Gender">{Patient.gender}</SummaryItem>
                </Box>)
            }
            {LoadingPatient && <Text textAlign='center'>Loading Patient...</Text>}
            {!LoadingPatient && !Patient && formData.patient_id != '' && <Text textAlign='center'>Patient not found</Text>}

            <Box mt={3} p={5} border='2px' borderColor='gray.300' borderRadius={10} color={useColorModeValue('blue.700', 'whiteAlpha.900')}>
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    textAlign="center"
                    mb={5}
                    color={useColorModeValue('blue.900', 'whiteAlpha.900')}
                >
                    {t('medicalRecord.basicInformation')}
                </Text>
                <FormControl mb={3} id="medical_specialty" isRequired>
                    <FormLabel>
                        {t('medicalRecord.medicalEspeciality')}
                    </FormLabel>
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
                    <FormLabel>
                        {t('medicalRecord.patientEntryDate')}
                    </FormLabel>
                    <Input
                        type="Date"
                        name="patient_entry_date"
                        value={formData.patient_entry_date}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl mb={3} id="bed_number" isRequired>
                    <FormLabel>
                        {t('medicalRecord.bedNumber')}
                    </FormLabel>
                    <NumberInput name="bed_number" onChange={handleNumberChange} defaultValue={formData.bed_number}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>
                <FormControl mb={3} id="condition_description" isRequired>
                    <FormLabel>
                        {t('medicalRecord.conditionDescription')}
                    </FormLabel>
                    <Textarea
                        name="condition_description"
                        value={formData.condition_description}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl mb={3} id="state_upon_enter" isRequired>
                    <FormLabel>
                        {t('medicalRecord.stateUponEnter')}
                    </FormLabel>
                    <Input
                        type="text"
                        name="state_upon_enter"
                        value={formData.state_upon_enter}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl mb={3} id="standard_treatment" isRequired>
                    <FormLabel>
                        {t('medicalRecord.standardTreatment')}
                    </FormLabel>
                    <Textarea
                        name="standard_treatment"
                        value={formData.standard_treatment}
                        onChange={handleChange}
                    />
                </FormControl>
            </Box>

            {editMode && (
                <Box mt={3} p={5} border='2px' borderColor='gray.300' borderRadius={10} >
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        textAlign="center"
                        mb={5}
                        color={useColorModeValue('blue.900', 'whiteAlpha.900')}
                    >
                        {t('medicalRecord.leavingInformation')}
                    </Text>
                    <FormControl mb={3} id="patient_leaving_date">
                        <FormLabel>
                            {t('medicalRecord.patientLeavingDate')}
                        </FormLabel>
                        <Input
                            type="Date"
                            name="patient_leaving_date"
                            value={formData.patient_leaving_date}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="state_upon_exit">
                        <FormLabel>
                            {t('medicalRecord.stateUponExit')}
                        </FormLabel>
                        <Input
                            type="text"
                            name="state_upon_exit"
                            value={formData.state_upon_exit}
                            onChange={handleChange}
                        />
                    </FormControl>
                </Box>
            )}
            <Flex justifyContent='center' mt='10px' gap={2}>
                <Button colorScheme='blue' mr={3} onClick={closeModal}>
                    {t('global.cancel')}
                </Button>
                {editMode ? (
                    <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText="Updating" >
                        {/* add icon */}
                        <AiOutlineEdit />
                        <Text mx="5px" >
                            {t('global.edit')}
                        </Text>
                    </Button>
                ) : (
                    <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText="Adding" >
                        {/* add icon */}
                        <AiOutlinePlus />
                        <Text mx="5px" >
                            {t('global.add')}
                        </Text>
                    </Button>
                )}
            </Flex>
        </Form>)
}

export default RecordForm;