import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NavLink, useOutlet } from "react-router-dom";
import MedicinesTable from "../components/MedicinesTable";
import useLoader from "../hooks/useLoader";

const Medicines = () => {
    const outlet = useOutlet()
    const [data, setData] = useState(null)

    // useEffect(() => {
    //     if (!data && !outlet) useLoader('').then(res => setData(res))
    //     if (!outlet) setPatient(null)
    // }, [outlet])
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
                {outlet ? <Outlet /> : <MedicinesTable medicines={data} />}
            </Box>
        </Box>
    );
}

export default Medicines;