import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Icon,
    Button,
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
    Image,
    Spacer,
    Tab,
    Table,
    TableCaption,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
    InputLeftElement,
    Input,
    InputGroup,
    Badge,
    Center,
    Spinner,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

// Hooks
import useLoader from "../hooks/useLoader";
import useDelete from "../hooks/useDelete";
import { useEffect } from "react";
import { useState } from "react";

// Components
import Pagination from "../components/Pagination";
import StaffForm from "../components/StaffForm";

// Icons
import { RiAdminLine } from "react-icons/ri";
import { FaUserMd, FaUserNurse } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";

const UserRoleItem = (user) => {
    let items = [];
    try {
        if (user.role === 'administrator') {
            items = [<RiAdminLine fontSize={{ base: '1rem', md: '1.5rem' }} />, <RiAdminLine fontSize='4rem' />, 'black']
        } else if (user.role === 'doctor') {
            items = [<FaUserMd fontSize={{ base: '1rem', md: '1.5rem' }} />, <FaUserMd fontSize='4rem' />, 'red.500']
        } else if (user.role === 'nurse') {
            items = [<FaUserNurse fontSize={{ base: '1rem', md: '1.5rem' }} />, <FaUserNurse fontSize='4rem' />, 'blue.500']
        } else if (user.role === 'pharmacist') {
            items = [<GiMedicines fontSize={{ base: '1rem', md: '1.5rem' }} />, <GiMedicines fontSize='4rem' />, 'green.500']
        }
        return items;
    } catch { return items; }
}

