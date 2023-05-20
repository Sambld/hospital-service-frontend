import {
    Text,
    Box,
    Button,
    HStack,
    Spacer,
    Editable,
    EditablePreview,
    EditableInput,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Breadcrumb,
    BreadcrumbItem,
    Spinner,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Flex,
    useToast,
    Center,
    useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Link, Outlet, useOutlet, useSearchParams, useNavigate, useOutletContext } from "react-router-dom";

import useLoader from "../hooks/useLoader";

// Icons
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaUserMd } from "react-icons/fa";
import { AiFillFolderOpen } from "react-icons/ai";

// Components
import PatientForm from "../components/PatientForm";
import RecordForm from "../components/RecordForm";
import PatientsTable from "../components/PatientsTable";
import Pagination from '../components/Pagination'

// Translation
import { useTranslation } from "react-i18next";

const Patients = () => {
    const outlet = useOutlet()
    const user = useOutletContext()
    const [data, setData] = useState(null)
    const [rerender, setRerender] = useState(false)

    const { t,i18n } = useTranslation()

    const [patient, setPatient] = useState(null)
    const [patientEditMode, setPatientEditMode] = useState(false)

    const toast = useToast()

    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTimeout, setSearchTimeout] = useState(null)

    const [medicalrecordEditMode, setMedicalrecordEditMode] = useState(false)
    const [medicalrecordInitialData, setMedicalrecordInitialData] = useState(null)

    // Navigate modal
    const { isOpen: isNavigateOpen, onOpen: onNavigateOpen, onClose: onNavigateClose } = useDisclosure()
    // Patient modal
    const { isOpen: isPatientOpen, onOpen: onPatientOpen, onClose: onPatientClose } = useDisclosure()
    // Record modal
    const { isOpen: isRecordOpen, onOpen: onRecordOpen, onClose: onRecordClose } = useDisclosure()

    const [id, setId] = useState(0)
    const NavigateButton = useRef()
    const EditableSpanValue = useRef(t('patient.all').toUpperCase())

    useEffect(() => {
        if (!data && !outlet) {
            setPatient(null)
            if (!searchParams.get('q') && !searchParams.get('page')) {
                const request_url = requestUrl()
                useLoader(request_url).then(res => setData(res.data))
                    .catch(err => {
                        setData({
                            data: []
                        })
                    })
            }
        }
        if (outlet) {
            setData(null)
        }
    }, [outlet])

    useEffect(() => {
        if (searchParams.get('q') || searchParams.get('page')) {
            setData(null)
            const request_url = requestUrl()
            useLoader(request_url).then(res => setData(res.data))
                .catch(err => {
                    setData({
                        data: []
                    })
                })
        }
    }, [searchParams])

    const requestUrl = () => {
        let request_url = '/patients' + (searchParams.get('page') || searchParams.get('q') ? '?' : '')
            + (searchParams.get('q') ? 'q=' + searchParams.get('q') : '')
            + (searchParams.get('q') && searchParams.get('page') ? '&' : '')
            + (searchParams.get('page') ? 'page=' + searchParams.get('page') : '')
        return request_url
    }

    const handleSubmit = (e) => {
        // Modal Open
        if (!isNaN(e) && e) {
            setId(parseInt(e))
            onNavigateOpen()
        }
        EditableSpanValue.current.textContent = t('patient.all').toUpperCase()
    }

    const handlePagination = (e) => {
        setData(null)
        if (searchParams.get('q')) {
            navigate('/patients?q=' + searchParams.get('q') + '&page=' + e)
        } else {
            navigate('/patients?page=' + e)
        }
    }

    const handleSearch = (e) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }
        setSearchTimeout(setTimeout(() => {
            setData(null)
            if (!e) {
                useLoader('/patients').then(res => setData(res.data))
                    .catch(err => {
                        setData({
                            data: []
                        })
                    })
                navigate('/patients')
            } else {
                navigate('/patients?q=' + e)
            }
        }, 500))
    }

    const handlePatientAdd = (message) => {
        onPatientClose()
        toast({
            title: message.title,
            status: message.status,
            duration: 9000,
            isClosable: true,
        })
        if (message?.redirect) {
            setData(null)
            if (message.redirect === location.pathname + location.search) {
                window.location.reload()
            } else {
                navigate(message.redirect)
                useLoader(message.redirect).then(res => setData(res.data))
            }
        }
    }

    const handleRecordActions = (message) => {
        if (message?.status === 'success') {
            onRecordClose()
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
                window.location.reload()
            } else {
                navigate(message.redirect)
                useLoader(message.redirect).then(res => setData(res.data))
            }
        }
    }

    const handlePatientEdit = (initialData) => {
        setPatient(initialData)
        setPatientEditMode(true)
        onPatientOpen()
    }

    const handleRecordEdit = (initialData) => {
        setMedicalrecordInitialData(initialData)
        setMedicalrecordEditMode(true)
        onRecordOpen()
        // reload web page
    }

    const RecordFormExit = () => {
        setMedicalrecordInitialData(null)
        setMedicalrecordEditMode(false)
        onRecordClose()
    }
    return (
        <Box>
            <Flex mr={3}>
                <Breadcrumb fontSize={{ base: "md", sm: '3xl' }} separator={<Text fontSize={25} color={useColorModeValue('gray.500', 'gray.100')}>/</Text>}>
                    <BreadcrumbItem>
                        <Link to='/patients' color='red'>
                            <Text
                                fontSize={{ base: "md", sm: '3xl' }}
                                // color={outlet ? 'blue.700' : 'gray.500'}
                                color={outlet ? useColorModeValue('blue.700', 'blue.400') : useColorModeValue('gray.500', 'gray.200')}
                                ml='20px'
                            >
                                {t('patient.title')}
                            </Text>
                        </Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        {outlet && (
                            <Center h='54px' w='100%' >
                                {
                                patient ? <Text  fontSize={{ base: "md", sm: '3xl' }} color={useColorModeValue('#2e3149', 'gray.100')} >{patient.first_name + " " + patient.last_name}</Text> : <Spinner thickness='4px' />
                                }
                            </Center>
                        )}
                        {!outlet &&
                            <Editable fontSize={{ base: 'md', sm: '3xl' }} color={useColorModeValue('#2e3149', 'gray.100')} onSubmit={handleSubmit} placeholder={t('patient.all').toUpperCase()} >
                                <EditablePreview ref={EditableSpanValue} />
                                <EditableInput />
                            </Editable>
                        }
                    </BreadcrumbItem>
                </Breadcrumb>
                <Spacer />
                {user.role == 'doctor' && (
                    <Menu>
                        <MenuButton w='150px' colorScheme='blue.300' bg='blue.700' color='gray.100' as={Button} rightIcon={<ChevronDownIcon />} >
                            {t('patient.add').toUpperCase()}
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={onPatientOpen}>
                                <FaUserMd color={useColorModeValue('gray', 'white')} />
                                <Text ml={3} color={useColorModeValue('gray.700', 'gray.100')}>
                                    {t('patient.newPatient').toUpperCase()}
                                </Text>
                            </MenuItem>
                            <MenuItem onClick={onRecordOpen}>
                                <AiFillFolderOpen color={useColorModeValue('gray', 'white')} />
                                <Text ml={3} color={useColorModeValue('gray.700', 'gray.100')}>
                                    {t('patient.newRecord').toUpperCase()}
                                </Text>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                )}
                {/* <Button colorScheme='blue' variant='outline' fontWeight='normal'>CREATE NEW RECORD</Button> */}
            </Flex>

            <Box bg={useColorModeValue('white', 'gray.900')} m='10px' p='10px' pb={2} border='2px' borderColor='gray.200' borderRadius='2xl' overflow='hidden'>
                {(outlet && !rerender) ? <Outlet context={{ setPatient, user, handleRecordEdit, handlePatientEdit }} /> : (
                    <>
                        <PatientsTable initValue={searchParams.get('q') || ''} patients={data?.data} search={handleSearch} count={data?.total} />
                        {
                            data && data.last_page > 1 &&
                            <Pagination pagination={data} action={handlePagination} />
                        }
                    </>
                )}
            </Box>


            <Modal isOpen={isNavigateOpen} onClose={onNavigateClose} initialFocusRef={NavigateButton}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Navigation to Patient#{id}</ModalHeader>
                    <ModalCloseButton />
                    <ModalFooter>
                        <NavLink to={`/patients/${id}`} onClick={onNavigateClose} onKeyDown={onNavigateClose}>
                            <Button ref={NavigateButton} colorScheme='green' onClick={onNavigateClose} >Navigate</Button>
                        </NavLink>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal closeOnOverlayClick={false} isOpen={isPatientOpen} onClose={onPatientClose}>
                <ModalOverlay />
                <ModalContent maxW="56rem">
                    <ModalHeader>Add Patient</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <PatientForm closeModal={onPatientClose} closeAndRefresh={handlePatientAdd} EditMode={patientEditMode} PatientInformation={patient} />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal closeOnOverlayClick={false} isOpen={isRecordOpen} onClose={RecordFormExit}>
                <ModalOverlay />
                <ModalContent maxW="56rem">
                    <ModalHeader>{
                        medicalrecordEditMode ? 'Edit Medical Record' : 'Add Medical Record'
                    }</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RecordForm
                            closeModal={onRecordClose}
                            closeAndRefresh={handleRecordActions}
                            userId={user.id}
                            patientId={patient?.id || null}
                            editMode={medicalrecordEditMode}
                            initialData={medicalrecordInitialData}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>


        </Box>
    );
}
export default Patients;
