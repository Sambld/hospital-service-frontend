import { useCallback, useRef, useState } from 'react';
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
    Box,
    Center,
    Icon,
    Progress,
    useToast,
    useColorModeValue,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import usePost from '../hooks/usePost';
import { useDropzone } from 'react-dropzone'
import { useDrag, useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { BiImages } from 'react-icons/bi';
import { CloseIcon } from '@chakra-ui/icons';
import { FaSort } from 'react-icons/fa';
import { GiEmptyChessboard } from 'react-icons/gi';
import { AiOutlinePlus } from 'react-icons/ai';

import { useTranslation } from 'react-i18next';

const ObservationImageDraggable = ({ image, index, value, moveListItem }) => {
    // useDrag - the list item is draggable
    const [{ isDragging }, dragRef] = useDrag({
        type: 'image',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })


    // useDrop - the list item is also a drop area
    const [spec, dropRef] = useDrop({
        accept: 'image',
        hover: (item, monitor) => {
            const dragIndex = item.index
            const hoverIndex = index
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top

            // if dragging down, continue only when hover is smaller than middle Y
            if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return
            // if dragging up, continue only when hover is bigger than middle Y
            if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return

            moveListItem(dragIndex, hoverIndex)
            item.index = hoverIndex
        },
    })

    // Join the 2 refs together into one (both draggable and can be dropped on)
    const ref = useRef(null)
    const dragDropRef = dragRef(dropRef(ref))

    // Make items being dragged transparent, so it's easier to see where we drop them
    const opacity = isDragging ? 0 : 1
    return (
        <Box
            ref={dragDropRef}
            p={2}
            m={2}
            _hover={{ bg: 'gray.100' }}
            cursor='move'
        >
            <Flex>
                <Box>
                    <Image
                        src={image}
                        boxSize="100px"
                        objectFit="cover"
                        w='200px'
                    />
                </Box>
                <Flex alignItems="center" ml={5}>
                    <Text fontSize={40}>#{value + 1}</Text>
                </Flex>

            </Flex>
        </Box>

    )
}

const ObservationForm = ({ medical_record, closeModal, closeAndRefresh }) => {
    const [formData, setFormData] = useState({
        name: '',
        images: {
            imageList: {},
            imagePreviewUrl: {},
            imageTargetFile: {},
        },
    });

    const { t, i18n } = useTranslation();
    const toast = useToast();
    const [ImageSorted, setImageSorted] = useState([]);
    const [ImageNumber, setImageNumber] = useState(1);
    const [emptyImage, setEmptyImage] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const { getRootProps, getInputProps } = useDropzone({});


    const moveImageListItem = useCallback(
        (dragIndex, hoverIndex) => {
            const dragItem = ImageSorted[dragIndex]
            const hoverItem = ImageSorted[hoverIndex]
            if (dragItem == hoverItem) return
            if (dragItem == undefined || hoverItem == undefined) return
            setImageSorted((prevImageSorted) => {
                const newImageSorted = [...prevImageSorted]
                newImageSorted[dragIndex] = hoverItem
                newImageSorted[hoverIndex] = dragItem
                return newImageSorted
            })
        },
        [ImageSorted],
    )

    const handleSubmit = (event) => {
        event.preventDefault();
        if (formData.name == '' || formData.images.imageList == {}) {
            toast({
                title: "Error",
                description: t('medicalRecord.fillAllFields'),
                status: "error",
                duration: 9000,
                isClosable: true,
            })
            return;
        }

        setLoading(true);
        usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/observations',
            { name: formData.name }
        )
            .then((res) => {
                const uploadImages = uploadImage(res).then((upload) => {
                    setLoading(false);
                    if (res.data) {
                        closeAndRefresh(
                            {
                                title: t('medicalRecord.observationInfo.created'),
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
                })
            });
    };
    const uploadImage = async (res) => {
        try {
            const promises = [];
            const progressUnit = 100 / ImageSorted.length;
            ImageSorted.map((value, index) => {
                const promise = usePost('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/observations/' + res.data.id + '/images',
                    { image: formData.images.imageTargetFile['image' + value] },
                    { 'Content-Type': 'multipart/form-data' }
                ).then((res) => {
                    setUploadProgress((prevUploadProgress) => prevUploadProgress + progressUnit);
                })
                promises.push(promise);
            })
            await Promise.all(promises);
            return true
        } catch (err) {
            console.log(err)
        }

    }

    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleImageChange = (event, index) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.target.files) {
            let ImageNumberClone = ImageNumber - 1;
            let formDataClone = {
                images: {
                    imageList: {},
                    imagePreviewUrl: {},
                    imageTargetFile: {},
                },
            }
            let sortedClone = [...ImageSorted]

            if (index + 1 != ImageNumber) ImageNumberClone = index;

            for (const file in event.target.files) {
                if (['length', 'item'].includes(file)) continue

                formDataClone.images.imageList['image' + ImageNumberClone.toString()] = event.target.files[file].name;
                formDataClone.images.imagePreviewUrl['image' + ImageNumberClone.toString()] = URL.createObjectURL(event.target.files[file]);
                formDataClone.images.imageTargetFile['image' + ImageNumberClone.toString()] = event.target.files[file];

                ImageNumberClone += 1;
                sortedClone = [...sortedClone, ImageNumberClone - 1]
                if (index + 1 != ImageNumber) break;
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                images: {
                    ...prevFormData.images,
                    imageList: {
                        ...prevFormData.images.imageList,
                        ...formDataClone.images.imageList,
                    },
                    imagePreviewUrl: {
                        ...prevFormData.images.imagePreviewUrl,
                        ...formDataClone.images.imagePreviewUrl,
                    },
                    imageTargetFile: {
                        ...prevFormData.images.imageTargetFile,
                        ...formDataClone.images.imageTargetFile,
                    },
                },
            }));
            if (index + 1 == ImageNumber) {
                setImageNumber(ImageNumberClone + 1);
                setImageSorted(sortedClone)
            }


        }
    };
    const handleImageRemove = (event) => {
        const { name, value } = event.target;
        if (formData.images.imageList[name]) setImageNumber((prevImageNumber) => prevImageNumber - 1);
        setFormData((prevFormData) => ({
            ...prevFormData,
            images: {
                ...prevFormData.images,
                imageList: {
                    ...prevFormData.images.imageList,
                    [name]: '',
                },
                imagePreviewUrl: {
                    ...prevFormData.images.imagePreviewUrl,
                    [name]: '',
                },
                imageTargetFile: {
                    ...prevFormData.images.imageTargetFile,
                    [name]: '',
                },
            },
        }));
    };
    const deleteEmpty = () => {
        for (let i = 0; i <= ImageNumber - 1; i++) {
            if (formData.images.imageList['image' + i.toString()] == '') {
                if (!emptyImage.includes(i)) {
                    setEmptyImage((prevEmptyImage) => [...prevEmptyImage, i]);
                    setImageSorted((prevImageSorted) => prevImageSorted.filter((item) => item != i));
                }
            }
        }
    }

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (event, index) => {
        const Event = {
            target: {
                files: [...event.dataTransfer.files],
            },
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation()
        }
        setDragActive(false);
        handleImageChange(Event, index);
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
                <FormLabel>
                    {t("global.title")}
                </FormLabel>
                <Input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange} />
            </FormControl>
            <br />
            <Flex justify='flex-end' gap={2} mb={3}>
                <Button
                    colorScheme="red"
                    onClick={deleteEmpty}
                >
                    <GiEmptyChessboard />
                    <Text ml={1}>
                        {t("medicalRecord.deleteEmpty")}
                    </Text>
                </Button>

                <Button
                    colorScheme={sort ? 'green' : 'blue'}
                    onClick={() => {
                        setSort((prevSort) => !prevSort)
                    }}
                >
                    {sort ? <BiImages /> : <FaSort />}
                    <Text ml={1}>{sort ? 'Images' : 'Sort'}</Text>
                </Button>
            </Flex>
            {/* sort Images */}
            {sort ? (
                <DndProvider backend={HTML5Backend}>
                    <Box
                        border='2px'
                        borderColor='gray.300'
                        borderRadius='md'
                        p={2}
                        mb={3}

                    >
                        {ImageSorted.length == 0 ? (
                            <Text textAlign='center'>
                                {t("medicalRecord.nothingToSort")}
                            </Text>
                        ) : null}
                        {ImageSorted.map((value, index) => (
                            <ObservationImageDraggable
                                key={index}
                                index={index}
                                value={value}
                                image={formData.images.imagePreviewUrl['image' + value.toString()]}
                                moveListItem={moveImageListItem}
                            />
                        ))}
                    </Box>
                </DndProvider>
            ) : null}
            {/* do loop with ImageNumber */}
            < Grid templateColumns="repeat(3, 1fr)" gap={6} display={sort ? 'none' : 'grid'}>
                {ImageNumber && Array.from(Array(ImageNumber).keys())
                    .filter((i) => !emptyImage.includes(i))
                    .sort((a, b) => ImageSorted.indexOf(a) - ImageSorted.indexOf(b))
                    .map((i) => (
                        <GridItem key={i}>
                            <FormControl id={'image' + i.toString()} isRequired={ImageNumber != i + 1}>
                                {/* multiple input with image */}

                                {formData.images.imagePreviewUrl['image' + i.toString()] ?

                                    <Box
                                        border='2px'
                                        borderColor='gray.300'
                                        borderStyle='dashed'
                                        borderRadius='lg'
                                        bg='gray.100'
                                        cursor='pointer'
                                        h='300px'
                                        w='100%'
                                        m={0}
                                        overflow='hidden'
                                        position='relative'
                                        bgImage={formData.images.imagePreviewUrl['image' + i.toString()]}
                                        bgSize='cover'
                                        bgPosition='center'
                                        onClick={() => {
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                images: {
                                                    ...prevFormData.images,
                                                    imageList: {
                                                        ...prevFormData.images.imageList,
                                                        ['image' + i.toString()]: '',
                                                    },
                                                    imagePreviewUrl: {
                                                        ...prevFormData.images.imagePreviewUrl,
                                                        ['image' + i.toString()]: '',
                                                    },
                                                    imageTargetFile: {
                                                        ...prevFormData.images.imageTargetFile,
                                                        ['image' + i.toString()]: '',
                                                    },
                                                },
                                            }));
                                            // setImageNumber((prevImageNumber) => prevImageNumber - 1);
                                        }}

                                    >
                                        <Box
                                            position='absolute'
                                            top='0'
                                            right='0'
                                            // display='none'
                                            bg='#edf2f7'
                                            w='100%'
                                            h='100%'
                                            opacity='0'
                                            _hover={
                                                {
                                                    opacity: '0.5',
                                                }
                                            }
                                        >
                                            <Flex justifyContent={'center'} alignItems={'center'} h='100%'>
                                                <Text>
                                                    <CloseIcon fontSize={30} />
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Box>
                                    :
                                    <FormLabel
                                        border='2px'
                                        borderColor='gray.300'
                                        borderStyle='dashed'
                                        borderRadius='lg'
                                        bg={dragActive ? 'gray.100' : 'gray.200'}
                                        cursor='pointer'
                                        h='300px'
                                        w='100%'
                                        m={0}
                                        overflow='hidden'
                                        onDragEnter={(e) => handleDrag(e)}
                                        onDrop={(e) => handleDrop(e, i)}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        <Flex justifyContent='center' alignItems='center' h='100%' color={useColorModeValue('gray.400', 'gray.500')}>
                                            <Text textAlign='center'>+</Text>
                                        </Flex>
                                    </FormLabel>
                                }


                                <Input
                                    multiple={i == ImageNumber - 1 ? true : false}
                                    display='none'
                                    type="file"
                                    name={'image' + i.toString()}
                                    onChange={(e) => { handleImageChange(e, i) }}
                                />

                            </FormControl>
                        </GridItem>
                    ))}
            </Grid>
            {/* <Image src={} /> */}
            {loading && (
                <Box
                    position='relative'
                >
                    <Progress mt={3} hasStripe value={uploadProgress} h='25px' bg='blue.100 ' />
                    <Text
                        textAlign='center'
                        color={uploadProgress > 49 ? 'gray.50' : 'blue.700'}
                        textShadow='0 0 1px #000'
                        position='absolute'
                        top='0'
                        left='0'
                        right='0'
                        bottom='0'
                    >
                        {Math.round(uploadProgress)}%
                    </Text>
                </Box>
            )}
            <Flex justifyContent='center' mt='10px'>
                <Button colorScheme='blue' mr={3} onClick={closeModal}>
                    {t('global.cancel')}
                </Button>
                <Button variant='solid' colorScheme='green' type="submit" isLoading={loading} loadingText="Adding" onClick={handleSubmit}>
                    {/* add icon */}
                    <AiOutlinePlus />
                    <Text ml="5px" >
                        {t('global.add')}
                    </Text>
                </Button>
            </Flex>
        </Form >)
}

export default ObservationForm;