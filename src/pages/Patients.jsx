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
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useOutlet, useSearchParams, useNavigate, useOutletContext } from "react-router-dom";
import PatientsTable from "../components/PatientsTable";
import Pagination from '../components/Pagination'
import useLoader from "../hooks/useLoader";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaUserMd } from "react-icons/fa";
import { AiFillFolderOpen } from "react-icons/ai";
import PatientForm from "../components/PatientForm";
import RecordForm from "../components/RecordForm";

const Patients = () => {
    const outlet = useOutlet()
    const user = useOutletContext()
    const [data, setData] = useState(null)
    const [patient, setPatient] = useState(null)

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
    const EditableSpanValue = useRef('ALL')

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
        EditableSpanValue.current.textContent = 'ALL'
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
            navigate(message.redirect)
            useLoader(message.redirect).then(res => setData(res.data))
        }
    }

    const handleRecordActions = (message) => {
        onRecordClose()
        toast({
            title: message.title,
            status: message.status,
            duration: 9000,
            isClosable: true,
        })
        if (message?.redirect) {
            setData(null)
            if (message.redirect === location.pathname + location.search) {
                location.reload()
            } else {
                navigate(message.redirect)
                useLoader(message.redirect).then(res => setData(res.data))
            }
        }
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
                <Breadcrumb fontSize={{ base: "md", lg: '3xl' }}>
                    <BreadcrumbItem>
                        <NavLink to='/patients' color='blue.500'>
                            <Text fontSize={{ base: "md", lg: '3xl' }} color='#2e3149' ml='20px'>Patients</Text>
                        </NavLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        {outlet && (
                            patient ? <Text fontSize={{ base: "md", lg: '3xl' }} color='#2e3149' >{patient.first_name + " " + patient.last_name}</Text> : <Spinner thickness='4px' />)
                        }
                        {!outlet &&
                            <Editable fontSize={{ base: 'md', lg: '3xl' }} color='#2e3149' onSubmit={handleSubmit} placeholder='ALL'>
                                <EditablePreview ref={EditableSpanValue} />
                                <EditableInput />
                            </Editable>
                        }
                    </BreadcrumbItem>
                </Breadcrumb>
                <Spacer />
                {user.role == 'doctor' || user.role == 'administrator' && (
                    <Menu>
                        <MenuButton w='120px' colorScheme='blue.300' bg='blue.700' color='gray.100' as={Button} rightIcon={<ChevronDownIcon />} >
                            ADD
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={onPatientOpen}>
                                <FaUserMd />
                                <Text ml={3}>
                                    NEW PATIENT
                                </Text>
                            </MenuItem>
                            <MenuItem onClick={onRecordOpen}>
                                <AiFillFolderOpen />
                                <Text ml={3}>
                                    NEW RECORD
                                </Text>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                )}
                {/* <Button colorScheme='blue' variant='outline' fontWeight='normal'>CREATE NEW RECORD</Button> */}
            </Flex>

            <Box bg='white' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                {outlet ? <Outlet context={{ setPatient, user, handleRecordEdit }} /> : (
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
                        <PatientForm closeModal={onPatientClose} closeAndRefresh={handlePatientAdd} />
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