const Staff = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTimeout, setSearchTimeout] = useState(null)

    // staff add and edit modal
    const { isOpen: isStaffOpen, onOpen: onStaffOpen, onClose: onStaffClose } = useDisclosure()
    const [editMode, setEditMode] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState(null)

    // staff delete alert
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [deleteLoading, setDeleteLoading] = useState(false)

    const toast = useToast()



    useEffect(() => {
        if (!data) useLoader('/users').then(res => setData(res.data))
    }, [])

    useEffect(() => {
        if (searchParams.get('q') || searchParams.get('page')) {
            setData(null)
            const request_url = requestUrl()
            useLoader(request_url).then(res => setData(res.data))
        }
    }, [searchParams])

    const requestUrl = () => {
        let request_url = '/users' + (searchParams.get('page') || searchParams.get('q') ? '?' : '')
            + (searchParams.get('q') ? 'q=' + searchParams.get('q') : '')
            + (searchParams.get('q') && searchParams.get('page') ? '&' : '')
            + (searchParams.get('page') ? 'page=' + searchParams.get('page') : '')
        return request_url
    }

    const handleSubmit = (e) => {
        if (!isNaN(e) && e) {
            setId(parseInt(e))
            onOpen()
        }
        EditableSpanValue.current.textContent = 'ALL'
    }

    const handlePagination = (e) => {
        setData(null)
        if (searchParams.get('q')) {
            navigate('/users?q=' + searchParams.get('q') + '&page=' + e)
        } else {
            navigate('/users?page=' + e)
        }
    }

    const handleSearch = (e) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }
        setSearchTimeout(setTimeout(() => {
            setData(null)
            if (!e) {
                useLoader('/users').then(res => setData(res.data))
                navigate('/users')
            } else {
                navigate('/users?q=' + e)
            }
        }, 500))
    }

    const handleAddStaff = () => {
        onStaffOpen()
    }

    const handleDeleteStaff = () => {
        setDeleteLoading(true)
        useDelete('/users/' + selectedStaff.id).then(res => {
            setDeleteLoading(false)
            handleStaffActions({
                title: 'Staff deleted successfully',
                status: 'success',
                redirect: location.pathname + location.search
            })
            onDeleteClose()
        })
        .catch(err => {
            setDeleteLoading(false)
            handleStaffActions({
                title: err.message,
                status: 'error',
            })
            onDeleteClose()
        })
    }


    const handleStaffActions = (message) => {
        onStaffClose()
        toast({
            title: message.title,
            status: message.status,
            duration: 9000,
            isClosable: true,
        })
        if (message?.redirect) {
            setData(null)
            if (message.redirect === location.pathname + location.search) {
                useLoader('/users').then(res => setData(res.data))
            } else {
                navigate(message.redirect)
                useLoader(message.redirect).then(res => setData(res.data))
            }
        }
    }

    const handleStaffFormClose = () => {
        onStaffClose()
        setEditMode(false)
        setSelectedStaff(null)
    }



    return (
        <Box>
            <HStack>
                <Text fontSize='3xl' color='#2e3149' ml='20px'>Staff</Text>
                <Spacer />
                <Button
                    colorScheme='blue'
                    variant='outline'
                    fontWeight='normal'
                    onClick={handleAddStaff}
                >ADD STAFF</Button>
            </HStack>
            <Box bg='white' w='100%' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                <Text fontSize='sm' color='gray.500' p='10px' align='right'>10,000 Patients</Text>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr bg='#fafafa'>
                                <Th w='50px' p='5'>#</Th>
                                <Th maxW='100px'>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents='none'
                                            children={<SearchIcon color='gray.300' />}
                                        />
                                        <Input defaultValue={searchParams.get('q') || ''} variant='flushed' type='text' placeholder='Search by Name' onChange={({ target }) => { handleSearch(target.value) }} />
                                    </InputGroup>
                                </Th>
                                <Th>Role</Th>
                                <Th>Created At</Th>
                                <Th>Options</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                data && data.map((item, index) => (
                                    <Tr key={index}>
                                        <Td p='1'>
                                            <Box
                                                w='50px'
                                                h='50px'
                                                bg={UserRoleItem(item)[2]}
                                                borderRadius='md'
                                                display='flex'
                                                justifyContent='center'
                                                alignItems='center'
                                                color='white'
                                                fontSize={{ base: '1rem', md: '1.5rem' }}

                                            >
                                                {UserRoleItem(item)[0]}
                                            </Box>
                                        </Td>
                                        <Td><Text fontWeight='normal' fontSize={{base:'sm',lg:'lg'}}>{item.first_name + " " + item.last_name}</Text></Td>
                                        <Td>
                                            <Badge colorScheme={
                                                item.role.toLowerCase() === 'administrator' ? 'gray' :
                                                    item.role.toLowerCase() === 'doctor' ? 'red' :
                                                        item.role.toLowerCase() === 'nurse' ? 'blue' :
                                                            item.role.toLowerCase() === 'pharmacist' ? 'green' : 'purple'

                                            }
                                                variant='solid' p='2' borderRadius='2xl'>
                                                {item.role}
                                            </Badge>
                                        </Td>
                                        <Td>{new Date(item.created_at).toLocaleDateString()}</Td>
                                        <Td
                                            display='flex'
                                            justifyContent='center'
                                            alignItems='center'
                                        >
                                            <HStack>
                                                <Button
                                                    colorScheme='blue'
                                                    variant='outline'
                                                    fontWeight='normal'
                                                    onClick={() => {
                                                        setSelectedStaff(item)
                                                        setEditMode(true)
                                                        onStaffOpen()
                                                    }}
                                                >EDIT</Button>
                                                <Button
                                                    colorScheme='red'
                                                    variant='outline'
                                                    fontWeight='normal'
                                                    onClick={() => {
                                                        setSelectedStaff(item)
                                                        onDeleteOpen()
                                                    }}
                                                >DELETE</Button>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
                {!data &&
                    <Center p='10px'>
                        <Spinner thickness='7px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='gray.500'
                            size='xl' />
                    </Center>
                }
                {
                    data && data.last_page > 1 &&
                    <Pagination pagination={data} action={handlePagination} />
                }
            </Box>
            <Modal closeOnOverlayClick={false} isOpen={isStaffOpen} onClose={handleStaffFormClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Staff</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <StaffForm
                            closeModal={handleStaffFormClose}
                            closeAndRefresh={handleStaffActions}
                            editMode={editMode}
                            selectedStaff={selectedStaff}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
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
                            <Button colorScheme='red' onClick={handleDeleteStaff} ml={3} isLoading={deleteLoading}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

export default Staff;