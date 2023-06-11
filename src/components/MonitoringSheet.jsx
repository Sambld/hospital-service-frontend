import { Badge, Box, Flex, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Center, Button, Spinner, useToast, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight, AiFillPrinter } from "react-icons/ai";

import styles from "../styles/MonitoringSheet.module.css";
import { BiRefresh } from "react-icons/bi";
import { IoTodayOutline } from "react-icons/io5";

import { useTranslation } from "react-i18next";

const MonitoringSheet = ({ data, treatments, medical_record, openMonitoringForm, openMonitoringEditForm, openMonitoringRow, loading, user, refresh }) => {
    const [selected, setSelected] = useState(1);
    const [currentDay, setCurrentDay] = useState(0);
    const toast = useToast();

    const { t, i18n } = useTranslation();
    const colorModeValue = useColorModeValue('white', 'gray.800')
    const colorModeValue2 = useColorModeValue('black', 'white')
    const colorModeValue3 = useColorModeValue('gray.600', 'gray.100');
    const colorModeValue4 = useColorModeValue('gray.500', 'blue.700')

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
                                        {t('medicalRecord.addMoreRows')}
                                    </Button>
                                )
                            }
                            {
                                user.role == 'nurse' && !medical_record.patient_leaving_date &&
                                (
                                    <Button colorScheme='teal' onClick={currentDateMonitoringSheet}>
                                        {t('medicalRecord.fillForToday')}
                                    </Button>
                                )
                            }
                            <Button
                                colorScheme='blue'
                                onClick={() => getToday()}
                            >
                                <IoTodayOutline fontSize={20} />
                                <Text mx={2}>
                                    {t('medicalRecord.today')}
                                </Text>
                            </Button>
                            <Button
                                colorScheme='blackAlpha'
                                bg='gray.600'
                                color='white'
                                leftIcon={<BiRefresh size={25} />}
                                onClick={refresh}
                            >
                                {t('global.refresh')}
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
                                <AiFillCaretLeft color='black' />
                            </Button>
                            <Select bg={colorModeValue} color={colorModeValue2} w='200px' value={selected} onChange={(e) => setSelected(parseInt(e.target.value))}>
                                <option value='1'>
                                    {t('global.1row')}
                                </option>
                                {/* <option value='7'>
                                    {t('global.7days')}
                                </option>
                                <option value='30'>
                                    {t('global.30days')}
                                </option> */}
                                <option value='0'>
                                    {t('global.all')}
                                </option>
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
                                <AiFillCaretRight color='black' />
                            </Button>
                        </Flex>
                    </Flex>
                    <TableContainer gap={5}>
                        <Table
                            mb={5}
                            border='2px'
                            borderColor='gray.600'
                            borderRadius="md"
                            className={styles.table}
                            __css={{ 'table-layout': 'fixed', width: selected == 0 ? 'auto' : '100%' }}
                        >
                            <Thead>
                                <Tr>
                                    <Th border='2px' borderColor={colorModeValue3} textAlign='center'>
                                        {t('medicalRecord.examinations')}
                                    </Th>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Th
                                            key={index}
                                            bg={item.filling_date == formatDate(new Date()) ? 'gray.500' : 'white'}
                                            color={item.filling_date == formatDate(new Date()) ? 'white' : 'black'}
                                            borderY='2px'
                                            borderColor={colorModeValue3}
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

                                            <Text fontSize='xs' color='green.600' fontWeight='bold'>
                                                {user.role === 'nurse' && item?.filled_by?.id == user.id && `[${t('global.edit')}]`}
                                                {user.role === 'nurse' && !item?.filled_by?.id && `[${t('global.fill')}]`}
                                                {user.role === 'doctor' && user.id == medical_record.user_id && `[${t('global.edit')}]`}
                                            </Text>

                                        </Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody >
                                <Tr>
                                    <Td border='2px' >
                                        {t('medicalRecord.urine')}
                                    </Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}
                                        >
                                            {item.urine || <Badge colorScheme='blue'>
                                                {t('global.empty')}
                                            </Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td border='2px' >
                                        {t('medicalRecord.bloodPressure')}
                                    </Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}

                                        >
                                            {item.blood_pressure || <Badge colorScheme='blue'>
                                                {t('global.empty')}
                                            </Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                                {/* <Tr>
                                    <Td>PULSE (bpm)</Td>
                                    {data.slice(selected == 0 ? 0 :currentDay, selected > 0 ? selected + currentDay : data.length).map((item,index) => (
                                        <Td 
                                        key={index}
                                        >
                                        {item.pulse || <Badge colorScheme='blue'>
                                        {t('global.empty')}
                                        </Badge>}
                                        </Td>
                                    ))}
                                </Tr> */}
                                <Tr>
                                    <Td border='2px' >
                                        {t('medicalRecord.temperature')}
                                    </Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}

                                        >
                                            {item.temperature || <Badge colorScheme='blue'>
                                                {t('global.empty')}
                                            </Badge>}
                                        </Td>
                                    ))}
                                </Tr>
                                <Tr>
                                    <Td border='2px' >
                                        {t('medicalRecord.weight')}
                                    </Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}
                                        >
                                            {item.weight || <Badge colorScheme='blue'>
                                                {t('global.empty')}
                                            </Badge>}
                                        </Td>
                                    ))}
                                </Tr>

                                <Tr>
                                    <Td border='2px'>
                                        <Text>
                                            {t('prescription.doctor').toUpperCase()}
                                        </Text>
                                    </Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}
                                        >
                                            {item?.doctor ? <Badge p={2} borderRadius='md' colorScheme="red">{item?.doctor?.first_name + " " + item?.doctor?.last_name}</Badge> : <Badge colorScheme='blue'>
                                                {t('global.empty')}
                                            </Badge>}
                                        </Td>
                                    ))}
                                </Tr>

                                <Tr>
                                    <Td border='2px'>
                                        <Text>
                                            {t('dashboard.filledBy').toUpperCase()}
                                        </Text>
                                    </Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}
                                        >
                                            {item?.filled_by ? <Badge p={2} borderRadius='md' colorScheme="blue">{item?.filled_by?.first_name + " " + item?.filled_by?.last_name}</Badge> : <Badge colorScheme='blue'>
                                                {t('global.empty')}
                                            </Badge>}
                                        </Td>
                                    ))}
                                </Tr>

                                <Tr>
                                    <Td border='2px'>
                                        <Text>
                                            {t('medicalRecord.report').toUpperCase()}
                                        </Text>
                                    </Td>
                                    {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item, index) => (
                                        <Td
                                            key={index}
                                        >
                                            {item.progress_report || <Badge colorScheme='blue'>
                                                {t('global.empty')}
                                            </Badge>}
                                        </Td>
                                    ))}
                                </Tr>


                                <Tr border='2px' bg='blue.900'>
                                    <Th py={3} color='white' fontSize={20} colSpan={selected > 0 ? selected + 1 : data.length + 1}>
                                        {t('medicalRecord.treatments')}
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
                                            p={0}
                                        >
                                                {typeof item === 'object' ? (item.name) : item}
                                        </Td>

                                        {data.slice(selected == 0 ? 0 : currentDay, selected > 0 ? selected + currentDay : data.length).map((item2, index) => (
                                            <Td
                                                key={index}
                                            >
                                                {item2?.filled_by_id ?
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
                        <Text textAlign='center'>
                            {t('medicalRecord.noMonitoringSheet')}
                        </Text>
                        <Center mt={3}>
                            {user.role == 'doctor' &&
                                !medical_record?.patient_leaving_date &&
                                (
                                    <Button colorScheme='blue' onClick={openMonitoringForm}>
                                        {t('medicalRecord.createNow')}
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