import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useOutlet, useSearchParams } from "react-router-dom";
import MedicinesTable from "../components/MedicinesTable";
import Pagination from "../components/Pagination";
import useLoader from "../hooks/useLoader";

const Medicines = () => {
    const outlet = useOutlet()
    const [data, setData] = useState(null)
    const [medicinesLoading, setMedicinesLoading] = useState(false)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTimeout, setSearchTimeout] = useState(null)

    useEffect(() => {
        if (!data && !outlet) useLoader('/medicines').then(res => setData(res.data))
    }, [outlet])

    useEffect(() => {
        if (!data && !outlet) {
            // setPatient(null)
            const request_url = requestUrl()
            useLoader(request_url).then(res => setData(res.data))
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
                useLoader('/medicines').then(res => setData(res.data))
                navigate('/medicines')
            } else {
                navigate('/medicines?q=' + e)
            }
        }, 500))
    }

    return (
        <Box>
            <Breadcrumb fontSize={{ base: "md", lg: '3xl' }}>
                <BreadcrumbItem>
                    <NavLink to='/Medicines' color='blue.500'>
                        <Text fontSize={{ base: "md", lg: '3xl' }} color='#2e3149' ml='20px'>Medicines</Text>
                    </NavLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box bg='white' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
                {outlet ? <Outlet /> : <MedicinesTable initValue={searchParams.get('q') || ''} medicines={data?.data} search={handleSearch} count={data?.total}/>}
                {
                    data && data.last_page > 1 &&
                    <Pagination pagination={data} action={handlePagination} />
                }
            </Box>
        </Box>
    );
}

export default Medicines;