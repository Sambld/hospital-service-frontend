import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    Input,
    Select,
    Spacer,
    Spinner,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
    Breadcrumb,
    BreadcrumbItem,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    ArcElement,
    Legend,
} from 'chart.js';
import { useState } from "react";
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { BiRefresh, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsTable } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import useLoader from "../hooks/useLoader";
import { useEffect } from "react";
import { useOutletContext, NavLink } from "react-router-dom";
import AsyncSelect from 'react-select/async';

// Translation
import { useTranslation } from "react-i18next";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const StatisticsItems = (user) => {
    let items = [];
    try {
        if (user.role === 'doctor') {
            items.push([['Patient', 'pt'], ['gender']]);
            items.push([['Medical Record', 'mr'], ['Inpatient', 'Outpatient', 'Diagnosis']]);
        } else if (user.role === 'nurse') {
            items.push([['Patient', 'pt'], ['gender']]);
            items.push([['Medical Record', 'mr'], ['Inpatient', 'Outpatient', 'Diagnosis']]);
            items.push([['Monitoring Sheet', 'ms'], ['Filled']]);
        } else if (user.role === 'pharmacist') {
            items.push([['Medicines', 'md'], ['Quantity']]);
        }

        return items;
    } catch { return items; }
}

const Statistics = () => {
    const user = useOutletContext();

    // Data
    const [TimeType, setTimeType] = useState(['day', 'week', 'month', 'year']);
    const [statisticsType, setStatisticsType] = useState(StatisticsItems(user));
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [IsChart, setIsChart] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [FromDate, setFromDate] = useState('');
    const [ToDate, setToDate] = useState('');

    const [CurrentTimeType, setCurrentTimeType] = useState('week');
    const [CurrentStatisticsType, setCurrentStatisticsType] = useState(statisticsType[0][0][1]);
    const [CurrentSubStatisticsType, setCurrentSubStatisticsType] = useState(statisticsType[0][1][0]);

    const toast = useToast();

    const { t, i18n } = useTranslation();

    const colorModeValue1 = useColorModeValue('gray.500', 'gray.200');
    const colorModeValue2 = useColorModeValue('gray.500', 'gray.50');
    const colorModeValue3 = useColorModeValue('white', 'gray.900');
    const colorModeValue4 = useColorModeValue('white', 'gray.800');
    const colorModeValue5 = useColorModeValue("#757575", 'white');
    const colorModeValue6 = useColorModeValue('gray.200', 'gray.700');
    const colorModeValue7 = useColorModeValue("white", "gray.50");
    const colorModeValue8 = useColorModeValue("white", "gray.900");
    const colorModeValue9 = useColorModeValue("blue", "gray");
    const colorModeValue10 = useColorModeValue("blue.500", "blue.900");
    const colorModeValue11 = useColorModeValue("gray.500", "gray.900");
    const colorModeValue12 = useColorModeValue("blue.900", "gray.200");
    const colorModeValue13 = useColorModeValue("white", "gray.500");
    const colorModeValue14 = useColorModeValue("blue.900", "gray.50");
    const colorModeValue15 = useColorModeValue("gray.500", "gray.50")

    useEffect(() => {
        setData(null);
        refresh();
    }, [CurrentStatisticsType, CurrentSubStatisticsType, selectedMedicine]);

    useEffect(() => {
        refresh();
    }, [CurrentTimeType]);


    const refresh = () => {
        setLoading(true);
        handleStatisticsType();
    }

    const changeFormat = (date) => {
        let date_ = new Date(date)
        return date_.getUTCFullYear() + '-' + (date_.getUTCMonth() + 1) + '-' + date_.getUTCDate();
    }

    const formatDate = (date, separator) => {
        let date_ = new Date(date);
        const year = date_.getUTCFullYear();
        const month = (date_.getUTCMonth() + 1).toString().padStart(2, '0'); // pad month with leading zero if less than 10
        const day = date_.getUTCDate().toString().padStart(2, '0'); // pad day with leading zero if less than 10
        // const hours = date_.getUTCHours().toString().padStart(2, '0'); // pad hours with leading zero if less than 10
        // const minutes = date_.getUTCMinutes().toString().padStart(2, '0'); // pad minutes with leading zero if less than 10
        // const seconds = date_.getUTCSeconds().toString().padStart(2, '0'); // pad seconds with leading zero if less than 10
        return `${year}${separator || '-'}${month}${separator || '-'}${day}`;
    };

    const handleStatisticsType = (choosenDate = null) => {
        switch (CurrentStatisticsType) {
            case 'pt':
                handlePatient(choosenDate || selectedDate);
                break;
            case 'mr':
                handleMedicalRecord(choosenDate || selectedDate);
                break;
            case 'ms':
                handleMonitoringSheet(choosenDate || selectedDate);
                break;
            case 'md':
                handleMedicines(choosenDate || selectedDate);
                break;
            default:
                handlePatient(choosenDate || selectedDate);
                break;
        }
    }

    const handlePatient = (choosenDate) => {
        useLoader(`/patients/statistics?of=gender&type=${CurrentTimeType}&selectedDate=${changeFormat(choosenDate)}`)
            .then((res) => {
                calculatePiePercentage(handleMessingDateOfData(res, choosenDate));
            })
            .catch((err) => {
                showToast('Error', err?.response?.data?.message, 'error');
            })
            .finally(() => {
                setLoading(false);
            })
    }


    const handleMedicalRecord = (choosenDate) => {
        useLoader(`/medical-records/statistics?of=${CurrentSubStatisticsType}&type=${CurrentTimeType}&selectedDate=${changeFormat(choosenDate)}`)
            .then((res) => {
                calculatePiePercentage(handleMessingDateOfData(res, choosenDate));
                setLoading(false);
            })
            .catch((err) => {
                showToast('Error', err?.response?.data?.message, 'error');
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleMonitoringSheet = (choosenDate) => {
        useLoader(`/monitoring-sheets/statistics?of=${CurrentSubStatisticsType}&type=${CurrentTimeType}&selectedDate=${changeFormat(choosenDate)}`)
            .then((res) => {
                calculatePiePercentage(handleMessingDateOfData(res, choosenDate));
                setLoading(false);
            })
            .catch((err) => {
                showToast('Error', err?.response?.data?.message, 'error');
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleMedicines = (choosenDate) => {
        if (selectedMedicine) {
            useLoader(`/medicines/statistics?of=${CurrentSubStatisticsType}&type=${CurrentTimeType}${selectedMedicine?.value ? `&id=${selectedMedicine?.value}` : ''}&selectedDate=${changeFormat(choosenDate)}`)
                .then((res) => {
                    calculatePiePercentage(handleMessingDateOfData(res, choosenDate));
                    setLoading(false);
                })
                .catch((err) => {
                    showToast('Error', err?.response?.data?.message, 'error');
                    setLoading(false);
                })
                .finally(() => {
                    setLoading(false);
                })
        } else {
            setLoading(false);
        }
    }

    const showToast = (title, description, status) => {
        toast({
            title: title,
            description: description,
            status: status,
            duration: 3000,
            isClosable: true,
        })
    }

    const changeSelectedDate = (move, date = null) => {
        let newSelectedDate = new Date(selectedDate);
        if (move == 'today') newSelectedDate = new Date();
        else if (move == 'date') {
            newSelectedDate = new Date(date);
        } else {
            switch (CurrentTimeType) {
                case 'day':
                    move === 'next' ? newSelectedDate.setDate(newSelectedDate.getDate() + 1) : newSelectedDate.setDate(newSelectedDate.getDate() - 1);
                    break;
                case 'week':
                    move === 'next' ? newSelectedDate.setDate(newSelectedDate.getDate() + 7) : newSelectedDate.setDate(newSelectedDate.getDate() - 7);
                    break;
                case 'month':
                    move === 'next' ? newSelectedDate.setMonth(newSelectedDate.getMonth() + 1) : newSelectedDate.setMonth(newSelectedDate.getMonth() - 1);
                    break;
                case 'year':
                    move === 'next' ? newSelectedDate.setFullYear(newSelectedDate.getFullYear() + 1) : newSelectedDate.setFullYear(newSelectedDate.getFullYear() - 1);
                    break;
                default:
                    setSelectedDate(new Date());
                    break;
            }
        }
        setSelectedDate(newSelectedDate);
        setLoading(true);
        handleStatisticsType(newSelectedDate);

    }

    const handleMessingDateOfData = (chartData, choosenDate) => {
        const labels = chartData.lineChart.labels;
        const datasets = chartData.lineChart.datasets;



        let stepSize, unit;
        switch (CurrentTimeType) {
            case 'day':
                stepSize = 1;
                unit = 'Date';
                break;
            case 'week':
                stepSize = 8;
                unit = 'UTCDate';
                break;
            case 'month':
                stepSize = 30;
                unit = 'Month';
                break;
            case 'year':
                stepSize = 12;
                unit = 'FullYear';
                break;
            default:
                throw new Error(`Invalid type: ${type}`);
        }

        let tomorrow = new Date(choosenDate);

        const allDates = [];
        let currentDate = new Date(tomorrow);

        for (let i = 0; i < stepSize; i++) {
            if (unit == "FullYear") {
                allDates.unshift(currentDate.toISOString().substring(0, 7));
                currentDate.setMonth(currentDate.getMonth() - 1);
            } else {
                allDates.unshift(currentDate.toISOString().substring(0, 10));
                currentDate.setDate(currentDate.getDate() - 1);
            }
        }

        // Create an object to keep track of the data points we have
        const dataPointsTemp = {};
        for (let i = 0; i < datasets.length; i++) {
            const dataset = datasets[i];
            const label = dataset.label;
            const data = dataset.data;
            for (let j = 0; j < labels.length; j++) {
                const date = labels[j];
                const count = data[j];
                if (!dataPointsTemp[date]) {
                    dataPointsTemp[date] = {};
                }
                dataPointsTemp[date][label] = count;
            }
        }

        // merge the dataPoints with same AllDates
        const dataPoints = {};
        if (unit == "FullYear") {
            for (const label in dataPointsTemp) {
                const date = label.substring(0, 7);
                if (!dataPoints[date]) {
                    dataPoints[date] = dataPointsTemp[label];
                } else if (dataPoints[date]) {
                    for (const key in dataPointsTemp[label]) {
                        if (dataPoints[date][key]) {
                            dataPoints[date][key] += dataPointsTemp[label][key];
                        } else {
                            dataPoints[date][key] = dataPointsTemp[label][key];
                        }
                    }
                }
            }
        } else {
            // make dataPointsTemp to dataPoints
            for (const label in dataPointsTemp) {
                dataPoints[label] = dataPointsTemp[label];
            }
        }
        // Fill in missing data points with zeros
        for (let i = 0; i < allDates.length; i++) {
            const date = allDates[i];
            if (!dataPoints[date]) {
                dataPoints[date] = {};
            }
            for (let j = 0; j < datasets.length; j++) {
                const label = datasets[j].label;
                if (!dataPoints[date][label]) {
                    dataPoints[date][label] = 0;
                }
            }
        }

        // Convert the data points object back to the original format
        const labelNames = datasets.map((dataset) => dataset.label);
        const newLabels = [];
        const newDataCounts = Array.from({ length: labelNames.length }, () => []);
        for (let i = 0; i < allDates.length; i++) {
            const date = allDates[i];
            newLabels.push(date);
            for (let j = 0; j < labelNames.length; j++) {
                const label = labelNames[j];
                newDataCounts[j].push(dataPoints[date][label] || 0);
            }
        }

        // Update the chartData object with the new data
        chartData.lineChart.labels = newLabels;
        for (let i = 0; i < labelNames.length; i++) {
            chartData.lineChart.datasets[i].data = newDataCounts[i];
        }

        return chartData;
    }

    const calculatePiePercentage = (data) => {
        try {
            let total = 0;
            data.pieChart.datasets[0].data.forEach((item) => {
                total += item;
            })
            data.pieChart.datasets[0]['percentage'] = [];

            data.pieChart.datasets[0].data.forEach((item, index) => {
                data.pieChart.datasets[0].percentage.push((item == 0) ? 0 : Math.round((item / total) * 100));
            })

            
        } catch (e) {
            console.log(e)
        } finally {
            setData(data);
        }

        
    }

    const loadOptions = (inputValue, callback) => {
        if (options.length > 0) {
            callback(
                options.filter((i) =>
                    i.label.toLowerCase().includes(inputValue.toLowerCase())
                )
            )
        } else {
            useLoader(`/medicines?q=${inputValue}&np`).then((res) => {
                const options = res.data.map((medicine) => ({
                    value: medicine.id,
                    label: medicine.name,
                    old_quantity: medicine.quantity,
                }));
                setOptions(options);
                callback(options);
            })
        }

    };

    return (
        <Box>
            <Box mb={5} mt={1}>
                <Breadcrumb fontSize={{ base: "md", lg: '3xl' }}>
                    <BreadcrumbItem>
                        <Text color={colorModeValue1} fontSize={{ base: "md", lg: '3xl' }} ml='20px'>
                            {t('statistics.statistics')}
                        </Text>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Box>

            <Grid templateColumns={{ base: '1fr', xl: "repeat(3, 1fr)" }} gap={5}>
                <GridItem w='100%' colSpan={2} >
                    <Flex overflow='hidden' pl={5} justifyContent='space-between'>
                        <Flex color={colorModeValue2} bg={colorModeValue3} borderTopRadius="10px" p={3} mb={0} boxShadow="md" gap={2}>
                            <Select
                                w='200px'
                                variant='filled'
                                value={CurrentStatisticsType}
                                onChange={
                                    (e) => {
                                        setCurrentStatisticsType(e.target.value)
                                        setCurrentSubStatisticsType(statisticsType.filter((item) => item[0][1] === e.target.value)[0][1][0])
                                    }
                                }
                            >
                                {statisticsType.map((item, index) => (
                                    <option key={index} value={item[0][1]}>{t("statistics." + item[0][1].toLowerCase())}</option>
                                ))}
                            </Select>
                            <Select
                                w='250px'
                                variant='filled'
                                value={CurrentSubStatisticsType}
                                onChange={(e) => setCurrentSubStatisticsType(e.target.value)}
                            >
                                {statisticsType.map((item, index) => {
                                    if (item[0][1] === CurrentStatisticsType) {
                                        return item[1].map((subItem, subIndex) => (
                                            <option key={subIndex} value={subItem}>{t("statistics." + subItem.toLowerCase())}</option>
                                        ))
                                    }
                                })}
                            </Select>
                        </Flex>
                        <Box>
                            <Button
                                mr={2}
                                bg={colorModeValue4}
                                borderRadius="10px"
                                p={3}
                                mb={0}
                                boxShadow="md"
                                onClick={refresh}
                                isLoading={loading}
                            >
                                <Icon as={BiRefresh} color={colorModeValue1} />
                            </Button>
                            <Button
                                mr={2}
                                bg={colorModeValue4}
                                borderRadius="10px"
                                p={3}
                                mb={0}
                                boxShadow="md"
                                isDisabled={!IsChart}
                                onClick={() => setIsChart(false)}
                            >
                                <Icon as={BsTable} color={colorModeValue1} />
                            </Button>
                            <Button
                                mr={2}
                                bg={colorModeValue4}
                                borderRadius="10px"
                                p={3}
                                mb={0}
                                boxShadow="md"
                                isDisabled={IsChart}
                                onClick={() => setIsChart(true)}
                            >
                                <Icon as={FiBarChart2} color={colorModeValue1} />
                            </Button>


                        </Box>
                    </Flex>
                    {CurrentStatisticsType === 'md' && (
                        <Box display='flex' flexDir='column' gap={3} p={2} bg='white'>
                            <AsyncSelect
                                placeholder="Select Medicines"
                                name='medicineSearch'
                                loadOptions={loadOptions}
                                value={selectedMedicine}
                                onChange={(value) => setSelectedMedicine(value)}
                                defaultOptions
                                zIndex={2}
                            />
                        </Box>
                    )}
                    <Box display='flex' justifyContent='flex-start' alignItems='center' gap={2} p={2} bg={colorModeValue3} borderTopRadius={CurrentStatisticsType === 'md' ? 0 : '10px'}>
                        <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                            p={2}
                            border='1px solid'
                            borderColor={colorModeValue6}
                            borderRadius='10px'
                            color={colorModeValue1}
                            boxShadow='md'
                            cursor='pointer'
                            _hover={{ bg: colorModeValue4 }}
                            onClick={() => changeSelectedDate('today')}
                        >
                            Today
                        </Box>
                        <Button
                            onClick={() => changeSelectedDate('prev')}
                            borderRadius="10px"
                            p={3}
                            mb={0}
                            boxShadow="md"
                            bg={colorModeValue4}
                            border='1px solid'
                            borderColor={colorModeValue13}
                        >
                            <Icon
                                as={BiChevronLeft}
                                color={colorModeValue1}
                                fontSize='20px' />
                        </Button>
                        <Button
                            onClick={() => changeSelectedDate('next')}
                            borderRadius="10px"
                            p={3}
                            mb={0}
                            boxShadow="md"
                            bg={colorModeValue4}
                            border='1px solid'
                            borderColor={colorModeValue13}
                        >
                            <Icon
                                as={BiChevronRight}
                                color={colorModeValue1}
                                fontSize='20px' />
                        </Button>
                        <Spacer />

                        <Input
                            type='date'
                            p={2}
                            border='1px solid'
                            borderColor={colorModeValue13}
                            borderRadius='10px'
                            color={colorModeValue1}
                            cursor='pointer'
                            _hover={{ bg: colorModeValue4 }}
                            onChange={(e) => changeSelectedDate('date', e.target.value)}
                            value={formatDate(selectedDate)}
                            w='160px'
                        />
                    </Box>
                    <Box maxH='450px' w='100%' bg={colorModeValue3} borderBottomRadius="10px" p={5} boxShadow="md" zIndex={5} overflow='auto'>
                        {data ? IsChart ? (
                            <Bar
                                data={{
                                    labels: [...data?.lineChart?.labels || []],
                                    datasets: [
                                        ...data?.lineChart?.datasets || []
                                    ],
                                }}
                                height={450}
                                width={600}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            suggestedMax: 10,
                                            stepSize: 1,
                                            unit: 1,
                                            ticks: {
                                                color: colorModeValue5
                                            }
                                        },
                                        x: {
                                            ticks: {
                                                color: colorModeValue5
                                            }
                                        }
                                    },

                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        tooltips: {
                                            enabled: false
                                        },
                                        title: {
                                            display: false,
                                        },

                                    },
                                }}
                            />
                        ) : (
                            <Box borderRadius="10px" p={0} mb={0} boxShadow="md" zIndex={4} overflow='auto' color={colorModeValue1} border='1px' borderColor={colorModeValue6}>
                                <Table variant="simple" size="md">
                                    <Thead>
                                        <Tr>
                                            <Th color='white' bg='gray.500' >
                                                {t('global.day')}
                                            </Th>
                                            {data?.lineChart?.datasets.map((item, index) => (
                                                <Th key={index} bg={item.backgroundColor} color='white' >
                                                    <Text textShadow='2px 2px 8px #000'
                                                    >
                                                        {item.label}
                                                    </Text>
                                                </Th>
                                            ))}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data?.lineChart?.labels.map((item, index) => (
                                            <Tr key={index}>
                                                <Td color='white' bg='gray.500' >
                                                    {item}
                                                </Td>
                                                {data?.lineChart?.datasets.map((subItem, subIndex) => (
                                                    <Td key={subIndex} >
                                                        {subItem.data[index]}
                                                    </Td>
                                                ))}
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : loading ? (
                            <Center>
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="gray.500"
                                    size="xl"
                                />
                            </Center>
                        ) : (
                            <Box>
                                <Text textAlign='center' fontSize={20} color='gray.500'>
                                    {t('global.noData')}
                                </Text>
                            </Box>
                        )}
                    </Box>
                    <Box w='100%' mt={5} display='flex' flexWrap='wrap' justifyContent='center' alignItems='center' gap={5}>
                        {/* {data && (
                            <Box
                                p={5}
                                boxShadow='md'
                                borderWidth="1px"
                                bgGradient='linear(to-l, #d01414, #803535)'
                                bg='gray.500'
                                color='white'
                                borderRadius='xl'
                                flexBasis='30%'
                            >
                                <Heading size="md" textShadow='2px 2px 8px #000'>
                                    {data?.lineChart?.totalCount ? 'Total Count' : '...'}
                                </Heading>
                                <Box p={5} display='flex' alignItems='center' justifyContent='flex-end'>
                                    {loading ? <Spinner /> : <Text textShadow='2px 2px 8px #000' textAlign='right' fontSize={40}>{data?.lineChart?.totalCount}</Text>}
                                </Box>


                            </Box>
                        )} */}
                        {data && data?.pieChart?.labels && data?.pieChart?.labels.length > 1 && (
                            data?.pieChart?.labels.map((item, index) => (
                                <Box
                                    key={index}
                                    p={5}
                                    boxShadow='md'
                                    borderWidth="1px"
                                    bg={data?.pieChart?.datasets[0].backgroundColor[index]}
                                    color='white'
                                    borderRadius='xl'
                                    flexBasis='30%'
                                >
                                    <Heading size="md" textShadow='2px 2px 8px #000'>
                                        {item}
                                    </Heading>
                                    <Box p={5} display='flex' alignItems='center' justifyContent='flex-end'>
                                        {loading ? <Spinner /> : <Text textShadow='2px 2px 8px #000' textAlign='right' fontSize={40}>{data?.pieChart?.datasets[0].data[index]}</Text>}
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>

                </GridItem>
                <GridItem colSpan={1}>
                    <Flex w="100%" p={0} flexDirection="column">
                        <Box p={2} color={colorModeValue7} bg={colorModeValue8} boxShadow="md" borderRadius="10px" overflow="hidden" mb={5}>
                            <Flex justifyContent='center' borderRadius="10px" overflow="hidden">
                                {/* <Button isDisabled={TimeType == 'day'} w='100%' bg='gray.500' variant="solid" size="md" borderRadius={0}>Day</Button> */}
                                {TimeType.map((item, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => setCurrentTimeType(item)}
                                        colorScheme={colorModeValue9}
                                        w='100%'
                                        color={colorModeValue7}
                                        bg={item == CurrentTimeType ? colorModeValue10 : colorModeValue11}
                                        variant="solid"
                                        size="md"
                                        borderRadius={0}
                                    >
                                        {t('global.' + item)}
                                    </Button>
                                ))}
                            </Flex>
                            {showFilter &&
                                <Flex mt={2} p={2} gap={2}>
                                    <Box w='100%' display='flex' flexDirection='column' gap={2} color={colorModeValue12}>
                                        <Box w='100%' display='flex' flexDirection='column' alignItems='center' gap={2}>
                                            <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                                                <Text w='70px'>{t('medicalRecord.from')}:</Text>
                                                <Input
                                                    type='date'
                                                    bg={colorModeValue13}
                                                />
                                            </Box>
                                            <Divider orientation='vertical' />
                                            <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                                                <Text w='70px'>{t('medicalRecord.to')}:</Text>
                                                <Input
                                                    type='date'
                                                    bg={colorModeValue13}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Flex>
                            }
                            {/* <Flex
                                justifyContent='center'
                                alignItems='center'
                                border='2px'
                                borderColor='gray.500'
                                borderRadius='10px'
                                bg='gray.500'
                                p={1}
                                mt={5}
                                mb={1}
                                cursor='pointer'
                                gap={2}
                                onClick={() => setShowFilter(!showFilter)}
                            >
                                <Text
                                    fontSize={15}
                                    fontWeight="bold"
                                    color="gray.200"
                                >
                                    {showFilter ? 'Hide ' : "More Details"}
                                </Text>
                                <Icon as={showFilter ? AiOutlineArrowUp : AiOutlineArrowDown} w={4} h={4} color="gray.200" />
                            </Flex> */}
                        </Box>

                        {data && data?.pieChart && data?.pieChart?.labels.length > 1 ? (
                            <Flex bg={colorModeValue8} color={colorModeValue14} borderRadius="10px" p={5} boxShadow="md" justifyContent='center' alignItems='center' flexDirection='column'>
                                <Text fontSize={20} fontWeight="bold" color={colorModeValue15}>
                                    {t('statistics.totalCount')}
                                </Text>
                                {loading ? <Spinner color={colorModeValue15} m='18px' /> : <Text color={colorModeValue15} fontSize={40} fontWeight="bold">{data?.lineChart?.totalCount}</Text>}

                                <Divider mb={2} />
                                <Doughnut
                                    data={{
                                        labels: [...data?.pieChart?.labels],
                                        datasets: [
                                            ...data?.pieChart?.datasets
                                        ],
                                    }}
                                    height={300}
                                    width={400}
                                    options={{
                                        responsive: false,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltips: {
                                                enabled: false
                                            }
                                        },
                                    }}
                                />
                                <Flex w='100%' justifyContent='center' alignItems='center' mt={5} flexDirection='column'>
                                    {data?.pieChart?.datasets[0].percentage.map((item, index) => (
                                        <Box key={index} w='100%' display='flex' gap={2} justifyContent='center' alignItems='center' p={2}>
                                            <Box w='20px' h='20px' bg={data?.pieChart?.datasets[0].backgroundColor[index]} borderRadius='50%' />
                                            <Text>{data?.pieChart?.labels[index]}: </Text>
                                            <Text>{data?.pieChart?.datasets[0].data[index]}</Text>
                                            <Text>({item}%)</Text>
                                        </Box>


                                    ))}
                                </Flex>

                            </Flex>
                        ) : !loading ? (
                            <Box
                                p={2}
                                boxShadow='md'
                                borderWidth="1px"
                                bgGradient='linear(to-l, #d01414, #803535)'
                                bg='gray.500'
                                color='white'
                                borderRadius='xl'
                                textAlign='center'
                            >
                                <Text fontSize={20} fontWeight="bold">
                                    {t('statistics.totalCount')}
                                </Text>
                                {loading ? <Spinner m='15px' /> : <Text fontSize={40} fontWeight="bold">{data?.lineChart?.totalCount}</Text>}
                                {/* <Heading size="md" textShadow='2px 2px 8px #000' textAlign='center'>
                                    {data?.lineChart?.totalCount ? 'Total Count' : '...'}
                                </Heading>
                                <Box p={2} display='flex' alignItems='center' justifyContent='center'>
                                    {loading ? <Spinner /> : <Text textShadow='2px 2px 8px #000' textAlign='center' fontSize={40}>{data?.lineChart?.totalCount}</Text>}
                                </Box> */}


                            </Box>
                        ) : null}


                    </Flex>
                </GridItem>

            </Grid>
        </Box>
    );
}

export default Statistics;