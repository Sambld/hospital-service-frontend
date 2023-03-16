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
    BreadcrumbLink,
    BreadcrumbSeparator,
    Spinner,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useOutlet, useSearchParams, useNavigate   } from "react-router-dom";
import PatientsTable from "../components/PatientsTable";
import Pagination from '../components/Pagination'
import useLoader from "../hooks/useLoader";

const Patients = () => {
    const outlet = useOutlet()
    const [data, setData] = useState(null)
    const [patient, setPatient] = useState(null)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [id, setId] = useState(0)
    const NavigateButton = useRef()
    const EditableSpanValue = useRef('ALL')

    useEffect(() => {
        if (!data && !outlet) {
            setPatient(null)
            const request_url = requestUrl()
            useLoader(request_url).then(res => setData(res))
        }
        if (outlet) {
            setData(null)
        }
    }, [outlet])

    useEffect(() => {
        if (searchParams.get('q') || searchParams.get('page')) {
            setData(null)
            const request_url = requestUrl()
            useLoader(request_url).then(res => setData(res))
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
        if (!isNaN(e) && e) {
            setId(parseInt(e))
            onOpen()
        }
        EditableSpanValue.current.textContent = 'ALL'
    }

    const handlePagination = (e) => {
        setData(null)
        if (searchParams.get('q')) {
            useLoader('/patients?q=' + searchParams.get('q') + '&page=' + e).then(res => setData(res))
            navigate('/patients?q=' + searchParams.get('q') + '&page=' + e)
        }else{
            useLoader('/patients?page=' + e).then(res => setData(res))
            navigate('/patients?page=' + e)
        }
    }

    const handleSearch = (e) => {
        setData(null)
        useLoader('/patients?q=' + e).then(res => setData(res))
        navigate('/patients?q=' + e)
    }
    return (
        <Box>
            <HStack>
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
                            <Editable fontSize={30} color='#2e3149' onSubmit={handleSubmit} placeholder='ALL'>
                                <EditablePreview ref={EditableSpanValue} />
                                <EditableInput />
                            </Editable>
                        }
                    </BreadcrumbItem>
                </Breadcrumb>
                <Spacer />
                <Button colorScheme='blue' variant='outline' fontWeight='normal'>CREATE NEW RECORD</Button>
            </HStack>

            <Box bg='white' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                {outlet ? <Outlet context={setPatient} /> : (<><PatientsTable initValue={searchParams.get('q')} patients={data?.data} search={handleSearch} />{data && data.last_page > 1 && <Pagination pagination={data} action={handlePagination} />}</>)}
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={NavigateButton}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Navigation to Patient#{id}</ModalHeader>
                    <ModalCloseButton />
                    <ModalFooter>
                        <NavLink to={`/patients/${id}`} onClick={onClose} onKeyDown={onClose}>
                            <Button ref={NavigateButton} colorScheme='green' onClick={onClose} >Navigate</Button>
                        </NavLink>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
export default Patients;
