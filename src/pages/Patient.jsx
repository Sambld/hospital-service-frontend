import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, HStack, ListItem, SimpleGrid, Stack, StackDivider, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const Patient = () => {
    return (
        <Box>
            <Card>
                <CardHeader>
                    <Heading size='md'>Patient: Youcef Hemadou</Heading>
                </CardHeader>

                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Summary
                            </Heading>
                            <HStack spacing={4} pl='3'>
                                <Text pt='2' fontSize='sm'>
                                    Birth date: 22-11-2000
                                </Text>
                                <Text pt='2' fontSize='sm'>
                                    on Setif
                                </Text>
                            </HStack>
                            <Text pt='2' pl='3' fontSize='sm'>
                                gender: Male
                            </Text>
                            <HStack spacing={4} pl='3'>
                                <Text pt='2' fontSize='sm'>
                                    nationality: Algerian
                                </Text>
                                <Text pt='2' fontSize='sm'>
                                    address: setif setif
                                </Text>
                            </HStack>
                        </Box>
                        <Box>
                            <Heading size='xs' color='red' textTransform='uppercase'>
                                Emergency Contact
                            </Heading>
                            <HStack spacing={4} pl='3'>
                                <Text pt='2' fontSize='sm'>
                                    Name: beluga
                                </Text>
                                <Text pt='2' fontSize='sm'>
                                    Phone: 0555555555
                                </Text>
                            </HStack>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Medical Records
                            </Heading>
                            <Text pl='3' pt='5' fontSize='sm'>
                                <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(250px, 1fr))'>
                                    <Card bg='#f8f8fb' border='2px' borderColor='gray.200' boxShadow='md'>
                                        <CardHeader>
                                            <Heading size='md'>Medical Record #1</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <Text pt='2' fontSize='sm'>
                                                entry day: 10-03-2023
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Leaving day: 15-03-2023
                                            </Text>
                                        </CardBody>
                                        <CardFooter>
                                            <NavLink to='?med=1' m='auto'>
                                                <Button colorScheme='blue'>Open</Button>
                                            </NavLink>
                                        </CardFooter>
                                    </Card>
                                    <Card bg='#f8f8fb' border='2px' borderColor='gray.200' boxShadow='md'>
                                        <CardHeader>
                                            <Heading size='md'>Medical Record #2</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <Text pt='2' fontSize='sm'>
                                                entry day: 10-03-2023
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Leaving day: still in hospital
                                            </Text>
                                        </CardBody>
                                        <CardFooter>
                                            <NavLink to='?med=2'>
                                                <Button colorScheme='blue'>Open</Button>
                                            </NavLink>
                                        </CardFooter>
                                    </Card>

                                </SimpleGrid>
                            </Text>

                        </Box>
                    </Stack>
                </CardBody>
            </Card>
        </Box>
    );
}

export default Patient;