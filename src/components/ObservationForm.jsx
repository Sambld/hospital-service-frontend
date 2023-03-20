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
    Image,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import usePost from '../hooks/usePost';

const ObservationForm = ({ medical_record, closeModal, closeAndRefresh }) => {
    const [formData, setFormData] = useState({
        name: '',
        images: {
            imageList: {},
            imagePreviewUrl: {},
            imageBase64: {},
        },
    });
    const [ImageNumber, setImageNumber] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/observations',
            { name: formData.name }
        )
            .then((res) => {
                for (const property in formData.images.imageBase64) {
                    
                    usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/observations/' + res.data.id + '/images',
                        { image: formData.images.imageBase64[property] },
                        { 'Content-Type': 'multipart/form-data' }
                    )
                }
                setLoading(false);
                if (res.data) {
                    closeAndRefresh(
                        {
                            title: 'Observation created successfully.',
                            status: 'success',
                        }
                    )
                }
                else {
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
    // const uploadImage = async (patientId, medicalRecordId, observationId, imageFile) => {
    //     // Create a FormData object to hold the image file
    //     const formData = new FormData();
    //     formData.append('image', imageFile);

    //     // Send a POST request to the server with the image data
    //     const response = await axios.post(`/patients/${patientId}/medical-records/${medicalRecordId}/observations/${observationId}/images`, formData);

    //     // Return the uploaded image data
    //     return response.data.data.image;
    // }
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleImageChange = (event) => {
        const { name, value } = event.target;

        if (!formData.images.imageList[name]) setImageNumber((prevImageNumber) => prevImageNumber + 1);

        setFormData((prevFormData) => ({
            ...prevFormData,
            images: {
                ...prevFormData.images,
                imageList: {
                    ...prevFormData.images.imageList,
                    [name]: value,
                },
                imagePreviewUrl: {
                    ...prevFormData.images.imagePreviewUrl,
                    [name]: URL.createObjectURL(event.target.files[0]),
                },
                imageBase64: {
                    ...prevFormData.images.imageBase64,
                    [name]: event.target.files[0],
                },
            },
        }));
        // getBase64(event.target.files[0]).then((result) => {
        //     setFormData((prevFormData) => ({
        //         ...prevFormData,
        //         images: {
        //             ...prevFormData.images,
        //             imageBase64: {
        //                 ...prevFormData.images.imageBase64,
        //                 [name]: result,
        //             },
        //         },
        //     }));
        // });
        // console.log(formData.images.imageBase64)
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <br />
            <FormControl id='name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange} />
            </FormControl>
            <br />
            {/* do loop with ImageNumber */}
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {ImageNumber && Array.from(Array(ImageNumber).keys()).map((i) => (
                    <GridItem key={i}>
                        <FormControl id={'image' + i.toString()} isRequired={ImageNumber != i + 1}>
                            {/* multiple input with image */}
                            <FormLabel
                                border='2px'
                                borderColor='gray.300'
                                borderStyle='dashed'
                                borderRadius='lg'
                                bg='gray.100'
                                cursor='pointer'
                                h='100px'
                                w='100px'
                                overflow='hidden'
                            >
                                <Flex justifyContent='center' alignItems='center' h='100%'>
                                    {formData.images.imagePreviewUrl['image' + i.toString()] ? <Image src={formData.images.imagePreviewUrl['image' + i.toString()]} /> : <Text textAlign='center'>+</Text>}
                                </Flex>
                            </FormLabel>
                            <Input
                                display='none'
                                type="file"
                                name={'image' + i.toString()}
                                value={formData.images.imageList['image' + i.toString()] || ''}
                                onChange={handleImageChange} />

                        </FormControl>
                    </GridItem>
                ))}
            </Grid>

            {/* <Image src={} /> */}

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

export default ObservationForm;