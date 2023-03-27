import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    Grid,
    GridItem,
    Flex,
    Text,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Box,
    InputRightAddon,
    InputGroup,
    Divider,
    Center,
    Table,
    Tr,
    Thead,
    Th,
    Tbody,
    Td,
    IconButton,
    Heading,
    Select,
    Progress
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import usePost from '../hooks/usePost';
import AsyncSelect from 'react-select/async';

import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { CloseIcon } from '@chakra-ui/icons';
import useLoader from '../hooks/useLoader';
import { BiPencil } from 'react-icons/bi';
import { useEffect } from 'react';
import usePut from '../hooks/usePut';

const MonitoringSheetRow = ({ user, medical_record, data, closeModal, closeAndRefresh, loadingData }) => {
    const [examinations, setExaminations] = useState([
        { name: 'urine', label: 'Urine', suffix: 'ml' },
        { name: 'blood_pressure', label: 'Blood Pressure', suffix: 'mmHg' },
        { name: 'temperature', label: 'Temperature', suffix: '°C' },
        { name: 'weight', label: 'Weight', suffix: 'kg' },
    ]);
    const [formData, setFormData] = useState({
        medicines: [],
        urine: 0,
        blood_pressure: 0,
        temperature: 0,
        weight: 0,
    });


    const [options, setOptions] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (data) {
            setFormData((prev) => ({
                ...prev,
                medicines: data.treatments,
                urine: (data?.urine || 0),
                blood_pressure: (data?.blood_pressure || 0),
                temperature: (data?.temperature || 0),
                weight: (data?.weight || 0),
            }));
        }
    }, [data]);
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            // GET DATS OF NEXT TIMEFIELD DAYS
            const { medicines, ...rest } = formData;
            // make rest string
            Object.keys(rest).forEach((key) => {
                rest[key] = rest[key].toString();
            });

            usePut('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + data.id, rest).then((res) => {
                setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Monitoring Sheet Row Updated',
                        status: 'success',
                    }
                )
            }).catch((err) => {
                setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Error',
                        description: err.message,
                        status: 'error',
                    }
                )
            })
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Center mb={3}>
                {/* <Input
                    type='text'
                    defaultValue={data ? data.filling_date : ''}
                    w='auto'
                    textAlign={'center'}
                    m='auto'
                /> */}
                <Text
                    p={3}
                    border='1px solid'
                    borderColor='gray.300'
                    borderRadius='md'
                    fontSize='md'
                    fontWeight='bold'
                    textAlign='center'
                    w='auto'

                >
                    {data ? data.filling_date : '-'}
                </Text>
            </Center>

            {examinations.map((examination, index) => (
                <FormControl key={index} mb={3} id='type' gap={3} display='flex' justifyContent='space-between'>
                    <FormLabel m={0} alignItems='center' display='flex'>
                        <Text verticalAlign='middle' fontSize='xl'>
                            {examination.label}
                            {' (' + examination.suffix})
                        </Text>
                    </FormLabel>
                    {/* <InputGroup> */}
                    <NumberInput
                        value={formData[examination.name]}
                        onChange={(value) => setFormData((prevFormData) => ({
                            ...prevFormData,
                            [examination.name]: parseInt(value) || 0,
                        }))}
                        isDisabled={loadingData || user.role != 'nurse' || (data && data.filled_by_id && user.id != data.filled_by_id)}
                    >
                        <NumberInputField borderRightRadius={0} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    {/* <InputRightAddon children='Days' /> */}
                    {/* </InputGroup> */}
                </FormControl>
            ))}
            <Divider my={3} />
            <Box>
                {data && data.treatments && data.treatments.length > 0 && (
                    <Box>
                        <Heading size='md' mb={3}>Treatments</Heading>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Dose</Th>
                                    <Th>Type</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {formData.medicines.map((medicine, index) => (
                                    <Tr key={index}>
                                        <Td>{medicine.name}</Td>
                                        <Td>{medicine.dose}</Td>
                                        <Td>{medicine.type}</Td>
                                        <Td>
                                            <Button
                                                size='sm'
                                                colorScheme='red'
                                                onClick={() => {
                                                    setFormData((prevFormData) => ({
                                                        ...prevFormData,
                                                        medicines: prevFormData.medicines.filter((m) => m.id !== medicine.id),
                                                    }));
                                                }}
                                                isDisabled={loadingData || user.role != 'nurse' || (data && data.filled_by_id && user.id != data.filled_by_id)}
                                            >
                                                <AiOutlineDelete />
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}
            </Box>

            {loading && (
                <Box
                    position='relative'
                >
                    <Progress mt={3} hasStripe value={uploadProgress} h='25px' bg='blue.100 ' />
                    <Text
                        textAlign='center'
                        color={uploadProgress > 49 ? 'gray.50' : 'blue.700'}
                        textShadow='0 0 1px #000'
                        position='absolute'
                        top='0'
                        left='0'
                        right='0'
                        bottom='0'
                    >
                        {Math.round(uploadProgress)}%
                    </Text>
                </Box>
            )}
            <Flex justifyContent='center' mt='10px'>
                <Button colorScheme='blue' mr={3} onClick={closeModal}>
                    Close
                </Button>
                {data && data['filled_by_id'] ? (
                    <Button
                        variant='solid'
                        colorScheme='green'
                        type="submit"
                        isLoading={loading}
                        loadingText="Adding"
                        isDisabled={loadingData || user.role != 'nurse' || (data && data.filled_by_id && user.id != data.filled_by_id)}
                    >
                        {/* add icon */}
                        <BiPencil />
                        <Text ml="5px" >edit</Text>
                    </Button>) : (

                    <Button
                        variant='solid'
                        colorScheme='green'
                        type="submit"
                        isLoading={loading}
                        loadingText="Adding"
                        isDisabled={loadingData || user.role != 'nurse' || (data && data.filled_by_id && user.id != data.filled_by_id)}
                    >
                        {/* add icon */}
                        <AiOutlinePlus />
                        <Text ml="5px" >Apply</Text>
                    </Button>
                )}
            </Flex>
        </Form>)
}

export default MonitoringSheetRow;