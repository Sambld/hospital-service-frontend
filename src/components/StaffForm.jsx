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
    Box,
    InputGroup,
    InputRightElement,
    InputLeftElement
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { FaLock } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineEdit } from 'react-icons/ai';
import usePost from '../hooks/usePost';
import usePut from '../hooks/usePut';
import { useTranslation } from 'react-i18next';


const roles = [
    "administrator",
    "doctor",
    "nurse",
    "pharmacist",
];

const StaffForm = ({ closeModal, closeAndRefresh, editMode, selectedStaff }) => {
    const [formData, setFormData] = useState({
        first_name: editMode ? selectedStaff?.first_name : '',
        last_name: editMode ? selectedStaff?.last_name : '',
        username: editMode ? selectedStaff?.username : '',
        password: '',
        role: editMode ? selectedStaff?.role : 'administrator',
    });
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (editMode) {
            handleEdit(event);
        }
        else {
            handleAdd(event);
        }

    };

    const handleAdd = (event) => {
        usePost('/user', formData).then((res) => {
            setLoading(false);
            if (res.user) {
                closeAndRefresh(
                    {
                        title: t('staff.staffInfo.created'),
                        status: 'success',
                        redirect: '/staff',
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
        }).catch((err) => {
            closeAndRefresh(
                {
                    title: 'Error',
                    description: err.message,
                    status: 'error',
                }
            )
        });
    };
    const handleEdit = (event) => {
        usePut('/users/' + selectedStaff.id, formData).then((res) => {
            setLoading(false);
            closeAndRefresh(
                {
                    title: t('staff.staffInfo.updated'),
                    status: 'success',
                    redirect: '/staff',
                }
            )
        }).catch((err) => {
            closeAndRefresh(
                {
                    title: 'Error',
                    description: err.message,
                    status: 'error',
                }
            )
        });
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleGenerateRandomPassword = () => {
        const randomPassword = Math.random().toString(36).slice(-8);
        setFormData((prevFormData) => ({
            ...prevFormData,
            password: randomPassword,
        }));
    };

    return (
        <Form onSubmit={handleSubmit} style={{ direction: i18n.dir() }}>
            <Box mt='10px' mb='10px' display='flex' justifyContent='space-between' gap={5}>
                <FormControl id="first_name">
                    <FormLabel>
                        {t('staff.firstName')}
                    </FormLabel>
                    <Input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl id="last_name">
                    <FormLabel>
                        {t('staff.lastName')}
                    </FormLabel>
                    <Input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </FormControl>

            </Box>

            <FormControl id="username">
                <FormLabel>
                    {t('staff.username')}
                </FormLabel>
                <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl id="password">
                <FormLabel>
                    {t('staff.password')}
                </FormLabel>
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        color="gray.300"
                        children={<FaLock color="gray.300" />}
                    />
                    <Input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <InputRightElement width="auto" mr={2}>
                        <Button h="1.75rem" size="sm" onClick={handleGenerateRandomPassword}>
                            {t('staff.generate')}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="role">
                <FormLabel>
                    {t('staff.role')}
                </FormLabel>
                <Select
                    value={formData.role}
                    name="role"
                    onChange={handleChange}
                >
                    {roles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <Flex justifyContent='center' mt='10px'>
                {editMode ? (
                    <Button
                        variant='solid'
                        colorScheme='green'
                        mr='10px'
                        type="submit"
                        isLoading={loading}
                        onClick={() => closeModal()}
                    >
                        <AiOutlineEdit />
                        <Text mx="5px" >
                            {t('global.edit')}
                        </Text>
                    </Button>
                ) : (
                    <Button
                        variant='solid'
                        colorScheme='blue'
                        type="submit"
                        isLoading={loading}
                        loadingText="Adding"
                    >
                        <AiOutlinePlus />
                        <Text mx="5px" >
                            {t('staff.addStaff')}
                        </Text>
                    </Button>
                )}
            </Flex>
        </Form >)
}

export default StaffForm;