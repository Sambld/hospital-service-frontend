import { Box, Button, Divider, Flex, Grid, GridItem, Heading, Icon, Input, Select, Spacer, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from "@chakra-ui/react";
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
import { BiRefresh } from "react-icons/bi";
import { BsTable } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import useLoader from "../hooks/useLoader";
import { useEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const Statistics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [IsChart, setIsChart] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [FromDate, setFromDate] = useState('');
    const [ToDate, setToDate] = useState('');

    const [CurrentTimeType, setCurrentTimeType] = useState('week');
    const [CurrentStatisticsType, setCurrentStatisticsType] = useState('pt');
    const [CurrentSubStatisticsType, setCurrentSubStatisticsType] = useState('gender')

    const toast = useToast();


    // Data
    const [TimeType, setTimeType] = useState(['day', 'week', 'month', 'year']);
    const [statisticsType, setStatisticsType] = useState([
        [['Patient', 'pt'], ['gender']],
        [['Medical Record', 'mr'], ['Inpatient', 'Outpatient', 'Diagnosis']],
        [['Monitoring Sheet', 'ms'], ['status']],
        [['Medicines', 'md'], ['used']]
    ])

    useEffect(() => {
        refresh();
    }, [CurrentTimeType, CurrentStatisticsType, CurrentSubStatisticsType])

    const refresh = () => {
        handleStatisticsType();
    }

    const handleStatisticsType = () => {
        switch (CurrentStatisticsType) {
            case 'pt':
                handlePatient();
                break;
            case 'mr':
                handleMedicalRecord();
                break;
            case 'ms':
                handleMonitoringSheet();
                break;
            case 'md':
                handleMedicines();
                break;
            default:
                handlePatient();
                break;
        }
    }

    const handlePatient = () => {
        setLoading(true);
        useLoader(`/patients/statistics?of=gender&type=${CurrentTimeType}`)
            .then((res) => {
                calculatePiePercentage(handleMessingDateOfData(res));
                setLoading(false);
            })
            .catch((err) => {
                showToast('Error', err.response.data.message, 'error');
                setLoading(false);
            })
    }


    const handleMedicalRecord = () => {
        setLoading(true);
        useLoader(`/medical-records/statistics?of=${CurrentSubStatisticsType}&type=${CurrentTimeType}`)
            .then((res) => {
                calculatePiePercentage(handleMessingDateOfData(res));
                setLoading(false);
            })
            .catch((err) => {
                showToast('Error', err.response.data.message, 'error');
                setLoading(false);
            })
    }

    const handleMonitoringSheet = () => {
        setLoading(true);
        useLoader(`/monitoring-sheets/statistics?of=${CurrentSubStatisticsType}&type=${CurrentTimeType}`)
            .then((res) => {
                calculatePiePercentage(handleMessingDateOfData(res));
                setLoading(false);
            })
            .catch((err) => {
                showToast('Error', err.response.data.message, 'error');
                setLoading(false);
            })
    }

    const handleMedicines = () => {
        setLoading(true);
        useLoader(`/medicines/statistics?of=${CurrentSubStatisticsType}&type=${CurrentTimeType}`)
            .then((res) => {
                calculatePiePercentage(handleMessingDateOfData(res));
                setLoading(false);
            })
            .catch((err) => {
                showToast('Error', err.response.data.message, 'error');
                setLoading(false);
            })
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

    const handleMessingDateOfData = (chartData) => {
        const labels = chartData.lineChart.labels;
        const datasets = chartData.lineChart.datasets;

        // Create an object to keep track of the data points we have
        const dataPoints = {};
        for (let i = 0; i < datasets.length; i++) {
            const dataset = datasets[i];
            const label = dataset.label;
            const data = dataset.data;
            for (let j = 0; j < labels.length; j++) {
                const date = labels[j];
                const count = data[j];
                if (!dataPoints[date]) {
                    dataPoints[date] = {};
                }
                dataPoints[date][label] = count;
            }
        }

        let stepSize, unit;
        switch (CurrentTimeType) {
            case 'day':
                stepSize = 1;
                unit = 'Date';
                break;
            case 'week':
                stepSize = 7;
                unit = 'UTCDate';
                break;
            case 'month':
                stepSize = 30;
                unit = 'Month';
                break;
            case 'year':
                stepSize = 365;
                unit = 'FullYear';
                break;
            default:
                throw new Error(`Invalid type: ${type}`);
        }

        // Find the first and last dates in the data
        // decrease the first date by stepSize so that the first label is a multiple of stepSize
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const lastDate = tomorrow.toISOString().substring(0, 10);

        const firstDate = tomorrow.setDate(tomorrow.getDate() - stepSize);

        // Create an array of all dates between the first and last dates
        const allDates = [];
        let currentDate = new Date(firstDate);
        while (currentDate <= new Date(lastDate)) {
            allDates.push(currentDate.toISOString().substring(0, 10));
            currentDate.setDate(currentDate.getDate() + 1);
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
        let total = 0;
        data.pieChart.datasets[0].data.forEach((item) => {
            total += item;
        })
        data.pieChart.datasets[0]['percentage'] = [];

        data.pieChart.datasets[0].data.forEach((item, index) => {
            data.pieChart.datasets[0].percentage.push((item == 0) ? 0 : Math.round((item / total) * 100));
        })

        setData(data);
    }

    return (
        <Box>
            <Text
                fontSize={30}
                fontWeight="bold"
                color="gray.500"
                mb={5}
            >
                Statistics
            </Text>
            <Grid templateColumns={{ base: '1fr', xl: "repeat(3, 1fr)" }} gap={5}>
                <GridItem w='100%' colSpan={2} >
                    <Flex overflow='hidden' pl={5} justifyContent='space-between'>
                        <Flex bg="white" borderTopRadius="10px" p={3} mb={0} boxShadow="md" zIndex={4} gap={2}>
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
                                    <option key={index} value={item[0][1]}>{item[0][0]}</option>
                                ))}
                            </Select>
                            <Select
                                w='200px'
                                variant='filled'
                                value={CurrentSubStatisticsType}
                                onChange={(e) => setCurrentSubStatisticsType(e.target.value)}
                            >
                                {statisticsType.map((item, index) => {
                                    if (item[0][1] === CurrentStatisticsType) {
                                        return item[1].map((subItem, subIndex) => (
                                            <option key={subIndex} value={subItem}>{subItem}</option>
                                        ))
                                    }
                                })}
                            </Select>
                        </Flex>
                        <Box>
                            <Button
                                mr={2}
                                bg="white"
                                borderRadius="10px"
                                p={3}
                                mb={0}
                                boxShadow="md"
                                zIndex={4}
                                onClick={refresh}
                                isLoading={loading}
                            >
                                <Icon as={BiRefresh} />
                            </Button>
                            <Button
                                mr={2}
                                bg="white"
                                borderRadius="10px"
                                p={3}
                                mb={0}
                                boxShadow="md"
                                zIndex={4}
                                isDisabled={!IsChart}
                                onClick={() => setIsChart(false)}
                            >
                                <Icon as={BsTable} />
                            </Button>
                            <Button
                                mr={2}
                                bg="white"
                                borderRadius="10px"
                                p={3}
                                mb={0}
                                boxShadow="md"
                                zIndex={4}
                                isDisabled={IsChart}
                                onClick={() => setIsChart(true)}
                            >
                                <Icon as={FiBarChart2} />
                            </Button>


                        </Box>
                    </Flex>

                    <Box maxH='450px' w='100%' bg="white" borderRadius="10px" p={5} boxShadow="md" zIndex={5} overflow='auto'>
                        {data && IsChart ? (
                            <Bar
                                data={{
                                    labels: [...data?.lineChart?.labels],
                                    datasets: [
                                        ...data?.lineChart?.datasets
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
                                            unit: 1
                                        },
                                    },

                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <Box borderRadius="10px" p={0} mb={0} boxShadow="md" zIndex={4} overflow='auto'>
                                <Table variant="simple" size="md">
                                    <Thead>
                                        <Tr>
                                            <Th color='white' bg='gray.500' >
                                                Day
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
                        )}
                    </Box>
                    <Box w='100%' mt={5} display='flex' flexWrap='wrap' justifyContent='center' alignItems='center' gap={5}>
                        {data && (
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
                                <Heading size="md"  textShadow='2px 2px 8px #000'>
                                    {data?.lineChart?.totalCount ? 'Total Count' : '...'}
                                </Heading>
                                <Box p={5} display='flex' alignItems='center' justifyContent='flex-end'>
                                    {loading ? <Spinner /> : <Text  textShadow='2px 2px 8px #000' textAlign='right' fontSize={40}>{data?.lineChart?.totalCount}</Text>}
                                </Box>


                            </Box>
                        )}
                        {data && data?.pieChart && (
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
                        <Box p={2} color="white" bg="white" boxShadow="md" borderRadius="10px" overflow="hidden" mb={5}>
                            <Flex justifyContent='center' borderRadius="10px" overflow="hidden">
                                {/* <Button isDisabled={TimeType == 'day'} w='100%' bg='gray.500' variant="solid" size="md" borderRadius={0}>Day</Button> */}
                                {TimeType.map((item, index) => (
                                    <Button key={index} onClick={() => setCurrentTimeType(item)} colorScheme="blue" w='100%' bg={item == CurrentTimeType ? 'gray.400' : 'gray.500'} variant="solid" size="md" borderRadius={0}>{item}</Button>
                                ))}
                            </Flex>
                            {showFilter &&
                                <Flex mt={2} p={2} gap={2}>
                                    <Box w='100%' display='flex' flexDirection='column' gap={2} color='blue.700'>
                                        <Box w='100%' display='flex' flexDirection='column' alignItems='center' gap={2}>
                                            <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                                                <Text w='70px'>From</Text>
                                                <Input
                                                    type='date'
                                                    bg='white'
                                                />
                                            </Box>
                                            <Divider orientation='vertical' />
                                            <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' gap={2}>
                                                <Text w='70px'>To:</Text>
                                                <Input
                                                    type='date'
                                                    bg='white'
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Flex>
                            }
                            <Flex
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
                            </Flex>
                        </Box>

                        {data && data?.pieChart && data?.pieChart?.labels.length > 1 &&
                            <Flex bg="white" borderRadius="10px" p={5} boxShadow="md" justifyContent='center' alignItems='center' flexDirection='column'>

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
                                                position: 'top',
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
                        }
                    </Flex>
                </GridItem>

            </Grid>
        </Box>
    );
}

export default Statistics;