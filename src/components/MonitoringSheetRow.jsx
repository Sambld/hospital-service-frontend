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
    Progress,
    useToast
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import usePost from '../hooks/usePost';
import AsyncSelect from 'react-select/async';

import { AiOutlineDelete, AiOutlinePlus, AiOutlineUndo } from 'react-icons/ai';
import { CloseIcon } from '@chakra-ui/icons';
import useLoader from '../hooks/useLoader';
import { BiPencil } from 'react-icons/bi';
import { useEffect } from 'react';
import usePut from '../hooks/usePut';
import useDelete from '../hooks/useDelete';

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

    const [addedTreatments, setAddedTreatments] = useState([]);
    const [deletedTreatments, setDeletedTreatments] = useState([]);

    const [options, setOptions] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [Dose, setDose] = useState('');
    const [type, setType] = useState('SC');

    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

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
        if (user.role === 'doctor') {
            handleEdit();
        } else {
            handleAdd();
        }
    };

    const handleAdd = () => {
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

    const handleEdit = async () => {
        const progressUnit = 100 / deletedTreatments.length;
        try {
            setLoading(true);
            console.log("hihihi")
            if (addedTreatments.length > 0) {
                await MonitoringSheetMedAdd(progressUnit * addedTreatments.length);
            }
            if (deletedTreatments.length > 0) {
                await handleDeleteAllTreatments(progressUnit * deletedTreatments.length);
            }
            setLoading(false);
            closeAndRefresh(
                {
                    title: 'Monitoring Sheet Row Updated',
                    status: 'success',
                }
            )
        } catch (err) {
            closeAndRefresh(
                {
                    title: 'Error',
                    description: err.message,
                    status: 'error',
                }
            )
        }

    }

    const handleDeleteAllTreatments = async (pu) => {
        try {
            const promises = [];
            deletedTreatments.map((treatment) => {
                const promise = useDelete('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + data.id + '/treatments/' + treatment.id)
                    .then((res) => {
                        setUploadProgress((prev) => prev + pu);

                    })
                promises.push(promise);
            })
            await Promise.all(promises);
            return true
        } catch (err) {
            toast({
                title: 'Error',
                description: err.message,
                status: 'error',
            });
        }
    }

    const MonitoringSheetMedAdd = async (pu) => {
        try {
            const promises = [];
            addedTreatments.map((medicine) => {
                const promise = usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + data.id + '/treatments', {
                    medicine_id: medicine.value,
                    name: medicine.label,
                    dose: medicine.dose,
                    type: medicine.type
                }).then((res) => {
                    setUploadProgress((prev) => prev + pu);
                })
                promises.push(promise);
            })
            await Promise.all(promises);
            return true
        } catch (err) {
            console.log(err)
        }
    }

    const addMedicine = () => {
        if (!selectedMedicine || !Dose || type === '') return;
        event.preventDefault();

        const medicine = {
            ...selectedMedicine,
            dose: Dose,
            type: type,
        };
        setAddedTreatments((prevFormData) =>
            [...prevFormData, medicine]
        );
        setSelectedMedicine(null);
        setDose('');
        setType('SC');
    };

    const loadOptions = (inputValue, callback) => {
        if (options.length > 0) {
            callback(
                options.filter((i) =>
                    i.label.toLowerCase().includes(inputValue.toLowerCase())
                )
            )
        } else {
            // setMedicinesSearch(
            //     setTimeout(() => 
            useLoader(`/medicines?q=${inputValue}&np`).then((res) => {
                const options = res.data.map((medicine) => ({
                    value: medicine.id,
                    label: medicine.name,
                    old_quantity: medicine.quantity,
                }));
                setOptions(options);
                callback(options);
            })
            //     }, 500)
            // );
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

            {user && user?.role == 'nurse' && examinations.map((examination, index) => (
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
                        <Box
                            maxH='500px'
                            overflowY='auto'
                            border='1px solid'
                            borderColor='gray.300'
                        >
                            <Table
                                variant='simple'
                                colorScheme='gray'
                            >
                                <Thead
                                    borderTop='1px solid'
                                    bg='#fafafa'
                                    color='white'
                                    position="sticky"
                                    top={0}
                                    zIndex={1}
                                    boxShadow='md'
                                >
                                    <Tr>
                                        <Th w='300px'>Name</Th>
                                        <Th>Dose</Th>
                                        <Th>Type</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    { formData.medicines.length == 0 && (
                                        <Tr>
                                            <Td colSpan={4} textAlign='center'>No data</Td>
                                        </Tr>
                                    )}
                                    {formData.medicines.map((medicine, index) => (
                                        <Tr key={index}>
                                            <Td>{medicine.name}</Td>
                                            <Td>{medicine.dose}</Td>
                                            <Td>{medicine.type}</Td>
                                            <Td>
                                                {user && user?.role == 'doctor' && (
                                                    <Button
                                                        size='sm'
                                                        colorScheme='red'
                                                        variant='outline'
                                                        onClick={() => {
                                                            setDeletedTreatments((prev) => [...prev, medicine])
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                medicines: prev.medicines.filter((med) => med.id != medicine.id)
                                                            }))
                                                        }}
                                                    >
                                                        <AiOutlineDelete />
                                                    </Button>
                                                )}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </Box>
                )}
            </Box>
            {/* <Divider my={3} /> */}
            {user && user?.role == 'doctor' && addedTreatments.length > 0 && (
                <>
                    <Divider my={3} />
                    <Box mt={3}>
                        <Heading size='md' mb={3}>Added Treatments</Heading>
                        <Box maxH='300px' overflowY='auto' display='flex' flexDirection='column' border='1px solid' borderColor='gray.300' borderRadius='md' p={3} gap={5}>
                            {addedTreatments.length > 0 && addedTreatments.map((treatment, index) => (
                                <Box key={index} display='flex' justifyContent='space-between'>
                                    <Text w='200px'>{treatment.label}</Text>
                                    <Text>{treatment.dose}</Text>
                                    <Text>{treatment.type}</Text>
                                    <Button
                                        size='sm'
                                        colorScheme='green'
                                        variant='outline'
                                        onClick={() => {
                                            setAddedTreatments((prev) => prev.filter((med) => med.id != treatment.id))
                                        }}
                                    >
                                        <AiOutlineDelete />
                                    </Button>

                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}

            {user && user?.role == 'doctor' && deletedTreatments.length > 0 && (
                <>
                    <Divider my={3} />
                    <Box mt={3}>
                        <Heading size='md' mb={3}>Deleted Treatments</Heading>
                        <Box maxH='300px' overflowY='auto' display='flex' flexDirection='column' border='1px solid' borderColor='gray.300' borderRadius='md' p={3} gap={5}>
                            {deletedTreatments.length > 0 && deletedTreatments.map((treatment, index) => (
                                <Box key={index} display='flex' justifyContent='space-between'>
                                    <Text w='200px'>{treatment.name}</Text>
                                    <Text>{treatment.dose}</Text>
                                    <Text>{treatment.type}</Text>
                                    <Button
                                        size='sm'
                                        colorScheme='green'
                                        variant='outline'
                                        onClick={() => {
                                            setDeletedTreatments((prev) => prev.filter((med) => med.id != treatment.id))
                                            setFormData((prev) => ({
                                                ...prev,
                                                medicines: [...prev.medicines, treatment]
                                            }))
                                        }}
                                    >
                                        <AiOutlineUndo />
                                    </Button>

                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>

            )}

            {user && user?.role == 'doctor' && (
                <>
                    <Divider my={3} />
                    <Box mt={3} border='1px solid' borderColor='gray.300' borderRadius='md' p={3}>
                        <Box display='flex' flexDir='column' gap={3}>
                            <AsyncSelect
                                placeholder="Select Medicines"
                                name='medicineSearch'
                                loadOptions={loadOptions}
                                value={selectedMedicine}
                                onChange={(value) => setSelectedMedicine(value)}
                                defaultOptions
                            />
                            <Input
                                type="text"
                                name="Dose"
                                value={Dose}
                                onChange={(e) => setDose(e.target.value)}
                                placeholder="Dose"
                            />
                        </Box>
                        <Box mt={3} display='flex' gap={3}>
                            <Select
                                name='type'
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="SC">under the skin ( SC )</option>
                                <option value="IM">in the muscle ( IM )</option>
                                <option value="IV">in the vein ( IV )</option>
                                <option value="PO">by mouth ( PO )</option>
                            </Select>
                            <IconButton
                                aria-label="Add"
                                icon={<AiOutlinePlus />}
                                colorScheme="gray"
                                borderRadius={5}
                                variant="outline"
                                onClick={() => addMedicine()}
                            />
                        </Box>
                    </Box>
                </>
            )}
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
                {user && user?.role == 'doctor' && (
                    <Button
                        variant='solid'
                        colorScheme='green'
                        isLoading={loading}
                        loadingText="Editing"
                        onClick={(e) => handleSubmit(e)}
                    >
                        {/* add icon */}
                        <BiPencil />
                        <Text ml="5px" >Edit</Text>
                    </Button>
                )}
                {user && user?.role == 'nurse' ? data && data['filled_by_id'] ? (
                    <Button
                        variant='solid'
                        colorScheme='green'
                        type="submit"
                        isLoading={loading}
                        loadingText="Editing"
                        isDisabled={loadingData || user.role != 'nurse' || (data && data.filled_by_id && user.id != data.filled_by_id)}
                    >
                        {/* add icon */}
                        <BiPencil />
                        <Text ml="5px" >Edit</Text>
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
                ) : null}
            </Flex>
        </Form>)
}

export default MonitoringSheetRow;