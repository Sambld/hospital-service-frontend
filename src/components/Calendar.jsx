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
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Calendar = ({setSelectedDate}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [focusedDate, setFocusedDate] = useState(new Date());

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

    const monthDays = getMonthDays(currentDate);

    const handlePrevMonthClick = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );

    const handleNextMonthClick = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );

    const handleSelectDate = (date) => {
        setFocusedDate(date);
        setSelectedDate(date);
    };


    return (
        <Box bgColor='white' borderRadius="md" boxShadow="md">
            <Flex alignItems="center" justifyContent="space-between" px={3} py={2}>
                <Text fontWeight="semibold" textTransform="capitalize">
                    {`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                </Text>
                <Box>
                    <IconButton
                        icon={<ChevronLeftIcon fontSize={30} color='blue.700'/>}
                        aria-label="Previous month"
                        variant="ghost"
                        onClick={handlePrevMonthClick}
                    />

                    <IconButton
                        icon={<ChevronRightIcon fontSize={30} color='blue.700'/>}
                        aria-label="Next month"
                        variant="ghost"
                        onClick={handleNextMonthClick}
                    />
                </Box>

            </Flex>

            <Grid templateColumns="repeat(7, 1fr)" px={3} py={2}>
                {daysOfWeek.map((dayOfWeek) => (
                    <GridItem key={dayOfWeek}>
                        <Center >
                            <Text fontWeight="semibold" color='blue.700'>{dayOfWeek}</Text>
                        </Center>
                    </GridItem>
                ))}
                {monthDays.map((monthDay) => (
                    <GridItem
                        key={monthDay.getTime()}
                        p={1}
                    >
                        <Center
                            p={2}
                            w='40px'
                            h='40px'
                            fontSize="sm"
                            _hover={
                                (monthDay.getDate() === focusedDate.getDate() && monthDay.getMonth() === focusedDate.getMonth())
                                    ? undefined
                                    : { bg: "gray.100" }
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
        </Box>
    );
};

export default Calendar;