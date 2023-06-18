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
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogBody,
    AlertDialogFooter,
    useColorModeValue
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import usePost from '../hooks/usePost';
import AsyncSelect from 'react-select/async';

import { AiOutlinePlus } from 'react-icons/ai';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import useLoader from '../hooks/useLoader';
import usePut from '../hooks/usePut';
import useDelete from '../hooks/useDelete';

import { useTranslation } from 'react-i18next';

const PrescriptionForm = ({ medical_record, closeModal, closeAndRefresh, EditMode, prescription }) => {
    const [formData, setFormData] = useState({
        medicines: prescription ? prescription.medicine_requests.map((medicine) => {
            return {
                value: medicine.medicine.id,
                label: medicine.medicine.name,
                quantity: medicine.quantity,
                old_quantity: medicine.medicine.quantity,
                medicine_request_id: medicine.id,
                editable: medicine.status.toLowerCase() === 'pending' ? true : false,
            };
        }) : [],
    });

    const [options, setOptions] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [Quantity, setQuantity] = useState(0);

    const [selectedDeleteMedicine, setSelectedDeleteMedicine] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { t, i18n } = useTranslation();

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
        if (EditMode) {
            handleEdit(event);
        } else {
            handleAdd(event);
        }
    };


    const handleAdd = (event) => {
        setLoading(true);
        try {

            usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/prescriptions', {
                name: formData.name,
            }).then(async (res) => {

                MedicinesAdd(res.data.id).then(() => {
                    setLoading(false);
                    closeAndRefresh(
                        {
                            title: t('prescription.prescriptionInfo.created'),
                            status: 'success',
                        }
                    )
                })
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

    const handleEdit = (event) => {
        setLoading(true);
        try {
            MedicinesEdit(prescription.id).then(() => {
                setLoading(false);
                closeAndRefresh(
                    {
                        title: t('prescription.prescriptionInfo.updated'),
                        status: 'success',
                    }
                )
            }).catch((err) => {
                setLoading(false);
                closeAndRefresh({
                    title: 'Error',
                    description: 'Error updating prescription.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            })
        } catch (err) {
            console.log(err)
        }
    };

    const MedicinesEdit = async (prescription_id) => {
        try {
            const progressUnit = 100 / formData.medicines.length;
            const promises = [];
            let error = false;
            formData.medicines.map((medicine) => {
                if (prescription.medicine_requests.find((med) => med.medicine.id == medicine.value && med.quantity != medicine.quantity)) {
                    const promise = usePut('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/prescriptions/' + prescription_id + '/medicine-requests/' + medicine.medicine_request_id, {
                        medicine_id: medicine.value,
                        quantity: medicine.quantity,
                    }).then((res) => {
                        setUploadProgress((prev) => prev + progressUnit);
                    }).catch((err) => {
                        toast({
                            title: 'Error',
                            description: err?.response?.data?.message || err?.message,
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                        })

                        error = true;
                    });
                    promises.push(promise);
                } else if (!prescription.medicine_requests.find((med) => med.medicine.id === medicine.value)) {
                    const promise = usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/prescriptions/' + prescription_id + '/medicine-requests', {
                        medicine_id: medicine.value,
                        quantity: medicine.quantity,
                    }).then((res) => {
                        setUploadProgress((prev) => prev + progressUnit);
                    }).catch((err) => {
                        toast({
                            title: 'Error',
                            description: err?.response?.data?.message || err?.message,
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                        })
                        error = true;
                    });
                    promises.push(promise);
                }
            });
            await Promise.all(promises);
            if (!error) {
                return Promise.resolve();
            }
            return Promise.reject();
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const MedicinesDelete = async (med) => {
        try {
            return await useDelete('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/prescriptions/' + prescription.id + '/medicine-requests/' + med)
                .then((res) => {
                    return Promise.resolve();
                })
                .catch((err) => {
                    return Promise.reject(err);
                })

        } catch (err) {
            return Promise.reject(err);
        }
    }

    const MedicinesAdd = async (prescription_id) => {
        try {
            const progressUnit = 100 / formData.medicines.length;
            const promises = [];
            formData.medicines.map((medicine) => {
                const promise = usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/prescriptions/' + prescription_id + '/medicine-requests', {
                    medicine_id: medicine.value,
                    quantity: medicine.quantity,
                }).then(async (res) => {
                    setUploadProgress((prevUploadProgress) => prevUploadProgress + progressUnit);
                })
                    .catch((err) => {
                        Promise.reject(err);
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
        if (formData.medicines.find((med) => med.value === selectedMedicine.value)) {
            setFormData((prevFormData) => {
                const medicineIndex = prevFormData.medicines.findIndex((medicine) => medicine.value === selectedMedicine.value);
                const updatedMedicines = [...prevFormData.medicines];
                updatedMedicines.splice(medicineIndex, 1, medicine);

                return {
                    ...prevFormData,
                    medicines: updatedMedicines
                };
            });

        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                medicines: [...prevFormData.medicines, medicine],
            }));
        }
        setSelectedMedicine(null);
        setQuantity(0);
    };

    const handleMedicineRemove = (med) => {
        setSelectedDeleteMedicine(med);
        onDeleteOpen();
    }


    const removeMedicine = () => {
        if (EditMode && prescription.medicine_requests.find((medicine) => medicine.medicine.id === selectedDeleteMedicine.value)) {
            setDeleteLoading(true);
            MedicinesDelete(selectedDeleteMedicine.medicine_request_id)
                .then(() => {
                    toast(
                        {
                            title: t('medicine.medicineInfo.deleted'),
                            status: 'success',
                        }
                    )
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        medicines: prevFormData.medicines.filter((medicine) => medicine.value !== selectedDeleteMedicine.value),
                    }));
                })
                .catch((err) => {
                    console.log(err)
                    toast(
                        {
                            title: 'Error',
                            description: err.message,
                            status: 'error',
                        }
                    )
                })
                .finally(() => {
                    setDeleteLoading(false);
                    onDeleteClose();
                })
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                medicines: prevFormData.medicines.filter((medicine) => medicine.value !== selectedDeleteMedicine.value),
            }));
            onDeleteClose();
        }

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
                    editable: true,
                }));
                setOptions(options);
                callback(options);
            })
        }

    };


    return (
        <Form onSubmit={handleSubmit}>
            {/* <FormControl id='name' isRequired>
                <FormLabel>
                    {t('global.title')}
                </FormLabel>
                <Input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={(event) => {
                        event.persist();
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            name: event.target.value,
                        }));
                    }}
                />
            </FormControl> 
            <Divider mt='10px' mb='10px' />*/}
            {/* choose medicines */}
            <Box>

                <Text mb={5} textAlign='center' fontSize={25}>{t('medicine.medicinesList')}</Text>
                <Box border='2px' borderColor='gray.200' boxShadow='md' p={1} mb={3} maxH='30vh' overflow='auto'>
                    <Table variant="simple" size="md" colorScheme='blackAlpha'>
                        <Thead>
                            <Tr>
                                <Th fontSize={13}>
                                    {t('medicine.name')}
                                </Th>
                                <Th fontSize={13}>
                                    {t('medicine.quantity')}
                                </Th>
                                {EditMode && <Th fontSize={13} w='40px'>{t('global.edit')}</Th>}
                                <Th fontSize={13} w='40px'>
                                    {t('global.delete')}
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {formData.medicines.length === 0 && <Tr><Td colSpan={4} textAlign='center'>{t('medicine.noMedicinesAddedYet')}</Td></Tr>}
                            {formData.medicines.map((medicine) => (
                                <Tr key={medicine.value} bg={EditMode ? prescription?.medicine_requests.find((med) => med.medicine.id === medicine.value) ? useColorModeValue('gray.50', 'gray.600') : useColorModeValue('green.50', 'green.900') : useColorModeValue('gray.50', 'gray.600')}>
                                    <Td fontSize={13}>
                                        {EditMode ? !prescription?.medicine_requests.find((med) => med.medicine.id === medicine.value) && <Text color={useColorModeValue('green.700', 'green.300')} >{t('medicine.new')} !</Text> : ""}
                                        {medicine.label}
                                    </Td>
                                    <Td fontSize={13}>{medicine.quantity}</Td>
                                    {EditMode &&
                                        <Td>

                                            <IconButton
                                                aria-label="Edit"
                                                icon={<EditIcon />}
                                                color={useColorModeValue('green.500', 'green.300')}
                                                colorScheme='green'
                                                borderRadius={5}
                                                isDisabled={!medicine.editable}
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedMedicine(medicine);
                                                    setQuantity(medicine.quantity);
                                                }}
                                            />

                                        </Td>
                                    }
                                    <Td display='flex' justifyContent='center'>
                                        <IconButton
                                            aria-label="Remove"
                                            icon={<CloseIcon />}
                                            color={useColorModeValue('red.500', 'red.300')}
                                            colorScheme='red'
                                            isDisabled={!medicine.editable}
                                            borderRadius={5}
                                            variant='outline'
                                            onClick={() => handleMedicineRemove(medicine)}
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
                            placeholder={t('medicalRecord.selectMedicines')}
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
                    <Box mt={3} display='flex' gap={3}>
                        <NumberInput
                            min={1}
                            name='quantity'
                            value={Quantity}
                            onChange={(value) => setQuantity(value)}
                            flexGrow={1}
                        >
                            <NumberInputField borderRightRadius={0} />
                            {/* <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper> */}
                        </NumberInput>
                        <IconButton
                            aria-label="Add"
                            icon={formData.medicines.find((medicine) => medicine.value === selectedMedicine?.value) ? <EditIcon /> : <AiOutlinePlus />}
                            colorScheme="gray"
                            borderRadius={5}
                            variant="outline"
                            onClick={() => addMedicine()}
                        />
                    </Box>


                </FormControl>
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
                    <Text color={useColorModeValue('gray.700', 'gray.700')} fontSize={13}> {t('medicine.name')}: {selectedMedicine ? selectedMedicine.label : ''}</Text>
                    <Text color={useColorModeValue('gray.700', 'gray.700')} fontSize={13}> {t('medicine.quantity')}: {selectedMedicine ? selectedMedicine.old_quantity : 0}</Text>
                </Box>
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
            <Flex justifyContent='center' mt='10px' gap={3}>
                <Button colorScheme='blue' mr={3} onClick={closeModal}>
                    {t('global.close')}
                </Button>
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText="Adding" isDisabled={formData.medicines.length === 0 || Quantity != 0}>
                    {/* add icon */}
                    {EditMode ? <EditIcon /> : <AiOutlinePlus />}
                    <Text mx="5px" >{EditMode ? t('global.edit') : t('global.add')}</Text>
                </Button>
            </Flex>
            <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent maxW='300px' p={5}>

                        <AlertDialogBody textAlign='center'>
                            <Text fontSize='lg' fontWeight='bold'>{t('global.areYouSure')}</Text>
                        </AlertDialogBody>

                        <AlertDialogFooter justifyContent='center'>
                            <Button onClick={onDeleteClose}>
                                {t('global.cancel')}
                            </Button>
                            <Button colorScheme='red' onClick={removeMedicine} ml={3} isLoading={deleteLoading}>
                                {t('global.delete')}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Form>
    );
}

export default PrescriptionForm;