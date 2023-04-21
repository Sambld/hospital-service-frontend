import { Box,
    Button,
    Center,
    Divider,
    Flex,
    Spinner,
    Stack,
    Text,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,

} from "@chakra-ui/react";
// Icons
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

// Hooks
import { useState } from "react";
import { useEffect } from "react";
import useDelete from "../hooks/useDelete";
import useLoader from "../hooks/useLoader";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";

const Medicine = () => {
    const { id } = useParams()
    const [medicine, setMedicine] = useState(null)
    const { setMedicine: setMedicineInfo, enableMedicineEditMode: openMedicineModel, user } = useOutletContext()
    
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [NotFound, setNotFound] = useState(false)
    const [Errorhappen, setErrorhappen] = useState(false)

    const toast = useToast()
    const navigate = useNavigate()

    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    useEffect(() => {
        getMedicine()
    }, [])

    const getMedicine = () => {
        setLoading(true)
        useLoader(`/medicines/${id}`).then(res => {
            setMedicine(res.data)
            setMedicineInfo(res.data)
            setLoading(false)
        }).catch(err => {
            if (err.response.status === 404) {
                setNotFound(true)
                setLoading(false)
                toast({
                    title: "Error",
                    description: "Medicine not found",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                setErrorhappen(true)
                setLoading(false)
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            }

        })
    }

    const handleDeleteMedicine = () => {
        setDeleteLoading(true)
        useDelete(`/medicines/${id}`).then(res => {
            setDeleteLoading(false)
            toast({
                title: "Success",
                description: "Medicine deleted successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            onDeleteClose()
            navigate('/medicines')
        }).catch(err => {
            setDeleteLoading(false)
            toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        })
    }
    if (Errorhappen) return (
        <Box>
            <Text textAlign='center' fontSize={30}>
                Something went wrong
            </Text>
        </Box>
    )

    if (NotFound) return (
        <Box>
            <Text
                as="h2"
                fontSize={50}
                fontWeight='bold'
                bg='blue.700'
                textAlign='center'
                backgroundClip="text">
                404
            </Text>
            <Text textAlign='center' fontSize={30}>
                Medicine Not Found
            </Text>
            <Text textAlign='center' fontSize={15}>
                (Please check the id and try again)
            </Text>
        </Box>
    )
    return (
        <Box>
            {loading && <Center p='10px'><Spinner thickness='4px' /></Center>}
            {medicine && (
                <Box
                    p={5}
                >
                    {user.role == 'administrator' || user.role == 'pharmacist' && (
                        <Flex justifyContent='space-between' bg='gray.100' borderRadius='md' pt='1px' mb={3} overflow='hidden'>
                            <Button
                                bg='white'
                                leftIcon={<DeleteIcon />}
                                colorScheme='red'
                                variant='outline'
                                borderRadius={0}
                                borderLeftRadius='md'
                                border={0}
                                p='10px'
                                px={5}
                                w='50%'
                                onClick={onDeleteOpen}
                            >
                                <Text mr='5px' fontSize={15} fontWeight='normal'>Delete</Text>
                            </Button>

                            <Button
                                bg='white'
                                leftIcon={<EditIcon />}
                                colorScheme='green'
                                borderRadius={0}
                                borderRightRadius='md'
                                variant='outline'
                                border={0}
                                p='10px'
                                px={5}
                                w='50%'
                                onClick={() => openMedicineModel(medicine)}
                            >
                                <Text mr='5px' fontSize={15} fontWeight='normal'>Edit</Text>
                            </Button>
                        </Flex>
                    )}
                    <Stack p={5} spacing={4} border='1px' borderColor='gray.200' borderRadius='md'>
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold">
                                {medicine.name}
                            </Text>
                            <Text color="gray.500">{medicine.category}</Text>
                        </Box>
                        <Divider />
                        <Box>
                            <Text fontSize="lg" fontWeight="bold">
                                Description
                            </Text>
                            {medicine.description.split('\n').map((item, key) => {
                                return <Text key={key} ml={5}>{item}</Text>
                            })}
                        </Box>
                        <Divider />
                        <Box>
                            <Text fontSize="lg" fontWeight="bold">
                                Quantity
                            </Text>
                            <Text>{medicine.quantity}</Text>
                        </Box>
                        <Divider />
                        <Box>
                            <Text fontSize="lg" fontWeight="bold">
                                Pharmaceutical
                            </Text>
                            <Text>{medicine.is_pharmaceutical ? "Yes" : "No"}</Text>
                        </Box>
                        <Divider />
                        <Box>
                            <Text fontSize="lg" fontWeight="bold">
                                Manufacturer
                            </Text>
                            <Text>{medicine.manufacturer}</Text>
                        </Box>
                        <Divider />
                        <Box>
                            <Text fontSize="lg" fontWeight="bold">
                                Supplier
                            </Text>
                            <Text>{medicine.supplier}</Text>
                        </Box>
                        <Divider />
                        <Box>
                            <Text fontSize="lg" fontWeight="bold">
                                Expiration Date
                            </Text>
                            <Text>{medicine.expiration_date}</Text>
                        </Box>
                    </Stack>

                </Box>
            )}
            <AlertDialog
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent maxW='300px' p={5}>

                        <AlertDialogBody textAlign='center'>
                            <Text fontSize='lg' fontWeight='bold'>Are you sure?</Text>
                        </AlertDialogBody>

                        <AlertDialogFooter justifyContent='center'>
                            <Button onClick={onDeleteClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleDeleteMedicine} ml={3} isLoading={deleteLoading}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

export default Medicine;