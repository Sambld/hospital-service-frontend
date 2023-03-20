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
import { BsPersonAdd } from 'react-icons/bs';

const PatientForm = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        birthPlace: '',
        gender: '',
        address: '',
        nationality: '',
        phoneNumber: '',
        familySituation: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
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
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem colSpan={1}>
                    <FormControl id="firstName" isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl id="lastName" isRequired>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl id="birthDate" isRequired>
                        <FormLabel>Birth Date</FormLabel>
                        <Input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl id="birthPlace" isRequired>
                        <FormLabel>Place of Birth</FormLabel>
                        <Input
                            type="text"
                            name="birthPlace"
                            value={formData.birthPlace}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl id="gender" isRequired>
                        <FormLabel>Gender</FormLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </Select>
                    </FormControl>
                </GridItem>

                <GridItem colSpan={1}>
                    <FormControl id="address" isRequired>
                        <FormLabel>Address</FormLabel>
                        <Textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl id="nationality" isRequired>
                        <FormLabel>Nationality</FormLabel>
                        <Input
                            type="text"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl id="phoneNumber" isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl id="familySituation" isRequired>
                        <FormLabel>Family Situation</FormLabel>
                        <Input
                            type="text"
                            name="familySituation"
                            value={formData.familySituation}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl id="emergencyContactName" isRequired>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <Input
                            type="text"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl id="emergencyContactPhone" isRequired>
                        <FormLabel>Emergency Contact Phone Number</FormLabel>
                        <Input
                            type="tel"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleChange}
                        />
                    </FormControl>
                </GridItem>
            </Grid>

            <Flex justifyContent='center' mt='10px'>
                <Button colorScheme='blue' mr={3} onClick={closeModal}>
                    Close
                </Button>
                <Button variant='solid' colorScheme='green' type="submit">
                    {/* add icon */}
                    <BsPersonAdd />
                    <Text ml="5px" >Add</Text>
                </Button>
            </Flex>
        </Form>)
}

export default PatientForm;