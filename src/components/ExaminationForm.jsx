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
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import usePost from '../hooks/usePost';

const ExaminationForm = ({ medical_record, closeModal, closeAndRefresh }) => {
    const [formData, setFormData] = useState({
        type: '',
        result: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/examinations', formData).then((res) => {
            setLoading(false);
            if (res.data) {
                closeAndRefresh(
                    {
                        title: 'Examination created successfully.',
                        status: 'success',
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

    return (
        <Form onSubmit={handleSubmit}>
            <br />
            <FormControl id='type'>
                <FormLabel>Examination Type</FormLabel>
                <Input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange} />
            </FormControl>
            <br />
            <FormControl id='result'>
                <FormLabel>Examination Result</FormLabel>
                <Input
                    type="text"
                    name="result"
                    value={formData.result}
                    onChange={handleChange} />
            </FormControl>
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

export default ExaminationForm;