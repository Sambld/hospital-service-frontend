import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Grid,
    GridItem,
    Spacer,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "@chakra-ui/react";
import { FaUserMd } from "react-icons/fa";
import { AiOutlineClose, AiFillFile, AiOutlineClockCircle } from "react-icons/ai";
import { IoClose, IoCheckmarkSharp } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import { BsInfoLg } from "react-icons/bs";


const Prescriptions = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handlePrescriptionDetail = (id) => {
        onOpen();

    }
    return (
        <Box bg='white' m='10px' p='10px' border='2px' borderColor='gray.200' borderRadius='2xl'>
            <Tabs variant='unstyled' colorScheme='green' isFitted>
                <TabList bg='gray.300' p='3px' borderRadius='3xl'>
                    <Tab borderRadius='3xl' _selected={{ color: 'white', bg: 'blue.500' }}>Pending Requests</Tab>
                    <Tab borderRadius='3xl' _selected={{ color: 'white', bg: 'green.500' }}>Past Requests</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Grid templateColumns={{ base: '1f', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={6}>
                            {['h','e','l','l','o'].map((item, index) => (
                                <GridItem key={index}>
                                    <Box borderRadius='md' boxShadow='md' overflow='hidden'>
                                        <Flex alignItems='center' bg='blue.500' p={3} color='white' borderTopRadius='md' gap={1}>
                                            <Icon as={AiOutlineClockCircle} fontSize='20px' mr='5px' />
                                            <Text>wed Jun 21 - 8:00 AM</Text>
                                        </Flex>
                                        <Flex justifyContent='flex-start' alignItems='center' gap={3} p={3}>
                                            <Avatar
                                                bg='red'
                                                size={'md'}
                                                icon={<FaUserMd fontSize='20px' />}
                                            />
                                            <Text>Doctor #{index}</Text>
                                        </Flex>
                                        <Flex justifyContent='space-between' bg='gray.100' borderBottomRadius='md' pt='1px' gap='1px'>
                                            <Button
                                                bg='white'
                                                leftIcon={<IoClose color="red.700" />}
                                                colorScheme='red'
                                                borderRadius={0}
                                                border={0}
                                                variant='outline'
                                                p='10px'
                                                px={5}
                                                w='50%'>
                                                <Text mr='5px' fontSize={15} fontWeight='normal'>Reject</Text>
                                            </Button>

                                            <Button
                                                bg='white'
                                                leftIcon={<AiFillFile color='blue.700' />}
                                                colorScheme='blue'
                                                borderRadius={0}
                                                border={0}
                                                variant='outline'
                                                p='10px'
                                                px={5}
                                                w='50%'
                                                onClick={() => handlePrescriptionDetail(item)}
                                            >
                                                <Text mr='5px' fontSize={15} fontWeight='normal'>Detail</Text>
                                            </Button>
                                        </Flex>
                                    </Box>

                                </GridItem>
                            ))}
                        </Grid>
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Prescription #5</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {/* doctor name */}
                        <Flex justifyContent='flex-start' alignItems='center' gap={3} mb={2}>
                            <FaUserMd fontSize='20px' />
                            <Text>Doctor Name</Text>
                        </Flex>
                        {/* time */}
                        <Flex justifyContent='flex-start' alignItems='center' gap={3}>
                            <AiOutlineClockCircle fontSize='20px' />
                            <Text>Wed Jun 21 - 8:00 AM</Text>
                        </Flex>
                        {/* status */}
                        <Flex justifyContent='flex-start' alignItems='center' gap={3} mt={2}>
                            <BsInfoLg fontSize='20px' />
                            <Text>waiting</Text>
                        </Flex>
                        <Divider mt={3} mb={3} />
                        <Box maxH='30vh' overflow='auto'>
                            <Table variant='simple' colorScheme='blackAlpha'>
                                <Thead>
                                    <Tr>
                                        <Th>Medicine</Th>
                                        <Th>Quantity</Th>
                                    </Tr>
                                </Thead>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                                    <Tbody>
                                        <Tr>
                                            <Td>Medicine #{index}</Td>
                                            <Td>1</Td>
                                        </Tr>
                                    </Tbody>
                                ))}
                            </Table>
                        </Box>

                    </ModalBody>

                    <ModalFooter gap={5}>
                        <Button
                            bg='white'
                            leftIcon={<IoClose color="red.700" />}
                            colorScheme='red'
                            variant='outline'
                            p='10px'
                            px={5}
                            w='50%'>
                            <Text mr='5px' fontSize={15} fontWeight='normal'>Reject</Text>
                        </Button>
                        <Button
                            leftIcon={<IoCheckmarkSharp color="green.700" />}
                            colorScheme='green'
                            variant='solid'
                            p='10px'
                            px={5}
                            w='50%'>
                            <Text mr='5px' fontSize={15} fontWeight='normal'>Accept</Text>
                        </Button>
                        {/* <Button variant='ghost'>Secondary Action</Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Prescriptions;