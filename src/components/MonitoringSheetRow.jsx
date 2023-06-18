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
    useToast,
    useColorModeValue,
    Modal,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogBody,
    AlertDialogFooter
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import usePost from '../hooks/usePost';
import AsyncSelect from 'react-select/async';

import { AiOutlineDelete, AiOutlinePlus, AiOutlineUndo } from 'react-icons/ai';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import useLoader from '../hooks/useLoader';
import { BiPencil } from 'react-icons/bi';
import { useEffect } from 'react';
import usePut from '../hooks/usePut';
import useDelete from '../hooks/useDelete';

import { useTranslation } from 'react-i18next';

const MonitoringSheetRow = ({ user, medical_record, data, closeModal, closeAndRefresh, loadingData }) => {
    const [examinations, setExaminations] = useState([
        { name: 'urine', label: 'Urine', suffix: 'ml', type: 'number' },
        { name: 'blood_pressure', label: 'Blood Pressure', suffix: 'mmHg', type: 'text', placeholder: '.../...' },
        { name: 'temperature', label: 'Temperature', suffix: '°C', type: 'number', placeholder: '' },
        { name: 'weight', label: 'Weight', suffix: 'kg', type: 'number' },
    ]);
    const [formData, setFormData] = useState({
        medicines: [],
    });

    const { t, i18n } = useTranslation();

    const [addedTreatments, setAddedTreatments] = useState([]);
    const [deletedTreatments, setDeletedTreatments] = useState([]);
    const [report, setReport] = useState('')

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleteLoading, setDeleteLoading] = useState(false);


    const [options, setOptions] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [Dose, setDose] = useState('');
    const [type, setType] = useState('SC');

    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const colorModeValue1 = useColorModeValue('gray.50', 'gray.700')
    const colorModeValue2 = useColorModeValue('#fafafa', 'gray.800')
    const colorModeValue3 = useColorModeValue('black', 'white')
    const colorModeValue4 = useColorModeValue('white', '#2d3748')

    useEffect(() => {
        console.log(t('medicalRecord.monitoringSheetInfo.updated'));
        if (data) {
            setFormData((prev) => ({
                ...prev,
                medicines: data.treatments,
                urine: (data?.urine || ''),
                blood_pressure: (data?.blood_pressure || ''),
                temperature: (data?.temperature || ''),
                weight: (data?.weight || ''),
                progress_report: (data?.progress_report || ''),
            }));
            setReport(data?.progress_report || '')
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

    const handleAdd = async () => {
        setLoading(true);
        try {
            await handleEditVitalMeasurement()
                .then(() => {
                    closeAndRefresh(
                        {
                            title: t('medicalRecord.monitoringSheetInfo.updated'),
                            status: 'success',
                        }
                    )
                })
                .catch((err) => {
                    throw new Error(err?.response?.data?.message || err.message);
                })
                .finally(() => {
                    setLoading(false);
                })

        } catch (err) {
            toast({
                title: err?.message || err,
                status: 'error',
            })
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleEdit = async () => {
        const progressUnit = 100 / deletedTreatments.length;
        try {
            setLoading(true);
            if (report != formData.progress_report) {
                await MonitoringSheetReportEdit()
            }

            if (addedTreatments.length > 0) {
                await MonitoringSheetMedAdd(progressUnit * addedTreatments.length)
                    .catch((err) => {
                        throw new Error(err?.response?.data?.message || err.message);
                    })
            }
            if (deletedTreatments.length > 0) {
                await handleDeleteAllTreatments(progressUnit * deletedTreatments.length)
                    .catch((err) => {
                        throw new Error(err?.response?.data?.message || err.message);
                    })
            }
            if (data?.filled_by_id) {
                await handleEditVitalMeasurement()
                    .catch((err) => {
                        throw new Error(err?.response?.data?.message || err.message);
                    })
                    .finally(() => {
                    })
            }


            setLoading(false);
            closeAndRefresh(
                {
                    title: t('medicalRecord.monitoringSheetInfo.updated'),
                    status: 'success',
                }
            )
        } catch (err) {
            toast({
                title: err?.message || err,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setLoading(false);
            setUploadProgress(0);
        }

    }

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await useDelete('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + data.id);
            setDeleteLoading(false);
            closeAndRefresh(
                {
                    title: t('medicalRecord.monitoringSheetInfo.deleted'),
                    status: 'success',
                }
            )
        } catch (err) {
            toast({
                title: err.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setDeleteLoading(false);
        }
    }

    const handleEditVitalMeasurement = async () => {
        try {
            const { medicines, ...rest } = formData;

            // check if rest is changed or not, if not, don't send th
            for (let key in rest) {
                if (rest[key] == data[key] || "") {
                    delete rest[key];
                }
            }
            if (Object.keys(rest).length == 0) return true;

            // make rest string
            let allZero = true;
            Object.keys(rest).forEach((key) => {
                if (rest[key] != 0) {
                    allZero = false;
                    rest[key] = rest[key];
                }
            });
            if (rest['blood_pressure'] && rest['blood_pressure'] != "" && rest['blood_pressure'].split('/').length != 2) {
                throw new Error('blood pressure must be in format of x/y');
            }

            if (!allZero) {
                const promise = usePut('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + data.id, rest)
                    .catch((err) => {
                        throw new Error(err?.response?.data?.message || err.message);
                    })
                await Promise.all([promise]);
                return true
            } else {
                throw new Error(t('medicalRecord.monitoringSheetInfo.fillAtLeastOne'));
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }


    const handleDeleteAllTreatments = async (pu) => {
        try {
            const promises = [];
            deletedTreatments.map((treatment) => {
                const promise = useDelete('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + data.id + '/treatments/' + treatment.id)
                    .then((res) => {
                        setUploadProgress((prev) => prev + pu);

                    }).catch((err) => {
                        throw new Error(err?.response?.data?.message || err.message);
                    })
                promises.push(promise);
            })
            await Promise.all(promises);
            return true
        } catch (err) {
            return Promise.reject(err);
        }
    }

    const MonitoringSheetReportEdit = async () => {
        try {
            const promise = usePut('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + data.id, {
                progress_report: report
            })
            Promise.all(promises)
            return true
        } catch (err) {
            console.log(err)
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

        // check if medicine is already added
        const medicine = {
            ...selectedMedicine,
            dose: Dose,
            type: type,
        };
        if (formData.medicines.find((med) => med.medicine_id === selectedMedicine.value)) {
            toast(
                {
                    title: t('medicalRecord.monitoringSheetInfo.deleteFirstFromTreatments'),
                    status: 'info',
                    duration: 9000,
                    isClosable: true,
                }
            )
            return false;
        }
        if (addedTreatments.find((med) => med.value === selectedMedicine.value)) {
            setAddedTreatments((prevFormData) =>
                prevFormData.map((med) =>
                    med.value === selectedMedicine.value ? medicine : med
                )
            );

        } else {
            setAddedTreatments((prevFormData) =>
                [...prevFormData, medicine]
            );
        }
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

            {user && (user?.role == 'nurse' || (user?.role == 'doctor' && data?.filled_by_id)) && examinations.map((examination, index) => (
                <FormControl key={index} mb={3} id='type' gap={3} display='flex' justifyContent='space-between'>
                    <FormLabel m={0} alignItems='center' display='flex'>
                        <Text verticalAlign='middle' fontSize='xl'>
                            {examination.label}
                            {' (' + examination.suffix})
                        </Text>
                    </FormLabel>
                    {/* <InputGroup> */}
                    {examination.type == 'text' ? (
                        <Input
                            w='auto'
                            textAlign='center'
                            placeholder={examination.placeholder}
                            value={formData[examination.name]}
                            onChange={(e) => setFormData((prevFormData) => ({
                                ...prevFormData,
                                [examination.name]: e.target.value || '',
                            }))}
                            isDisabled={medical_record.patient_leaving_date || loadingData || (data && data.filled_by_id && user.id != data.filled_by_id && user.role == 'nurse') || !data}
                        />

                    ) : (
                        <Input
                            w='auto'
                            type='number'
                            textAlign='center'
                            value={formData[examination.name]}
                            onChange={(e) => setFormData((prevFormData) => ({
                                ...prevFormData,
                                [examination.name]: e.target.value || '',
                            }))}
                            isDisabled={medical_record.patient_leaving_date || loadingData || (data && data.filled_by_id && user.id != data.filled_by_id && user.role == 'nurse') || !data}
                        />
                    )}
                </FormControl>
            ))
            }
            <Divider my={3} />
            <Box>
                <>
                    <Heading size='md' mb={3}>
                        {t('medicalRecord.report')}
                    </Heading>
                    <Textarea
                        name='report'
                        value={formData.progress_report}
                        onChange={(e) => setFormData((prevFormData) => ({
                            ...prevFormData,
                            progress_report: e.target.value,
                        }))}
                        placeholder={t('medicalRecord.report')}
                        size='sm'
                        bg={colorModeValue1}
                        borderRadius={5}
                        boxShadow='md'
                        isDisabled={user && data && data.filled_by_id && user.id != data.filled_by_id && user.role == 'nurse'}
                    />
                </>

                {/* <Box
                    p={2}
                    border='1px'
                    borderColor='gray.300'
                    borderRadius='md'
                >
                    <Text>
                        {formData.progress_report}
                    </Text>
                </Box> */}

                {data && data.treatments && (
                    <Box>
                        <Divider my={3} />
                        <Heading size='md' mb={3}>
                            {t('medicalRecord.treatments')}
                        </Heading>
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
                                    bg={colorModeValue2}
                                    color='white'
                                    position="sticky"
                                    top={0}
                                    zIndex={1}
                                    boxShadow='md'
                                >
                                    <Tr>
                                        <Th w='300px'>
                                            {t('medicalRecord.name')}
                                        </Th>
                                        <Th>
                                            {t('medicalRecord.dose')}
                                        </Th>
                                        <Th>
                                            {t('medicalRecord.type')}
                                        </Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {formData.medicines.length == 0 && (
                                        <Tr>
                                            <Td colSpan={4} textAlign='center'>
                                                {t('medicalRecord.noData')}
                                            </Td>
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
            {
                user && user?.role == 'doctor' && addedTreatments.length > 0 && (
                    <>
                        <Divider my={3} />
                        <Box mt={3}>
                            <Heading size='md' mb={3}>
                                {t('medicalRecord.addedTreatments')}
                            </Heading>
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
                                                setAddedTreatments((prev) => prev.filter((med) => med.value != treatment.value))
                                            }}
                                        >
                                            <AiOutlineDelete />
                                        </Button>

                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </>
                )
            }

            {
                user && user?.role == 'doctor' && deletedTreatments.length > 0 && (
                    <>
                        <Divider my={3} />
                        <Box mt={3}>
                            <Heading size='md' mb={3}>
                                {t('medicalRecord.deletedTreatments')}
                            </Heading>
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
                                                setDeletedTreatments((prev) => prev.filter((med) => med.value != treatment.value))
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

                )
            }

            {
                user && user?.role == 'doctor' && (
                    <>
                        <Divider my={3} />
                        <Box mt={3} border='1px solid' borderColor='gray.300' borderRadius='md' p={3}>
                            <Box display='flex' flexDir='column' gap={3}>
                                <AsyncSelect
                                    placeholder={t('medicalRecord.selectMedicines')}
                                    name='medicineSearch'
                                    styles={{
                                        control: (provided, state) => ({
                                            ...provided,
                                            background: 'white',
                                            color: 'white',
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            color: colorModeValue3,
                                            background: colorModeValue4,
                                        }),
                                    }}
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
                                    placeholder={t('medicalRecord.dose')}
                                />
                            </Box>
                            <Box mt={3} display='flex' gap={3}>
                                <Select
                                    name='type'
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="SC">
                                        {t('medicalRecord.sc')}
                                    </option>
                                    <option value="IM">
                                        {t('medicalRecord.im')}
                                    </option>
                                    <option value="IV">
                                        {t('medicalRecord.iv')}
                                    </option>
                                    <option value="PO">
                                        {t('medicalRecord.po')}
                                    </option>
                                </Select>
                                <IconButton
                                    aria-label="Add"
                                    icon={formData.medicines.find((medicine) => medicine.medicine_id == selectedMedicine?.value) ? <EditIcon /> : <AiOutlinePlus />}
                                    colorScheme="gray"
                                    borderRadius={5}
                                    variant="outline"
                                    onClick={() => addMedicine()}
                                />
                            </Box>
                        </Box>
                    </>
                )
            }
            {
                loading && (
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
                )
            }
            <Flex justifyContent='center' mt='10px' gap={3}>
                <Button colorScheme='blue' onClick={closeModal}>
                    {t('global.cancel')}
                </Button>
                {user && user?.role == 'doctor' && user?.id == data?.user_id && (
                    <Button
                        variant='solid'
                        colorScheme='red'
                        loadingText="Deleting"
                        onClick={(e) => onOpen()}
                        isDisabled={loadingData}
                    >
                        {/* add icon */}
                        <AiOutlineDelete />
                        <Text >
                            {t('global.delete')}
                        </Text>
                    </Button>
                )}


                {user && user?.role == 'doctor' && (
                    <Button
                        variant='solid'
                        colorScheme='green'
                        isLoading={loading}
                        loadingText="Editing"
                        onClick={(e) => handleSubmit(e)}
                        isDisabled={loadingData || Dose != ""}
                    >
                        {/* add icon */}
                        <BiPencil />
                        <Text mx="5px" >
                            {t('global.edit')}
                        </Text>
                    </Button>
                )}
                {user && user?.role == 'nurse' ? data && data['filled_by_id'] ? (
                    <Button
                        variant='solid'
                        colorScheme='green'
                        type="submit"
                        isLoading={loading}
                        loadingText="Editing"
                        isDisabled={loadingData || user.role != 'nurse' || (data && data.filled_by_id && user.id != data.filled_by_id) || Dose != ""}
                    >
                        {/* add icon */}
                        <BiPencil />
                        <Text mx="5px" >
                            {t('global.edit')}
                        </Text>
                    </Button>) : (
                    <Button
                        variant='solid'
                        colorScheme='green'
                        type="submit"
                        isLoading={loading}
                        loadingText="Adding"
                        isDisabled={loadingData || user.role != 'nurse' || (data && data.filled_by_id && user.id != data.filled_by_id) || Dose != ""}
                    >
                        {/* add icon */}
                        <AiOutlinePlus />
                        <Text mx="5px" >
                            {t('global.apply')}
                        </Text>
                    </Button>
                ) : null}
            </Flex>
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent maxW='300px' p={5}>

                        <AlertDialogBody textAlign='center'>
                            <Text fontSize='lg' fontWeight='bold'>
                                {t('medicalRecord.areYouSure')}
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter justifyContent='center'>
                            <Button onClick={onClose}>
                                {t('global.cancel')}
                            </Button>
                            <Button colorScheme='red' onClick={handleDelete} ml={3} isLoading={deleteLoading}>
                                {t('global.delete')}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Form >)
}

export default MonitoringSheetRow;