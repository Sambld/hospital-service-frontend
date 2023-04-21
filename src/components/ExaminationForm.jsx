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

// Hooks
import usePost from '../hooks/usePost';
import usePut from '../hooks/usePut';
import useDelete from '../hooks/useDelete';

// Icons
import { DeleteIcon, EditIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";
import { AiOutlineCheck } from 'react-icons/ai';

const ExaminationForm = ({ medical_record, closeModal, closeAndRefresh, editMode, examination }) => {
    const [formData, setFormData] = useState({
        type: editMode ? examination.type : '',
        result: editMode ? examination.result : '',
    });
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

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
        usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/examinations', formData).then((res) => {
            setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Examination created successfully.',
                        status: 'success',
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
        usePut('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/examinations/' + examination.id, formData).then((res) => {
            setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Examination updated successfully.',
                        status: 'success',
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

    const handleDeleteConfirm = () => {
        if (deleteConfirmation) {
            handleDelete();
        }else {
            setDeleteConfirmation(true);
        }
    };


    const handleDelete = () => {
        setDeleteLoading(true);
        useDelete('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/examinations/' + examination.id).then((res) => {
            setDeleteLoading(false);
                closeAndRefresh(
                    {
                        title: 'Examination deleted successfully.',
                        status: 'success',
                    }
                )
        }).catch((err) => {
            setDeleteLoading(false);
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
            <Flex justifyContent='center' mt='10px' gap='10px'>
                {editMode && <Button w='120px' variant='solid' colorScheme='red' type="button" onClick={handleDeleteConfirm} isLoading={deleteLoading} loadingText="Deleting" onMouseLeave={() => setDeleteConfirmation(false)}>
                    {/* add icon */}
                    <DeleteIcon />
                    <Text ml="5px" fontSize={deleteConfirmation? 16:16} >{deleteConfirmation ? 'Sure ?' : 'Delete'}</Text>
                </Button>}

                
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText="Adding" >
                    {/* add icon */}
                    {editMode ? <EditIcon /> : <AddIcon />}
                    <Text ml="5px" >{editMode ? 'Update' : 'Add'}</Text>
                </Button>
            </Flex>
        </Form>)
}

export default ExaminationForm;