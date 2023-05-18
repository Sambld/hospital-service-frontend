import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Text,
    Flex,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    useDisclosure,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Spinner
} from "@chakra-ui/react";
import { NavLink, Link, Outlet, useNavigate, useOutletContext, useOutlet, useSearchParams } from "react-router-dom";

// Hooks
import { useEffect, useState } from "react";
import useLoader from "../hooks/useLoader";

// Icons
import { ChevronDownIcon } from "@chakra-ui/icons";
import { GoDiffAdded } from "react-icons/go";
import { FaBriefcaseMedical } from "react-icons/fa";

// Components
import MedicinesTable from "../components/MedicinesTable";
import Pagination from "../components/Pagination";
import MedicineQuantityForm from "../components/MedicineQuantityForm";
import MedicineForm from "../components/MedicineForm";

const Medicines = () => {
    const outlet = useOutlet()
    const user = useOutletContext()
    const [data, setData] = useState(null)

    const [medicine, setMedicine] = useState(null)
    const [medicineEditMode, setMedicineEditMode] = useState(false)
    const [medicinesLoading, setMedicinesLoading] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTimeout, setSearchTimeout] = useState(null)

    const toast = useToast()
    const navigate = useNavigate()

    const { isOpen: isQuantityModalOpen, onOpen: onQuantityModalOpen, onClose: onQuantityModalClose } = useDisclosure()
    const { isOpen: isMedicineModalOpen, onOpen: onMedicineModalOpen, onClose: onMedicineModalClose } = useDisclosure()

    useEffect(() => {
        if (!data && !outlet) useLoader('/medicines').then(res => setData(res.data)).catch(err => setData({ data: [] }))
    }, [outlet])

    useEffect(() => {
        if (!data && !outlet) {
            setMedicine(null)
            const request_url = requestUrl()
            useLoader(request_url).then(res => setData(res.data)).catch(err => setData({ data: [] }))
        }
        if (outlet) {
            setData(null)
        }
    }, [outlet])

    useEffect(() => {
        if (searchParams.get('q') || searchParams.get('page')) {
            setData(null)
            const request_url = requestUrl()
            useLoader(request_url).then(res => setData(res.data)).catch(err => setData({ data: [] }))
        }
    }, [searchParams])

    const requestUrl = () => {
        let request_url = '/medicines' + (searchParams.get('page') || searchParams.get('q') ? '?' : '')
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
            navigate('/medicines?q=' + searchParams.get('q') + '&page=' + e)
        } else {
            navigate('/medicines?page=' + e)
        }
    }

    const handleSearch = (e) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }
        setSearchTimeout(setTimeout(() => {
            setData(null)
            if (!e) {
                useLoader('/medicines').then(res => setData(res.data)).catch(err => setData({ data: [] }))
                navigate('/medicines')
            } else {
                navigate('/medicines?q=' + e)
            }
        }, 500))
    }

    const enableMedicineEditMode = (medicine) => {
        setMedicineEditMode(true)
        setMedicine(medicine)
        onMedicineModalOpen()
    }


    const handleMedicineActions = (message) => {
        if (message?.status === 'success') {
            if (medicineEditMode) {
                setMedicineEditMode(false)
            } else {
                const request_url = requestUrl()
                useLoader(request_url).then(res => setData(res.data)).catch(err => setData({ data: [] }))
            }
            onQuantityModalClose()
            onMedicineModalClose()
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
                location.reload()
            } else {
                navigate(message.redirect)
                useLoader(message.redirect).then(res => setData(res.data))
            }
        }
    }
    return (
        <Box>
            <Flex mr={3}>
                <Breadcrumb fontSize={{ base: "md", lg: '3xl' }} mt={1}>
                    <BreadcrumbItem>
                        <Link to='/medicines' color='blue.500'>
                            <Text
                                fontSize={{ base: "md", lg: '3xl' }}
                                color={outlet ? 'blue.700' : 'gray.500'}
                                ml='20px'
                            >
                                Medicines
                            </Text>
                        </Link>
                    </BreadcrumbItem>

                    {outlet && (
                        <BreadcrumbItem>
                            {medicine ? <Text fontSize={{ base: "md", lg: '3xl' }} color='#2e3149' >{medicine?.name}</Text> : <Spinner thickness='4px' />}
                        </BreadcrumbItem>
                    )
                    }

                </Breadcrumb>

                <Spacer />
                {user.role == 'administrator' || user.role == 'pharmacist' && !outlet && (
                    <Menu>
                        <MenuButton w='120px' colorScheme='blue.300' bg='blue.700' color='gray.100' as={Button} rightIcon={<ChevronDownIcon />} >
                            ADD
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={onMedicineModalOpen}>
                                <FaBriefcaseMedical />
                                <Text ml={3}>
                                    NEW MEDICINE
                                </Text>
                            </MenuItem>
                            <MenuItem onClick={onQuantityModalOpen}>
                                <GoDiffAdded />
                                <Text ml={3}>
                                    ADD QUANTITY
                                </Text>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                )}
            </Flex>
            <Box bg='white' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                {outlet ? <Outlet context={{ setMedicine, enableMedicineEditMode, user }} /> : <MedicinesTable initValue={searchParams.get('q') || ''} medicines={data?.data} search={handleSearch} count={data?.total} />}
                {
                    data && data.last_page > 1 &&
                    <Pagination pagination={data} action={handlePagination} />
                }
            </Box>

            <Modal closeOnOverlayClick={false} isOpen={isQuantityModalOpen} onClose={onQuantityModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>ADD QUANTITY</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <MedicineQuantityForm closeModal={onQuantityModalClose} closeAndRefresh={handleMedicineActions} />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal closeOnOverlayClick={false} isOpen={isMedicineModalOpen} onClose={onMedicineModalClose}>
                <ModalOverlay />
                <ModalContent maxW='700px'>
                    <ModalHeader>ADD MEDICINE</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <MedicineForm closeModal={onMedicineModalClose} closeAndRefresh={handleMedicineActions} editMode={medicineEditMode} medicine={medicine} />
                    </ModalBody>
                </ModalContent>
            </Modal>

        </Box>
    );
}

export default Medicines;