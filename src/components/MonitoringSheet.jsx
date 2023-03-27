import { Badge, Box, Flex, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Center, Button, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

import "../styles/MonitoringSheet.css";

const MonitoringSheet = ({ data, openMonitoringForm, openMonitoringRow, loading, user }) => {
    const [selected, setSelected] = useState(7);
    const [currentDay, setCurrentDay] = useState(0);
    const toast = useToast();

    const formatDate = (date) => {
        let date_ = new Date(date);
        const year = date_.getUTCFullYear();
        const month = (date_.getUTCMonth() + 1).toString().padStart(2, '0'); // pad month with leading zero if less than 10
        const day = date_.getUTCDate().toString().padStart(2, '0'); // pad day with leading zero if less than 10

        return `${year}-${month}-${day}`;
    };

    const currentDateMonitoringSheet = () => {
        const currentDate = formatDate(new Date())
        console.log(currentDate)
        const currentMonitoringSheet = data.find(item => item.filling_date == currentDate);
        if (currentMonitoringSheet) {
            openMonitoringRow(currentMonitoringSheet.id);
        } else {
            toast(
                {
                    title: "No monitoring sheet for today",
                    description: "Please add a new monitoring sheet",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                }
            )
        }
    }
    return (
        <Box>
            {data && data.length > 0 ? (
                <>
                    <Box>
                        <Flex justify='flex-end' mb='15px' gap={2}>
                            {
                                user.role === 'doctor' &&
                                (
                                    <Button colorScheme='blue' onClick={
                                        () => toast({
                                            title: "TODO",
                                            description: "edit monitoring sheet to add more rows",
                                            status: "info",
                                            duration: 3000,
                                            isClosable: true,
                                        })
                                    }>
                                        Edit
                                    </Button>
                                )
                            }
                            {
                                user.role == 'nurse' &&
                                (
                                    <Button colorScheme='green' onClick={currentDateMonitoringSheet}>
                                        Apply For Today
                                    </Button>
                                )
                            }


                        </Flex>
                        <Flex justifyContent='center' gap={2}>
                            <Button
                                onClick={() => {
                                    if (currentDay - selected < 0) {
                                        setCurrentDay(0);
                                    } else {
                                        setCurrentDay(currentDay - selected);
                                    }
                                }}
                                isDisabled={currentDay === 0}
                            >
                                <AiFillCaretLeft />
                            </Button>
                            <Select w='200px' value={selected} onChange={(e) => setSelected(parseInt(e.target.value))}>
                                <option value='1'>1 Days</option>
                                <option value='7'>7 Days</option>
                                <option value='30'>30 Days</option>
                                <option value='0'>All</option>
                            </Select>
                            <Button
                                onClick={() => {
                                    if (currentDay + selected < data.length) {
                                        setCurrentDay(currentDay + selected);
                                    }
                                }}
                                isDisabled={currentDay + selected >= data.length}
                            >
                                <AiFillCaretRight />
                            </Button>
                        </Flex>
                    </Box>
                    <TableContainer p={5} gap={5}>
                        <Table mb={5} border='2px' borderColor='gray.600'>
                            <Thead>
                                <Tr>
                                    <Th border='2px' w={150}>Examination</Th>
                                    {data.slice(currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Th
                                            key={index}
                                            bg={item.filling_date == formatDate(new Date()) ? 'teal' : 'white'}
                                            color={item.filling_date == formatDate(new Date()) ? 'white' : 'black'}
                                            borderY='2px'
                                            borderColor='gray.600'
                                            textAlign='center'
                                            onClick={() => {
                                                if(user.role === 'nurse'){
                                                    openMonitoringRow(item.id);
                                                }
                                            }}
                                            _hover={{ cursor: 'pointer', bg: 'gray.100' }}
                                        >
                                            {item.filling_date}
                                            {item.filling_date == formatDate(new Date()) && <Badge ml={2} colorScheme='green'>Today</Badge>}
                                        </Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody >
                                <Tr>
                                    <Td border='2px'>urine</Td>
                                    {data.slice(currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}

                                        >
                                            {item.urine || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td border='2px'>T.A</Td>
                                    {data.slice(currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}

                                        >
                                            {item.blood_pressure || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                                {/* <Tr>
                                    <Td>PULSE</Td>
                                    {data.slice(currentDay, selected > 0 ? selected + currentDay : data.length).map((item,index) => (
                                        <Td 
                                        key={index}
                                        >
                                        {item.pulse || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr> */}
                                <Tr>
                                    <Td border='2px'>temperature</Td>
                                    {data.slice(currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}

                                        >
                                            {item.temperature || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td border='2px'>weight</Td>
                                    {data.slice(currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}
                                        >
                                            {item.weight || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                            </Tbody>
                        </Table>

                        <Table border='2px' borderColor='gray.600'>
                            <Thead>
                                <Tr>
                                    <Th w={150} border='2px'>Treatement</Th>
                                    {data.slice(currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Th
                                            key={index}
                                            bg={item.filling_date == formatDate(new Date()) ? 'teal' : 'white'}
                                            color={item.filling_date == formatDate(new Date()) ? 'white' : 'black'}
                                            borderY='2px'
                                            borderColor='gray.600'
                                        >
                                            {item.filling_date}
                                            {item.filling_date == formatDate(new Date()) && <Badge ml={2} colorScheme='green'>Today</Badge>}
                                        </Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data[0].treatments.map((item, index) => (
                                    <Tr key={index}>
                                        <Td
                                            border='2px'
                                        >
                                            {item.name}
                                        </Td>
                                        {data.slice(currentDay, selected > 0 ? selected + currentDay : data.length).map((item2, index) => (
                                            <Td
                                                key={index}
                                            >
                                                {item2.filled_by_id ? <Badge colorScheme='green'>check</Badge> : <Badge colorScheme='red'>-</Badge>}
                                            </Td>
                                        ))}

                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </>

            ) :
                loading ? (
                    <Center p='10px'>
                        <Spinner thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl' />
                    </Center>
                ) : (
                    <Box>
                        <Text textAlign='center'> Monitoring Sheet Has Not Been Created Yet</Text>
                        <Center mt={3}>
                            {user.role === 'doctor' && (
                                <Button colorScheme='blue' onClick={openMonitoringForm}>
                                    Create Now
                                </Button>
                            )}
                        </Center>
                    </Box>
                )
            }
        </Box>
    );
}

export default MonitoringSheet;