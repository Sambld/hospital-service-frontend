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
    useToast,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { BsPersonAdd } from 'react-icons/bs';
import usePost from '../hooks/usePost';
import { EditIcon } from '@chakra-ui/icons';
import usePut from '../hooks/usePut';
import { useTranslation } from 'react-i18next';

const PatientForm = ({ closeModal, closeAndRefresh, EditMode, PatientInformation }) => {
    const [formData, setFormData] = useState({
        first_name: PatientInformation?.first_name || '',
        last_name: PatientInformation?.last_name || '',
        birth_date: PatientInformation?.birth_date || '',
        place_of_birth: PatientInformation?.place_of_birth || '',
        gender: PatientInformation?.gender || 'Male',
        address: PatientInformation?.address ||  '',
        nationality: PatientInformation?.nationality || '',
        phone_number: PatientInformation?.phone_number || '',
        family_situation: PatientInformation?.family_situation || '',
        emergency_contact_name: PatientInformation?.emergency_contact_name || '',
        emergency_contact_number: PatientInformation?.emergency_contact_number || '',
    });
    const [loading, setLoading] = useState(false);

    const taost = useToast();

    const { t, i18n } = useTranslation();


    const handleSubmit = (event) => {
        event.preventDefault();
        if (EditMode) {
            handleEdit();
        } else {
            handleAdd();
        }
    };
    const handleAdd = () => {
        setLoading(true);
        usePost('/patients', formData).then((res) => {
            closeAndRefresh(
                {
                    title: 'Patient created successfully.',
                    status: 'success',
                    redirect: '/patients/' + res.patient.id,
                }
            )
        }).catch((err) => {
            if(err?.response?.status == 0) {
                return taost({
                    title: 'An error occurred.',
                    description: 'Please check your internet connection.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
            taost({
                title: err?.response?.data?.message || 'An error occurred.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        })
        .finally(() => {
            setLoading(false);
        })
    };

    const handleEdit = () => {
        setLoading(true);
        usePut('/patients/' + PatientInformation.id, formData).then((res) => {
            setLoading(false);
            closeAndRefresh(
                {
                    title: 'Patient updated successfully.',
                    status: 'success',
                    redirect: '/patients/' + res.patient.id,
                }
            )
        }).catch((err) => {
            if(err?.response?.status == 0) {
                return taost({
                    title: 'An error occurred.',
                    description: 'Please check your internet connection.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
            taost({
                title: err?.response?.data?.message || 'An error occurred.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        })
        .finally(() => {
            setLoading(false);
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
            <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }} gap={6}>
                <GridItem colSpan={1}>
                    <FormControl mb={3} id="first_name" isRequired>
                        <FormLabel>
                            {t('patient.firstName')}
                        </FormLabel>
                        <Input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="last_name" isRequired>
                        <FormLabel>
                            {t('patient.lastName')}
                        </FormLabel>
                        <Input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="birth_date" isRequired>
                        <FormLabel>
                            {t('patient.birthDate')}
                        </FormLabel>
                        <Input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="place_of_birth" isRequired>
                        <FormLabel>
                            {t('patient.details.placeOfBirth')}
                        </FormLabel>
                        <Input
                            type="text"
                            name="place_of_birth"
                            value={formData.place_of_birth}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="gender" isRequired>
                        <FormLabel>
                            {t('patient.details.gender')}
                        </FormLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="Male">
                                {t('global.male')}
                            </option>
                            <option value="Female">
                                {t('global.female')}
                            </option>
                        </Select>
                    </FormControl>
                </GridItem>

                <GridItem colSpan={1}>
                    <FormControl mb={3} id="address" isRequired>
                        <FormLabel>
                            {t('patient.details.address')}
                        </FormLabel>
                        <Textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="nationality" isRequired>
                        <FormLabel>
                            {t('patient.details.natinoality')}
                        </FormLabel>
                        <Input
                            type="text"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="phone_number" isRequired>
                        <FormLabel>
                            {t('patient.phoneNumber')}
                        </FormLabel>
                        <Input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="family_situation">
                        <FormLabel>
                            {t('patient.details.familySituation')}
                        </FormLabel>
                        <Input
                            type="text"
                            name="family_situation"
                            value={formData.family_situation}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="emergency_contact_name">
                        <FormLabel>
                            {t('patient.details.emergencyContactName')}
                        </FormLabel>
                        <Input
                            type="text"
                            name="emergency_contact_name"
                            value={formData.emergency_contact_name}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl mb={3} id="emergency_contact_number">
                        <FormLabel>
                            {t('patient.details.emergencyContactPhone')}
                        </FormLabel>
                        <Input
                            type="tel"
                            name="emergency_contact_number"
                            value={formData.emergency_contact_number}
                            onChange={handleChange}
                        />
                    </FormControl>
                </GridItem>
            </Grid>

            <Flex justifyContent='center' mt='10px' gap={3}>
                <Button colorScheme='blue' mء={3} onClick={closeModal}>
                    {t('global.cancel')}
                </Button>
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText={EditMode ? 'Updating' : 'Adding'}>
                    {/* add icon */}
                    { EditMode ? <EditIcon /> :<BsPersonAdd /> }
                    <Text mx="5px" >
                        {EditMode ? t('global.edit') : t('global.add')}
                    </Text>
                </Button>
            </Flex>
        </Form>)
}

export default PatientForm;