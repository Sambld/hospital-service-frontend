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
import usePost from '../../hooks/usePost';
import usePut from '../../hooks/usePut';
import useDelete from '../../hooks/useDelete';

// Icons
import { DeleteIcon, EditIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";
import { AiOutlineCheck } from 'react-icons/ai';

const MandatoryDeclarationForm = ({ medical_record, closeModal, closeAndRefresh, EditMode, mandatory_declaration }) => {
    const [formData, setFormData] = useState({
        diagnosis: EditMode ? mandatory_declaration.diagnosis : '',
        detail: EditMode ? mandatory_declaration.detail : '',
    });
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (EditMode) {
            handleEdit();
        }
        else {
            handleAdd();
        }
        
    };

    const handleAdd = () => {
        setLoading(true);
        usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/mandatory-declaration', formData).then((res) => {
            setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Mandatory Declaration Created successfully.',
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
        usePut('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/mandatory-declaration', formData).then((res) => {
            setLoading(false);
                closeAndRefresh(
                    {
                        title: 'Mandatory Declaration updated successfully.',
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
        useDelete('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/mandatory-declaration').then((res) => {
            setDeleteLoading(false);
                closeAndRefresh(
                    {
                        title: 'Mandatory Declaration deleted successfully.',
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
            <FormControl id='diagnosis'>
                <FormLabel>Mandatory Declaration Diagnosis</FormLabel>
                <Input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange} />
            </FormControl>
            <br />
            <FormControl id='detail'>
                <FormLabel>Mandatory Declaration Detail</FormLabel>

                <Textarea
                    type="text"
                    name="detail"
                    value={formData.detail}
                    onChange={handleChange} />

            </FormControl>
            <Flex justifyContent='center' mt='10px' gap='10px'>
                {EditMode && <Button w='120px' variant='solid' colorScheme='red' type="button" onClick={handleDeleteConfirm} isLoading={deleteLoading} loadingText="Deleting" onMouseLeave={() => setDeleteConfirmation(false)}>
                    {/* add icon */}
                    <DeleteIcon />
                    <Text ml="5px" fontSize={deleteConfirmation? 16:16} >{deleteConfirmation ? 'Sure ?' : 'Delete'}</Text>
                </Button>}

                
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText={EditMode ? "Updating" : "Adding"}>
                    {/* add icon */}
                    {EditMode ? <EditIcon /> : <AddIcon />}
                    <Text ml="5px" >{EditMode ? 'Update' : 'Add'}</Text>
                </Button>
            </Flex>
        </Form>)
}

export default MandatoryDeclarationForm;