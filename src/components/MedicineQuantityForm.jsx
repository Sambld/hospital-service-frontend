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
    useColorModeValue
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import AsyncSelect from 'react-select/async';

import { AiOutlinePlus } from 'react-icons/ai';
import { CloseIcon } from '@chakra-ui/icons';

import useLoader from '../hooks/useLoader';
import usePut from '../hooks/usePut';

const MedicineQuantityForm = ({ closeModal, closeAndRefresh }) => {
    const [formData, setFormData] = useState({
        medicines: [],
    });

    const [options, setOptions] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [Quantity, setQuantity] = useState(1);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const formatDate = (date) => {
        let date_ = new Date(date);
        const year = date_.getUTCFullYear();
        const month = (date_.getUTCMonth() + 1).toString().padStart(2, '0'); // pad month with leading zero if less than 10
        const day = date_.getUTCDate().toString().padStart(2, '0'); // pad day with leading zero if less than 10
        const hours = date_.getUTCHours().toString().padStart(2, '0'); // pad hours with leading zero if less than 10
        const minutes = date_.getUTCMinutes().toString().padStart(2, '0'); // pad minutes with leading zero if less than 10
        const seconds = date_.getUTCSeconds().toString().padStart(2, '0'); // pad seconds with leading zero if less than 10
        return `${year}/${month}/${day}`;
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            MedicinesAdd().then(() => {
                setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Medicines Added Quantity Successfully',
                        status: 'success',
                    }
                )
            })
        } catch (err) {
            console.log(err)
        }
    };

    const MedicinesAdd = async () => {
        try {
            const progressUnit = 100 / formData.medicines.length;
            const promises = [];
            console.log(progressUnit)
            formData.medicines.map((medicine) => {
                let quantity = parseInt(medicine.quantity) + parseInt(medicine.old_quantity);
                const promise = usePut(`/medicines/${medicine.value}`, {
                    medicine_id: medicine.value,
                    quantity: quantity,
                }).then(async (res) => {
                        setUploadProgress((prevUploadProgress) => prevUploadProgress + progressUnit);
                }).catch((err) => {
                    closeAndRefresh(
                        {
                            title: err.message,
                            status: 'error',
                        }
                    )
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
        if (!selectedMedicine || !Quantity) return;
        event.preventDefault();

        const medicine = {
            ...selectedMedicine,
            quantity: Quantity,
        };
        setFormData((prevFormData) => ({
            ...prevFormData,
            medicines: [...prevFormData.medicines.filter((medicine) => medicine.value !== selectedMedicine.value), medicine]
        }));
        setSelectedMedicine(null);
        setQuantity(1);
    };

    const removeMedicine = (med) => {
        event.preventDefault();
        setFormData((prevFormData) => ({
            ...prevFormData,
            medicines: prevFormData.medicines.filter((medicine) => medicine.value !== med.value),
        }));
    };

    const loadOptions = (inputValue, callback) => {
        if (options.length > 0) {
            callback(
                options.filter((i) =>
                    i.label.toLowerCase().includes(inputValue.toLowerCase())
                )
            )
        } else {
            useLoader(`/medicines?q=${inputValue}&np`).then((res) => {
                const options = res.data.map((medicine) => ({
                    value: medicine.id,
                    label: medicine.name,
                    old_quantity: medicine.quantity,
                }));
                setOptions(options);
                callback(options);
            })
        }

    };


    return (
        <Form onSubmit={handleSubmit}>
            <Divider mt='10px' mb='10px' />
            {/* choose medicines */}
            <Box>
                <Text textAlign='center' fontSize={25}>Medicines List</Text>
                <Box border='2px' borderColor='gray.300' boxShadow='md' p={1} mb={3} maxH='30vh' overflow='auto'>
                    <Table variant="unstyled" size="sm" >
                        <Tbody>
                            {formData.medicines.length === 0 && <Tr><Td textAlign='center'>No medicines added yet</Td></Tr>}
                            {formData.medicines.map((medicine) => (
                                <Tr bg='gray.50' key={medicine.value} color='gray.700'>
                                    <Td fontSize={13}>Name: {medicine.label}</Td>
                                    <Td fontSize={13}>Quantity: {medicine.quantity}</Td>
                                    <Td fontSize={13}>Old Quantity: {medicine.old_quantity}</Td>
                                    <Td display='flex' p={2} justifyContent='flex-end'>
                                        <IconButton
                                            aria-label="Remove"
                                            icon={<CloseIcon />}
                                            color="gray.500"
                                            colorScheme='gray'
                                            borderRadius={5}
                                            variant="ghost"
                                            onClick={() => removeMedicine(medicine)}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Divider mt='10px' mb='10px' />
                <FormControl id='type' gap={3}>
                    <Box display='flex' flexDir='column' gap={3}>
                        <AsyncSelect
                            placeholder="Select Medicines"
                            name='medicineSearch'
                            styles={{
                                control: (provided, state) => ({
                                    ...provided,
                                    background: useColorModeValue('white', 'white'),
                                    color: useColorModeValue('white', 'green'),
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    color: useColorModeValue('black', 'white'),
                                    background: useColorModeValue('white', '#2d3748'),
                                }),
                            }}
                            loadOptions={loadOptions}
                            value={selectedMedicine}
                            onChange={(value) => setSelectedMedicine(value)}
                            defaultOptions
                        />

                    </Box>
                    <Box mt={3} display='flex' justifyContent='space-between' alignItems='center' gap={3}>
                        <NumberInput
                            min={1}
                            name='quantity'
                            value={Quantity}
                            onChange={(value) => setQuantity(value)}
                            flexGrow={1}
                        >
                            <NumberInputField borderRightRadius={0} />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <IconButton
                            aria-label="Add"
                            icon={<AiOutlinePlus />}
                            colorScheme="gray"
                            borderRadius={5}
                            variant="outline"
                            onClick={() => addMedicine()}
                        />
                    </Box>
                    {selectedMedicine && (
                        <Box
                            mt={3}
                            border='2px'
                            borderColor='gray.300'
                            borderRadius={5}
                            boxShadow='md'
                            bg='gray.50'
                            p={2}
                        >
                            <Text color={useColorModeValue('gray.700', 'gray.700')} fontSize={13}>Old Quantity: {selectedMedicine ? selectedMedicine.old_quantity : 0}</Text>
                            <Text color={useColorModeValue('gray.700', 'gray.700')} fontSize={13}>New Quantity: {selectedMedicine ? selectedMedicine.old_quantity + parseInt(Quantity) : 0}</Text>
                        </Box>
                    )}

                </FormControl>
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
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText="Adding" >
                    {/* add icon */}
                    <AiOutlinePlus />
                    <Text ml="5px" >Add</Text>
                </Button>
            </Flex>
        </Form>)
}

export default MedicineQuantityForm;