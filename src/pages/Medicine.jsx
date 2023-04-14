import { Box, Center, Divider, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import useLoader from "../hooks/useLoader";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Medicine = () => {
    const { id } = useParams()
    const [medicine, setMedicine] = useState(null)

    const [loading, setLoading] = useState(false)
    const [NotFound, setNotFound] = useState(false)
    const [Errorhappen, setErrorhappen] = useState(false)

    const toast = useToast()

    useEffect(() => {
        getMedicine()
    }, [])

    const getMedicine = () => {
        setLoading(true)
        useLoader(`/medicines/${id}`).then(res => {
            setMedicine(res.data)
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
                    <Stack spacing={4}>
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
                            <Text>{medicine.description}</Text>
                        </Box>
                        <Divider />
                        <Box>
                            <Text fontSize="lg" fontWeight="bold">
                                Price
                            </Text>
                            <Text>${medicine.price}</Text>
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
        </Box>
    );
}

export default Medicine;