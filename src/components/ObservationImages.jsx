import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, Grid, GridItem, HStack, Image, Text, useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { AiFillEye, AiFillPrinter, AiFillSave } from "react-icons/ai";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "./axios";

const SummaryItem = ({ label, children }) => (
    <HStack>
        <Text pt='2' fontSize='lg' fontWeight="bold">{label}:</Text>
        <Text pl='10' pt='2' fontSize='lg'>{children}</Text>
    </HStack>
);

const OBservationImages = ({ Observation, closeAndRefresh , patientId }) => {
    // image slider
    const [current, setCurrent] = useState(0);
    const length = Observation.images.length;
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [deleteLoading, setDeleteLoading] = useState(false);
    const cancelRef = useRef()

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    const printImage = (source) => {
        var printWindow = window.open("");
        printWindow.document.write("<div style='height:100vh'><img width='100%' src='http://localhost:8000/storage/images/" + source + "'></div>");
        printWindow.document.close();
        printWindow.print();
    }

    const printAllImage = () => {
        var printWindow = window.open("");
        let images = '';
        Observation.images.forEach((image) => {
            images += "<div style='height:100vh'><img width='100%' src='http://localhost:8000/storage/images/" + image.path + "'></div><br/>";
        });
        printWindow.document.write(images);
        printWindow.document.close();
        printWindow.print();
    }

    const downloadImage = (source) => {
        var printWindow = window.open("http://localhost:8000/storage/images/" + source);

    }

    const deleteObservation = () => {
        setDeleteLoading(true);
        axios.delete('/patients/' + patientId + '/medical-records/' + Observation.medical_record_id + "/observations/" + Observation.id ).then((res) => {
            setDeleteLoading(false);
            
            if (res.data == undefined) {
                return;
            }
            if (res.data.message == 'observation deleted successfully.') {
                closeAndRefresh(
                    {
                        title: 'Observation deleted successfully.',
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
    }


    if (!Array.isArray(Observation.images) || Observation.images.length <= 0) {
        return null;
    }
    return (
        <Box>
            <Box m={2} p={5} border='2px' borderColor='gray.300' borderRadius={10} color="blue.900">
                <SummaryItem label="Observation title">{Observation.name}</SummaryItem>
                <SummaryItem label="Created date">{new Date(Observation.created_at).toISOString().slice(0, 10)}</SummaryItem>
            </Box>
            <Grid templateColumns="repeat(6, 1fr)" gap={0} mb={3}>
                {Observation && Observation.images.map((image, index) => (
                    <GridItem
                        key={index}
                        p={0}
                        onClick={() => setCurrent(index)}
                    >
                        <Box
                            border='2px'
                            borderRadius={5}
                            bgImage={'http://localhost:8000/storage/images/' + image.path}
                            bgSize="cover"
                            bgPos="center"
                            bgRepeat="no-repeat"
                            h="100px"
                            cursor='pointer'
                            borderColor={current === index ? 'blue.500' : 'gray.200'}
                        >
                        </Box>
                    </GridItem>
                ))}
            </Grid>
            <Box mb={2}>
                <Flex justifyContent='flex-end' gap={2}>
                    {/* Download image */}
                    <Button
                        bg='blue.500'
                        color='white'
                        borderRadius={5}
                        onClick={() => downloadImage(Observation.images[current].path)}
                    >
                        <AiFillEye fontSize={20} />
                        <Text ml={2}>View Full Size</Text>
                    </Button>
                    {/* Print image */}
                    {/* <Button
                        bg='blue.500'
                        color='white'
                        borderRadius={5}
                        onClick={() => printImage(Observation.images[current].path)}
                    >
                        <AiFillPrinter fontSize={20} />
                        <Text ml={2}>Print</Text>
                    </Button> */}
                    {/* Print all images */}
                    {/* <Button
                        bg='blue.500'
                        color='white'
                        borderRadius={5}
                        onClick={() => printAllImage()}
                    >
                        <AiFillPrinter fontSize={20} />
                        <Text ml={2}>Print All</Text>
                    </Button> */}
                    {/* Delete Observation */}
                    <Button
                        bg='red.500'
                        color='white'
                        borderRadius={5}
                        onClick={onOpen}
                    >
                        <RiDeleteBinLine fontSize={20} />
                        <Text ml={2}>Delete</Text>
                    </Button>

                </Flex>
            </Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={3}>
                <Button
                    bg='gray.500'
                    color='white'
                    borderRadius={5}
                    cursor='pointer'
                    onClick={prevSlide}
                    alignItems='center'
                    justifyContent='center'
                >
                    <BsCaretLeftFill fontSize={40} />
                </Button>
                <Button
                    bg='gray.500'
                    color='white'
                    cursor='pointer'
                    borderRadius={5}
                    onClick={nextSlide}
                    alignItems='center'
                    justifyContent='center'
                >
                    <BsCaretRightFill fontSize={40} />
                </Button>
            </Grid>
            <Box>
                <Image
                    src={'http://localhost:8000/storage/images/' + Observation.images[current].path}
                    alt='image'
                    w='100%'
                    h='100%'
                />
            </Box>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Observation
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={deleteObservation} ml={3} isLoading={deleteLoading}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

export default OBservationImages;