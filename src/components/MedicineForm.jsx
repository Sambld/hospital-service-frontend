import { useState } from 'react';
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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Box,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';

// Icons
import { FaBriefcaseMedical } from 'react-icons/fa';

// Hooks
import usePost from '../hooks/usePost';
import usePut from '../hooks/usePut';

// Translation
import { useTranslation } from 'react-i18next';

const MedicineForm = ({ closeModal, closeAndRefresh, editMode, medicine }) => {
    const [formData, setFormData] = useState({
        name: editMode ? medicine.name : '',
        description: editMode ? medicine.description : '',
        category: editMode ? medicine.category : '',
        quantity: editMode ? medicine.quantity : '',
        is_pharmaceutical: editMode ? medicine.is_pharmaceutical : false,
        manufacturer: editMode ? medicine.manufacturer : '',
        supplier: editMode ? medicine.supplier : '',
        expiration_date: editMode ? medicine.expiration_date : '',
    });
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();

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

    const handleAdd = () => {
        setLoading(true);
        usePost('/medicines', formData)
            .then((res) => {
                setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Medicine created successfully.',
                        status: 'success',
                        redirect: '/medicines/' + res.data.id,
                    }
                )
            }).catch((err) => {
                setLoading(false);
                closeAndRefresh(
                    {
                        title: err.response.data.message,
                        status: 'error',
                    }
                )
            })
    };

    const handleEdit = () => {
        setLoading(true);
        usePut('/medicines/' + medicine.id, formData)
            .then((res) => {
                setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Medicine updated successfully.',
                        status: 'success',
                        redirect: '/medicines/' + medicine.id,
                    }
                )
            }).catch((err) => {
                setLoading(false);
                closeAndRefresh(
                    {
                        title: err.response.data.message,
                        status: 'error',
                    }
                )
            })
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormControl mb={3} id="name" isRequired>
                <FormLabel>
                    {t('medicine.name')}
                </FormLabel>
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl mb={3} id="description" isRequired>
                <FormLabel>
                    {t('medicine.description')}
                </FormLabel>
                <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl mb={3} id="category" isRequired>
                <FormLabel>
                    {t('medicine.category')}
                </FormLabel>
                <Input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                />
            </FormControl>

            {/* <FormControl mb={3} id="price" isRequired>
                <FormLabel>Price</FormLabel>
                <NumberInput
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(value) => setFormData({ ...formData, price: parseInt(value) })}
                >
                    <NumberInputField borderRightRadius={0} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl> */}

            <FormControl mb={3} id="quantity" isRequired>
                <FormLabel>
                    {t('medicine.quantity')}
                </FormLabel>
                <NumberInput
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={(value) => setFormData({ ...formData, quantity: value })}
                >
                    <NumberInputField borderRightRadius={0} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl mb={3} id="is_pharmaceutical" isRequired>
                <FormLabel>
                    {t('medicine.isPharmaceutical')}
                </FormLabel>
                <Select
                    name="is_pharmaceutical"
                    value={formData.is_pharmaceutical}
                    onChange={(event) => {
                        setFormData({
                            ...formData,
                            is_pharmaceutical: event.target.value === 'true',
                        });
                    }}
                >
                    <option value={true}>
                        {t('global.yes')}
                    </option>
                    <option value={false}>
                        {t('global.no')}
                    </option>
                </Select>
            </FormControl>

            <FormControl mb={3} id="manufacturer" isRequired>
                <FormLabel>
                    {t('medicine.manufacturer')}
                </FormLabel>
                <Input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl mb={3} id="supplier" isRequired>
                <FormLabel>
                    {t('medicine.supplier')}
                </FormLabel>
                <Input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl mb={3} id="expiration_date" isRequired>
                <FormLabel>
                    {t('medicine.expirationDate')}
                </FormLabel>
                <Input
                    type="date"
                    name="expiration_date"
                    value={formData.expiration_date}
                    onChange={handleChange}
                />
            </FormControl>

            <Flex justifyContent='center' mt='10px'>
                <Button colorScheme='blue' mr={3} onClick={closeModal}>
                    {t('global.cancel')}
                </Button>
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText="Adding" >
                    {/* add icon */}
                    <FaBriefcaseMedical />
                    <Text ml="5px" >{editMode ? t('global.edit') : t('global.add')}</Text>
                </Button>
            </Flex>
        </Form>)
}

export default MedicineForm;