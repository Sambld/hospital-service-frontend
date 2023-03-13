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
import { NavLink, Outlet, useOutlet } from "react-router-dom";
import PatientsTable from "../components/PatientsTable";
import axios from '../components/axios'

const PatientsLoader = async () => {
    const abortCont = new AbortController();
    const { data } = await axios.get('/patients', { signal: abortCont.signal })
        .then(res => res.data)
        .catch(err => ()=>abortCont.abort())
    return data
}

const Patients = () => {
    const outlet = useOutlet()
    const [data, setData] = useState(null)
    const [patient, setPatient] = useState(null)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [id, setId] = useState(0)
    const NavigateButton = useRef()
    const EditableSpanValue = useRef('ALL')


    const handleSubmit = (e) => {
        if (!isNaN(e) && e) {
            setId(parseInt(e))
            onOpen()
        }
        EditableSpanValue.current.textContent = 'ALL'
    }
    useEffect(() => {
        if (!data && !outlet) PatientsLoader().then(res => setData(res))
        if (!outlet) setPatient(null)
    }, [outlet])

    return (
        <Box>
            <HStack>
                <Breadcrumb fontSize={{base:"md",lg:'3xl'}}>
                    <BreadcrumbItem>
                        <NavLink to='/patients' color='blue.500'>
                            <Text fontSize={{base:"md",lg:'3xl'}}  color='#2e3149' ml='20px'>Patients</Text>
                        </NavLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        {outlet &&(
                            patient ? <Text fontSize={{base:"md",lg:'3xl'}} color='#2e3149' >{patient.first_name + " " + patient.last_name}</Text>: <Spinner thickness='4px' />)
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

            <Box bg='white' w='100%' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                {outlet ? <Outlet context={setPatient} /> : <PatientsTable patients={data} />}
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
