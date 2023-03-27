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

import { AiOutlinePlus } from 'react-icons/ai';
import { CloseIcon } from '@chakra-ui/icons';
import useLoader from '../hooks/useLoader';

const MonitoringSheetForm = ({ medical_record, closeModal, closeAndRefresh }) => {
    const [formData, setFormData] = useState({
        TimeField: 7,
        medicines: [],
    });

    const [options, setOptions] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [Dose, setDose] = useState('');
    const [type, setType] = useState('SC');

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
            // GET DATS OF NEXT TIMEFIELD DAYS
            const today = new Date();

            let AllDates = [];
            for (let i = 0; i < formData.TimeField; i++) {
                let date = new Date(today);
                date.setDate(date.getDate() + i);

                AllDates.push(formatDate(date));
            }
            // console.log(AllDates)
            MonitoringSheetadd(AllDates).then(() => {
                setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Monitoring Sheet created successfully.',
                        status: 'success',
                    }
                )
            })
        } catch (err) {
            console.log(err)
        }
    };

    const MonitoringSheetadd = async (AllDates) => {
        try {
            const progressUnit = 100 / AllDates.length;
            const promises = [];
            AllDates.map((date) => {
                const promise = usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets', {
                    filling_date: date
                }).then(async (res) => {

                    if (res.data) {
                        await MonitoringSheetMedAdd(res.data.id,progressUnit)
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
                promises.push(promise);
            })
            await Promise.all(promises);
            return true
        } catch (err) {
            console.log(err)
        }
    }

    const MonitoringSheetMedAdd = async (id,pu) => {
        try {
            const progressUnit = pu / formData.medicines.length;
            const promises = [];
            formData.medicines.map((medicine) => {
                const promise = usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + id + '/treatments', {
                    medicine_id: medicine.value,
                    name: medicine.label,
                    dose: medicine.dose,
                    type: medicine.type
                }).then(()=>{
                    setUploadProgress((prevProgress) => prevProgress + progressUnit);
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
        setFormData((prevFormData) => ({
            ...prevFormData,
            medicines: [...prevFormData.medicines.filter((medicine) => medicine.value !== selectedMedicine.value), medicine]
        }));
        setSelectedMedicine(null);
        setDose('');
        setType('SC');
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
            // setMedicinesSearch(
            //     setTimeout(() => 
            useLoader(`/medicines?q=${inputValue}&np`).then((res) => {
                const options = res.data.map((medicine) => ({
                    value: medicine.id,
                    label: medicine.name,
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
            <FormControl id='type' gap={3} display='flex'>
                <FormLabel m={0} alignItems='center' display='flex'>
                    <Text verticalAlign='middle' fontSize='xl'>Within:</Text>
                </FormLabel>
                <InputGroup>
                    <NumberInput
                        defaultValue={7}
                        min={1}
                        onChange={(value) => setFormData((prevFormData) => ({
                            ...prevFormData,
                            TimeField: parseInt(value),
                        }))}
                    >
                        <NumberInputField borderRightRadius={0} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <InputRightAddon children='Days' />
                </InputGroup>
            </FormControl>
            <Divider mt='10px' mb='10px' />
            {/* choose medicines */}
            <Box>
                <Text textAlign='center' fontSize={25}>Medicines List</Text>
                <Box border='2px' borderColor='gray.300' boxShadow='md' p={1} mb={3} maxH='30vh' overflow='auto'>
                    <Table variant="unstyled" size="sm" >
                        <Tbody>
                            {formData.medicines.length === 0 && <Tr><Td textAlign='center'>No medicines added yet</Td></Tr>}
                            {formData.medicines.map((medicine) => (
                                <Tr bg='gray.50' key={medicine.value}>
                                    <Td fontSize={13}>Name: {medicine.label}</Td>
                                    <Td fontSize={13}>Dose: {medicine.dose}</Td>
                                    <Td fontSize={13}>Type: {medicine.type}</Td>
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

export default MonitoringSheetForm;