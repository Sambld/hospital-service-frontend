import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
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
    Grid,
    GridItem,
    Flex,
    Avatar,
    IconButton,
    Skeleton,
    useColorModeValue,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";

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
import { HiOutlineEmojiSad } from "react-icons/hi";
import { BiRefresh } from "react-icons/bi";

// Translation
import { useTranslation } from "react-i18next";

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

    const navigate = useNavigate()

    const { t, i18n } = useTranslation()
    const colorModeValue = useColorModeValue('white', 'gray.800')
    const colorModeValue2 = useColorModeValue('gray.600', 'gray.300')
    const colorModeValue3 = useColorModeValue('gray.200', 'gray.700')
    const colorModeValue4 = useColorModeValue('gray.600', 'gray.600')
    const colorModeValue5 = useColorModeValue('gray.50', 'gray.700')
    const colorModeValue6 = useColorModeValue('gray.600', 'gray.100')
    const colorModeValue7 = useColorModeValue('gray.500', 'gray.300')
    const colorModeValue8 = useColorModeValue('white', 'gray.700')
    const colorModeValue9 = useColorModeValue('red.600', 'red.400')
    const colorModeValue10 = useColorModeValue('gray.200', 'gray.700')



    useEffect(() => {
        if (!data) useLoader('/users')
            .then(res => setData(res.data))
            .catch(err => {
                setData({
                    data: [],
                })
            })
    }, [])

    useEffect(() => {
        if (searchParams.get('q') || searchParams.get('page')) {
            setData(null)
            const request_url = requestUrl()
            useLoader(request_url)
                .then(res => setData(res.data))
                .catch(err => {
                    setData({
                        data: [],
                    })
                })
        }
    }, [searchParams])

    const requestUrl = () => {
        let request_url = '/users' + (searchParams.get('page') || searchParams.get('q') ? '?' : '')
            + (searchParams.get('q') ? 'q=' + searchParams.get('q') : '')
            + (searchParams.get('q') && searchParams.get('page') ? '&' : '')
            + (searchParams.get('page') ? 'page=' + searchParams.get('page') : '')
        return request_url
    }

    const handleRefresh = () => {
        setData(null)
        const request_url = requestUrl()
        useLoader(request_url)
            .then(res => setData(res.data))
            .catch(err => {
                setData({
                    data: [],
                })
            })
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
            navigate('/staff?q=' + searchParams.get('q') + '&page=' + e)
        } else {
            navigate('/staff?page=' + e)
        }
    }

    const handleSearch = (e) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }
        setSearchTimeout(setTimeout(() => {
            setData(null)
            if (!e) {
                useLoader('/users')
                    .then(res => setData(res.data))
                    .catch(err => {
                        setData({
                            data: [],
                        })
                    })
                navigate('/staff')
            } else {
                navigate('/staff?q=' + e)
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
                title: t('staff.staffInfo.deleted'),
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
        if (message?.status === 'success') {
            onStaffClose()
        }

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
                <Box mb={5} mt={1}>
                    <Breadcrumb fontSize={{ base: "md", lg: '3xl' }}>
                        <BreadcrumbItem>
                            <Text color={useColorModeValue('gray.500', 'gray.200')} fontSize={{ base: "md", lg: '3xl' }} ml='20px'>Staff</Text>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Box>
                <Spacer />
                <Button
                    colorScheme='blue'
                    variant='outline'
                    fontWeight='normal'
                    onClick={handleAddStaff}
                >
                    {t('staff.addStaff')}
                </Button>
            </HStack>

            <Box bg={colorModeValue} w='100%' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                <Text fontSize='sm' color='gray.500' p='10px' align='right'>Showing {data && data.data.length} of {data && data.total} staff</Text>
                <Box p='10px' mb='10px' w='100%' display='flex' justifyContent='space-between' gap={2}>
                    <InputGroup color={colorModeValue2} borderColor={colorModeValue3}>
                        <InputLeftElement
                            pointerEvents='none'
                            children={<SearchIcon color='gray.300' />}
                        />
                        <Input bg={colorModeValue} defaultValue={searchParams.get('q') || ''} variant='outline' type='text' placeholder={t('staff.searchByName')} onChange={({ target }) => { handleSearch(target.value) }} _placeholder={{ color: colorModeValue7 }} />
                    </InputGroup>
                    <IconButton
                        colorScheme='blackAlpha'
                        bg={colorModeValue4}
                        color='white'
                        aria-label='Refresh'
                        onClick={handleRefresh}
                        icon={<BiRefresh size={25} />}
                    />
                </Box>
                <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                    {
                        data && data.data.map((item, index) => (
                            <GridItem key={index}>
                                <Box bg={colorModeValue5} borderRadius='md' border='2px' borderColor={colorModeValue10} overflow='hidden'>

                                    <Box p='10px' textAlign='center'>
                                        <Avatar
                                            bg={UserRoleItem(item)[2]}
                                            icon={UserRoleItem(item)[0]}
                                        />
                                        <Text color={colorModeValue6} fontWeight='normal' fontSize={{ base: 'sm', lg: 'lg' }}>{item.first_name + " " + item.last_name}</Text>
                                        <Text fontSize='sm' color={colorModeValue7}>{t('staff.role')}: {item.role} </Text>
                                        <Text fontSize='sm' color={colorModeValue7}>{t('staff.createdAt')}: {new Date(item.created_at).toLocaleDateString()} </Text>

                                    </Box>
                                    <Flex justifyContent='space-between' bg='gray.100' borderBottomRadius='md' pt='1px' gap='1px'>
                                        <Button
                                            bg={colorModeValue8}
                                            color={colorModeValue9}
                                            leftIcon={<DeleteIcon />}
                                            colorScheme='red'
                                            borderRadius={0}
                                            border={0}
                                            variant='outline'
                                            p='10px'
                                            px={5}
                                            w='50%'
                                            onClick={() => {
                                                setSelectedStaff(item)
                                                onDeleteOpen()
                                            }}
                                        >
                                            <Text mr='5px' fontSize={15} fontWeight='normal'>
                                                {t('global.delete')}
                                            </Text>
                                        </Button>

                                        <Button
                                            bg={colorModeValue8}
                                            leftIcon={<EditIcon />}
                                            colorScheme='green'
                                            borderRadius={0}
                                            border={0}
                                            variant='outline'
                                            p='10px'
                                            px={5}
                                            w='50%'
                                            onClick={() => {
                                                setSelectedStaff(item)
                                                setEditMode(true)
                                                onStaffOpen()
                                            }}
                                        >
                                            <Text mr='5px' fontSize={15} fontWeight='normal'>
                                                {t('global.edit')}
                                            </Text>
                                        </Button>
                                    </Flex>
                                </Box>

                            </GridItem>

                        ))
                    }
                </Grid>
                {!data &&
                    <Box>
                        <Grid templateColumns={{ base: '1f', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={6}>
                            {[1].map((i) => (
                                <Box display='flex' p='0px' key={i} borderRadius='md' boxShadow='md' overflow='hidden'>
                                    <Skeleton w='100%' h='200px'>
                                        <Text>Loading...</Text>
                                    </Skeleton>
                                </Box>
                            ))}
                        </Grid>
                        <Center p='10px' gap={2} mt={5}>
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i}>
                                    <Text p={2} ml='5'>1</Text>
                                </Skeleton>
                            ))}
                        </Center>
                    </Box>
                }
                {data && data.data.length === 0 && (
                    <Box p='10px' display='flex' flexDirection='column' alignItems='center' justifyContent='center' gap={2}>
                        <HiOutlineEmojiSad size='50px' />
                        <Text fontSize='lg' fontWeight='normal'>No Staff Found</Text>
                    </Box>
                )}
                {
                    data && data.last_page > 1 &&
                    <Pagination pagination={data} action={handlePagination} />
                }
            </Box>
            <Modal closeOnOverlayClick={false} isOpen={isStaffOpen} onClose={handleStaffFormClose}>
                <ModalOverlay />
                <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "jf-flat" : 'Light' }}>
                    <ModalHeader>
                        {t('staff.addStaff').toUpperCase()}
                    </ModalHeader>
                    <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0', left: i18n.dir() == 'rtl' ? '0' : 'unset' }} />
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
                            <Text fontSize='lg' fontWeight='bold'>
                                {t('global.areYouSure')}
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter justifyContent='center'>
                            <Button onClick={onDeleteClose}>
                                {t('global.cancel')}
                            </Button>
                            <Button colorScheme='red' onClick={handleDeleteStaff} ml={3} isLoading={deleteLoading}>
                                {t('global.delete')}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

export default Staff;