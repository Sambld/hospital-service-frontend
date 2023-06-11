import { useState } from "react";
import {
    Box,
    Center,
    Flex,
    Text,
    IconButton,
    useColorModeValue,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";

const Calendar = ({ startDate, setSelectedDate }) => {
    const [type, setType] = useState("month");

    const [currentDate, setCurrentDate] = useState(startDate || new Date());
    const [focusedDate, setFocusedDate] = useState(startDate || new Date());

    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const getDaysInMonth = (date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const getDayOfWeek = (date) => date.getDay();

    const getFirstDayOfMonth = (date) =>
        new Date(date.getFullYear(), date.getMonth(), 1);

    const getLastDayOfMonth = (date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const getMonthDays = (date) => {
        const firstDay = getFirstDayOfMonth(date);
        const lastDay = getLastDayOfMonth(date);
        const daysInMonth = getDaysInMonth(date);

        const monthDays = [];

        let currentDate = new Date(firstDay.getTime());
        currentDate.setDate(currentDate.getDate() - getDayOfWeek(firstDay));


        for (let i = 0; i < 42; i++) {
            monthDays.push(new Date(currentDate.getTime()));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return monthDays;
    };

    const getYearMonths = (date) => {
        const yearMonths = [];

        for (let i = 0; i < 12; i++) {
            yearMonths.push(new Date(date.getFullYear(), i, 1));
        }

        return yearMonths;
    };

    const getYearsYear = (date) => {
        const startYear = date.getFullYear() - 6;
        const yearsYear = [];

        for (let i = 0; i < 12; i++) {
            yearsYear.push(new Date(startYear + i, 0, 1));
        }

        return yearsYear;
    };

    const monthDays = getMonthDays(currentDate);
    const yearMonths = getYearMonths(currentDate);
    const yearsYear = getYearsYear(currentDate);

    const handlePrevMonthClick = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );

    const handleNextMonthClick = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );

    const handlePrevYearClick = () =>
        setCurrentDate(new Date(currentDate.getFullYear() - 1, 0));

    const handleNextYearClick = () =>
        setCurrentDate(new Date(currentDate.getFullYear() + 1, 0));

    const handlePrevYearsClick = () =>
        setCurrentDate(new Date(currentDate.getFullYear() - 12, 0));

    const handleNextYearsClick = () =>
        setCurrentDate(new Date(currentDate.getFullYear() + 12, 0));


    const handleSelectDate = (date) => {
        setFocusedDate(date);
        setSelectedDate(date);
    };


    return (
        <Box bgColor={useColorModeValue("white", "gray.700")}
            borderRadius="md" boxShadow="md">
            <Flex alignItems="center" justifyContent="space-between" px={3} py={2}>
                <Text
                    fontWeight="semibold"
                    textTransform="capitalize"
                    onClick={
                        () => {
                            type === "month" ? setType("year") : setType("years")
                        }}
                >
                    {type === "month" && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                    {type === "year" && `${currentDate.getFullYear()}`}
                    {type === "years" && `${yearsYear[0].getFullYear()} - ${yearsYear[yearsYear.length - 1].getFullYear()}`}
                </Text>
                <Box display="flex" alignItems="center">
                    <Box
                        p={2}
                        border='1px solid'
                        borderRadius='10px'
                        boxShadow='md'
                        cursor='pointer'
                        textAlign='center'
                        onClick={() => {
                            setCurrentDate(new Date());
                            setFocusedDate(new Date());
                            setSelectedDate(new Date());
                        }}
                    >
                        Today
                    </Box>
                    <IconButton
                        icon={<BsChevronUp fontSize={25} color='blue.700' />}
                        aria-label="Previous month"
                        variant="ghost"
                        onClick={type === "month" ? handlePrevMonthClick : type === "year" ? handlePrevYearClick : handlePrevYearsClick}
                    />

                    <IconButton
                        icon={<BsChevronDown fontSize={25} color='blue.700' />}
                        aria-label="Next month"
                        variant="ghost"
                        onClick={type === "month" ? handleNextMonthClick : type === "year" ? handleNextYearClick : handleNextYearsClick}
                    />
                </Box>

            </Flex>

            {type === "month" && (
                <Grid templateColumns="repeat(7, 1fr)" px={3} py={2}>
                    {daysOfWeek.map((dayOfWeek) => (
                        <GridItem key={dayOfWeek}>
                            <Center >
                                <Text fontWeight="semibold" color={useColorModeValue("blue.700", "blue.400")}
                                >{dayOfWeek}</Text>
                            </Center>
                        </GridItem>
                    ))}
                    {monthDays.map((monthDay) => (
                        <GridItem
                            key={monthDay.getTime()}
                            p={1}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            className="calendar-day"
                        >
                            <Center

                                p={2}
                                w='40px'
                                h='40px'
                                fontSize="sm"
                                _hover={
                                    (monthDay.getDate() === focusedDate.getDate() && monthDay.getMonth() === focusedDate.getMonth())
                                        ? undefined
                                        : { bg: useColorModeValue("blue.700", "blue.400"), color: "white" }

                                }
                                cursor="pointer"
                                borderRadius="md"
                                bg={
                                    (monthDay.getDate() === focusedDate.getDate() && monthDay.getMonth() === focusedDate.getMonth())
                                        ? 'blue.700'
                                        : undefined
                                }
                                color={
                                    monthDay.getMonth() !== currentDate.getMonth()
                                        ? "gray.500"
                                        : (
                                            (monthDay.getDate() === focusedDate.getDate() && monthDay.getMonth() === focusedDate.getMonth())
                                                ? "white"
                                                : undefined
                                        )
                                }
                                onClick={() => handleSelectDate(monthDay)}
                            >
                                <Text

                                    fontWeight={
                                        monthDay.getDay() === 0 || monthDay.getDay() === 6
                                            ? "bold"
                                            : "inherit"
                                    }

                                    opacity={
                                        monthDay.getMonth() !== currentDate.getMonth()
                                            ? "0.5"
                                            : "inherit"
                                    }

                                >
                                    {monthDay.getDate()}
                                </Text>
                            </Center>

                        </GridItem>
                    ))}
                </Grid>
            )}


            {type === "year" && (
                <Grid templateColumns="repeat(4, 1fr)" px={3} py={2}>
                    {yearMonths.map((yearMonth) => (
                        <GridItem
                            key={yearMonth.getTime()}
                            p={1}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            className="calendar-day"
                            onClick={() => {
                                setCurrentDate(yearMonth);
                                setType("month");
                            }}
                        >
                            <Center
                                p={2}
                                w="100px"
                                h="100px"
                                fontSize="md"
                                cursor="pointer"
                                borderRadius="md"
                                bg={
                                    yearMonth.getMonth() === currentDate.getMonth() &&
                                        yearMonth.getFullYear() === currentDate.getFullYear()
                                        ? "blue.700"
                                        : undefined
                                }
                                color={
                                    yearMonth.getMonth() !== currentDate.getMonth()
                                        ? "gray.500"
                                        : yearMonth.getFullYear() === currentDate.getFullYear()
                                            ? "white"
                                            : undefined
                                }
                            >
                                <Text>{monthNames[yearMonth.getMonth()]}</Text>
                            </Center>
                        </GridItem>
                    ))}
                </Grid>
            )}


            {type === "years" && (
                <Grid templateColumns="repeat(4, 1fr)" px={3} py={2}>
                    {yearsYear.map((year) => (
                        <GridItem
                            key={year.getTime()}
                            p={1}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            className="calendar-day"
                            onClick={() => {
                                setCurrentDate(year);
                                setType("year");
                            }}
                        >
                            <Center
                                p={2}
                                w="100px"
                                h="100px"
                                fontSize="md"
                                cursor="pointer"
                                borderRadius="md"
                                bg={
                                    year.getFullYear() === currentDate.getFullYear()
                                        ? "blue.700"
                                        : undefined
                                }
                                color={
                                    year.getFullYear() === currentDate.getFullYear()
                                        ? "white"
                                        : undefined
                                }
                            >
                                <Text>{year.getFullYear()}</Text>
                            </Center>
                        </GridItem>
                    ))}
                </Grid>
            )}

        </Box>
    );
};

export default Calendar;