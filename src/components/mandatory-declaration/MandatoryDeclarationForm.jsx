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

// Translation
import { useTranslation } from 'react-i18next';

const MandatoryDeclarationForm = ({ medical_record, closeModal, closeAndRefresh, EditMode, mandatory_declaration }) => {
    const [formData, setFormData] = useState({
        diagnosis: EditMode ? mandatory_declaration.diagnosis : '',
        detail: EditMode ? mandatory_declaration.detail : '',
    });
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    const { t, i18n } = useTranslation();

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
                <FormLabel>{t('medicalRecord.diagnosis')}</FormLabel>
                <Input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange} />
            </FormControl>
            <br />
            <FormControl id='detail'>
                <FormLabel>{t('medicalRecord.detailedDiagnosis')}</FormLabel>

                <Textarea
                    type="text"
                    name="detail"
                    value={formData.detail}
                    onChange={handleChange} />

            </FormControl>
            <Flex justifyContent='center' mt='10px' gap='10px'>
                <Button variant='solid' colorScheme='red' onClick={closeModal} >
                    {t('global.cancel')}
                </Button>

                
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText={EditMode ? "Updating" : "Adding"}>
                    {/* add icon */}
                    {EditMode ? <EditIcon /> : <AddIcon />}
                    <Text ml="5px" >{EditMode ? t('global.edit') : t('global.add')}</Text>
                </Button>
            </Flex>
        </Form>)
}

export default MandatoryDeclarationForm;