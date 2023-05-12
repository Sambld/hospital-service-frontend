import { Badge, Box, Flex, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Center, Button, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight, AiFillPrinter } from "react-icons/ai";

import styles from "../styles/MonitoringSheet.module.css";
import { BiRefresh } from "react-icons/bi";
import { IoTodayOutline } from "react-icons/io5";

const MonitoringSheet = ({ data, treatments, medical_record, openMonitoringForm, openMonitoringEditForm, openMonitoringRow, loading, user, refresh }) => {
    const [selected, setSelected] = useState(1);
    const [currentDay, setCurrentDay] = useState(0);
    const toast = useToast();

    useEffect(() => {
        getToday();
    }, [data]);


    const formatDate = (date) => {
        let date_ = new Date(date);
        const year = date_.getUTCFullYear();
        const month = (date_.getUTCMonth() + 1).toString().padStart(2, '0'); // pad month with leading zero if less than 10
        const day = date_.getUTCDate().toString().padStart(2, '0'); // pad day with leading zero if less than 10

        return `${year}-${month}-${day}`;
    };

    const getToday = () => {
        if (data && data.length > 0) {
            const today = formatDate(new Date());
            const todayIndex = data.findIndex(item => formatDate(item.filling_date) == today);
            const diffDays = todayIndex == -1 ? 0 : todayIndex;
            setCurrentDay(diffDays);
        }
    }
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

    const handleAddMoreRows = () => {
        let date = new Date(data[data.length - 1].filling_date);
        console.log(date)
        date.setDate(date.getDate() + 1);
        openMonitoringEditForm(date)
    }
    return (
        <Box>
            {data && data.length > 0 ? (
                <>
                    <Flex
                        justifyContent='space-between'
                        bg='blue.600'
                        p={2}
                        borderTopRadius='md'
                    >
                        <Flex justify='flex-start' gap={2}>
                            {
                                user.role === 'doctor' && !medical_record.patient_leaving_date &&
                                (
                                    <Button colorScheme='gray' onClick={handleAddMoreRows}>
                                        Add More Rows
                                    </Button>
                                )
                            }
                            {
                                user.role == 'nurse' && !medical_record.patient_leaving_date &&
                                (
                                    <Button colorScheme='teal' onClick={currentDateMonitoringSheet}>
                                        Apply For Today
                                    </Button>
                                )
                            }
                            <Button
                                colorScheme='blue'
                                onClick={() => getToday()}
                            >
                                <IoTodayOutline fontSize={20} />
                                <Text ml={2}>Today</Text>
                            </Button>
                            <Button
                                colorScheme='blackAlpha'
                                bg='gray.600'
                                leftIcon={<BiRefresh size={25} />}
                                onClick={refresh}
                            >
                                Refresh
                            </Button>

                        </Flex>
                        <Flex justifyContent='center' gap={2} >
                            <Button
                                bg='white'
                                onClick={() => {
                                    if (currentDay - selected < 0) {
                                        setCurrentDay(0);
                                    } else {
                                        setCurrentDay(currentDay - selected);
                                    }
                                }}
                                isDisabled={selected == 0 || currentDay === 0}
                            >
                                <AiFillCaretLeft />
                            </Button>
                            <Select bg='white' w='200px' value={selected} onChange={(e) => setSelected(parseInt(e.target.value))}>
                                <option value='1'>1 Days</option>
                                <option value='7'>7 Days</option>
                                <option value='30'>30 Days</option>
                                <option value='0'>All</option>
                            </Select>
                            <Button
                                bg='white'
                                onClick={() => {
                                    if (currentDay + selected < data.length) {
                                        setCurrentDay(currentDay + selected);
                                    }
                                }}
                                isDisabled={selected == 0 || currentDay + selected >= data.length}
                            >
                                <AiFillCaretRight />
                            </Button>
                        </Flex>
                    </Flex>
                    <TableContainer gap={5}>
                        <Table mb={5} border='2px' borderColor='gray.600' borderRadius="md" className={styles.table}>
                            <Thead>
                                <Tr>
                                    <Th border='2px' w='150px'>Examination</Th>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Th
                                            key={index}
                                            bg={item.filling_date == formatDate(new Date()) ? 'gray.500' : 'white'}
                                            color={item.filling_date == formatDate(new Date()) ? 'white' : 'black'}
                                            borderY='2px'
                                            borderColor='gray.600'
                                            textAlign='center'
                                            onClick={() => {
                                                if (user.role === 'nurse' || user.role === 'doctor') {
                                                    openMonitoringRow(item.id);
                                                }
                                            }}
                                            _hover={{ cursor: 'pointer', bg: 'gray.400' }}

                                        >
                                            {item.filling_date}
                                            {item.filling_date == formatDate(new Date()) && ' (today)'}
                                        </Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody >
                                <Tr>
                                    <Td border='2px'>urine (ml)</Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}
                                        >
                                            {item.urine || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td border='2px'>T.A (mmHg)</Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}

                                        >
                                            {item.blood_pressure || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                                {/* <Tr>
                                    <Td>PULSE (bpm)</Td>
                                    {data.slice(selected == 0 ? 0 :currentDay, selected > 0 ? selected + currentDay : data.length).map((item,index) => (
                                        <Td 
                                        key={index}
                                        >
                                        {item.pulse || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr> */}
                                <Tr>
                                    <Td border='2px'>temperature (°C)</Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}

                                        >
                                            {item.temperature || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td border='2px'>weight (kg)</Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}
                                        >
                                            {item.weight || <Badge colorScheme='blue'>empty</Badge>}
                                        </Td>
                                    ))}
                                </Tr>


                                <Tr border='2px' bg='blue.900'>
                                    <Th py={3} color='white' fontSize={20} colSpan={selected > 0 ? selected + 1 : data.length + 1}>
                                        Treatments
                                    </Th>
                                    {/* {data.slice(selected == 0 ? 0 :currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
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
                                    ))} */}

                                </Tr>
                                {treatments && (selected == 1 ? data[currentDay].treatments : treatments).map((item, index) => (
                                    <Tr key={index}>
                                            <Td
                                                border='2px'
                                            >
                                                {typeof item === 'object' ? (item.name) : item}
                                            </Td>

                                        {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item2, index) => (
                                            <Td
                                                key={index}
                                            >
                                                {item2.filled_by_id ?
                                                    item2.treatments && item2.treatments.some((treatment) => treatment.name === (typeof item === 'object' ? (item.name) : item)) ? <Badge colorScheme='green'>check</Badge> : <Badge colorScheme='red'>-</Badge>
                                                    :
                                                    <Badge colorScheme='blue'>-</Badge>
                                                }
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
                        <Spinner thickness='5px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='gray.500'
                            size='md' />
                    </Center>
                ) : (
                    <Box>
                        <Text textAlign='center'> Monitoring Sheet Has Not Been Created Yet</Text>
                        <Center mt={3}>
                            {user.role === 'doctor' &&
                                !medical_record?.state_upon_exit &&
                                medical_record?.user_id === user.id &&
                                (
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