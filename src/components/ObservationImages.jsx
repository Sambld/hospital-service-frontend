import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, Grid, GridItem, HStack, Image, Text, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { AiFillEye, AiFillPrinter, AiFillSave } from "react-icons/ai";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "./axios";
import env from '../assets/env';

import { useTranslation } from "react-i18next";

const SummaryItem = ({ label, children }) => (
    <HStack color={useColorModeValue('gray.700', 'gray.200')}>
        <Text pt='2' fontSize='lg' fontWeight="bold">{label}:</Text>
        <Text pl='10' pt='2' fontSize='lg'>{children}</Text>
    </HStack>
);

const OBservationImages = ({ Observation, closeAndRefresh, patientId, user, medical_record }) => {
    // image slider
    const [current, setCurrent] = useState(0);
    const length = Observation.images.length;
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [deleteLoading, setDeleteLoading] = useState(false);
    const cancelRef = useRef()

    const { t, i18n } = useTranslation();

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    const printImage = (source) => {
        var printWindow = window.open("");
        printWindow.document.write(`<div style='height:100vh'><img width='100%' src='${env.API_URL}/storage/images/${source}'></div>`);
        printWindow.document.close();
        printWindow.print();
    }

    const printAllImage = () => {
        var printWindow = window.open("");
        let images = '';
        Observation.images.forEach((image) => {
            images += `<div style='height:100vh'><img width='100%' src='${env.API_URL}/storage/images/${image.path}'></div><br/>`;
        });
        printWindow.document.write(images);
        printWindow.document.close();
        printWindow.print();
    }

    const downloadImage = (source) => {
        var printWindow = window.open(`${env.API_URL}/storage/images/` + source);

    }

    const deleteObservation = () => {
        setDeleteLoading(true);
        axios.delete('/patients/' + patientId + '/medical-records/' + Observation.medical_record_id + "/observations/" + Observation.id).then((res) => {
            setDeleteLoading(false);

            if (res.data == undefined) {
                return;
            }
            if (res.data.message == 'observation deleted successfully.') {
                closeAndRefresh(
                    {
                        title: t('medicalRecord.observationInfo.deleted'),
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


    return (
        <Box>
            <Box m={2} p={5} border='2px' borderColor='gray.300' borderRadius={10} color="blue.900">
                <SummaryItem label="Observation title">{Observation.name}</SummaryItem>
                <SummaryItem label="Created date">{new Date(Observation.created_at).toISOString().slice(0, 10)}</SummaryItem>
                <SummaryItem label={t('prescription.doctor')}>{Observation.doctor.first_name + " " + Observation.doctor.last_name}</SummaryItem>
            </Box>
            <Box mb={2}>
                <Flex justifyContent='flex-end' gap={2}>
                    {/* Download image */}
                    {Observation.images.length > 0 &&
                        <Button
                            bg='blue.500'
                            color='white'
                            borderRadius={5}
                            onClick={() => downloadImage(Observation?.images[current]?.path)}
                        >
                            <AiFillEye fontSize={20} />
                            <Text ml={2}>
                                {t('medicalRecord.viewFullSize')}
                            </Text>
                        </Button>
                    }
                    {user?.id == Observation?.doctor?.id &&
                        <Button
                            bg='red.500'
                            color='white'
                            borderRadius={5}
                            onClick={onOpen}
                        >
                            <RiDeleteBinLine fontSize={20} />
                            <Text ml={2}>
                                {t('global.delete')}
                            </Text>
                        </Button>
                    }

                </Flex>
            </Box>
            <Box display='flex' justifyContent='flex-start' overflowX='auto'>
                {Observation && Observation.images.length > 0 && Observation.images.map((image, index) => (
                    <Box
                        key={index}
                        p={0}
                        onClick={() => setCurrent(index)}
                        cursor='pointer'
                        minW='20%'
                    >
                        <Box
                            border='2px'
                            borderRadius={0}
                            bgImage={`${env.API_URL}/storage/images/${image.path}`}
                            bgSize="cover"
                            bgPos="center"
                            bgRepeat="no-repeat"
                            h="100px"
                            cursor='pointer'
                            borderColor={current === index ? 'blue.500' : 'gray.200'}
                        >
                        </Box>
                    </Box>
                ))}
            </Box>
            {Observation && Observation.images.length > 0 && (
                <>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={3} display='none'>
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

                    <Box position='relative' mb={3}>
                        <Image
                            src={`${env.API_URL}/storage/images/${Observation?.images[current]?.path}`}
                            alt='image'
                            w='100%'
                            minH='300px'
                            h='100%'
                        />
                        <Button
                            bg='gray.900'
                            color='white'
                            borderRadius={0}
                            cursor='pointer'
                            onClick={prevSlide}
                            colorScheme='blackAlpha'
                            alignItems='center'
                            justifyContent='center'
                            position='absolute'
                            top='0'
                            left={0}
                            height='100%'
                            opacity='0.1'
                            _hover={{
                                opacity: '0.5',
                            }}
                        >
                            <BsCaretLeftFill fontSize={20} />
                        </Button>
                        <Button
                            bg='gray.900'
                            color='white'
                            cursor='pointer'
                            borderRadius={0}
                            onClick={nextSlide}
                            colorScheme='blackAlpha'
                            alignItems='center'
                            justifyContent='center'
                            position='absolute'
                            top='0'
                            right={0}
                            height='100%'
                            opacity='0.1'
                            _hover={{
                                opacity: '0.5',
                            }}
                        >
                            <BsCaretRightFill fontSize={20} />
                        </Button>
                    </Box>
                </>
            )}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {t('medicalRecord.deleteObservation')}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {t('global.areYouSureYouCanNotUndoThisAction')}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                {t('global.cancel')}
                            </Button>
                            <Button colorScheme='red' onClick={deleteObservation} ml={3} isLoading={deleteLoading}>
                                {t('global.delete')}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

export default OBservationImages;