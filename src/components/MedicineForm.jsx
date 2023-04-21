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
import { FaBriefcaseMedical } from 'react-icons/fa';
import usePost from '../hooks/usePost';

const MedicineForm = ({ closeModal, closeAndRefresh }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
        is_pharmaceutical: false,
        manufacturer: '',
        supplier: '',
        expiration_date: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
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
                <FormLabel>Name</FormLabel>
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl mb={3} id="description" isRequired>
                <FormLabel>description</FormLabel>
                <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl mb={3} id="category" isRequired>
                <FormLabel>Category</FormLabel>
                <Input
                    type="date"
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
                <FormLabel>Quantity</FormLabel>
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
                <FormLabel>Is Pharmaceutical</FormLabel>
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
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </Select>
            </FormControl>

            <FormControl mb={3} id="manufacturer" isRequired>
                <FormLabel>Manufacturer</FormLabel>
                <Input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl mb={3} id="supplier" isRequired>
                <FormLabel>Supplier</FormLabel>
                <Input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl mb={3} id="expiration_date" isRequired>
                <FormLabel>Expiration Date</FormLabel>
                <Input
                    type="date"
                    name="expiration_date"
                    value={formData.expiration_date}
                    onChange={handleChange}
                />
            </FormControl>

            <Flex justifyContent='center' mt='10px'>
                <Button colorScheme='blue' mr={3} onClick={closeModal}>
                    Close
                </Button>
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText="Adding" >
                    {/* add icon */}
                    <FaBriefcaseMedical />
                    <Text ml="5px" >Add</Text>
                </Button>
            </Flex>
        </Form>)
}

export default MedicineForm;