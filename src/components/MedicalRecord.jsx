import {
  Box,
  Heading,
  Text,
  Badge,
  Stack,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Image,
  HStack,
  Wrap,
  WrapItem,
  IconButton,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon } from '@chakra-ui/icons'
import { Form } from "react-router-dom";

const MedicalRecord = ({ medical_record, user }) => {
  const [Examination, setExamination] = useState([]);
  const { isOpen: isOpenExamination, onOpen: onOpenExamination, onClose: onCloseExamination } = useDisclosure()
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box

      borderRadius="lg"
      overflow="hidden"

    >
      {medical_record && (
        <>
          <Box mb={3} p="6" color='blue.900' borderWidth="2px" borderColor='gray.300' borderRadius={10}>
            <Heading> Medical Record #{medical_record.id}</Heading>

            <Stack mt="4" spacing="4">
              <Box>
                <Text fontWeight="bold">Condition description: </Text>
                <Text ml={5}>{medical_record.condition_description}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Standard treatment: </Text>
                <Text ml={5}>{medical_record.standard_treatment}</Text>
              </Box>
              <Flex justify="normal" gap={2}>
                <Text fontWeight="bold">State upon enter: </Text>
                <Text>{medical_record.state_upon_enter}</Text>
              </Flex>
              <Flex justify="normal" gap={2}>
                <Text fontWeight="bold">State upon exit: </Text>
                <Text>{medical_record.state_upon_exit}</Text>
              </Flex>
              <Flex justify="normal" gap={2}>
                <Text fontWeight="bold">Bed number:</Text>
                <Text>{medical_record.bed_number}</Text>
              </Flex>
              <Flex justify="normal" gap={2}>
                <Text fontWeight="bold">Patient entry date:</Text>
                <Text>{formatDate(medical_record.patient_entry_date)}</Text>
              </Flex>
              <Flex justify="normal" gap={2}>
                <Text fontWeight="bold">Patient leaving date:</Text>
                <Text>
                  {medical_record.patient_leaving_date
                    ? formatDate(medical_record.patient_leaving_date)
                    : "N/A"}
                </Text>
              </Flex>
            </Stack>
          </Box>
          <Divider />
          <Tabs isFitted variant='unstyled' color='blue.900' mb={5}>
            <TabList mb='1em' bg='gray.300' borderRadius={10}>
              <Tab borderLeftRadius={10} _selected={{ color: 'white', bg: 'blue.500' }}>Examination</Tab>
              <Tab _selected={{ color: 'white', bg: 'red.500' }}>Observation</Tab>
              <Tab borderRightRadius={10} _selected={{ color: 'white', bg: 'green.500' }}>Monitoring Sheet</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <Box >
                  <Table variant='simple' colorScheme='blackAlpha' >
                    <Thead>
                      <Tr bg='gray.200'>
                        <Th><Text>examination Date</Text></Th>
                        <Th><Text>treatment type</Text></Th>
                        <Th pr={3}>
                          <HStack>
                            <Text>Result</Text>
                            <Spacer />
                            <IconButton
                              borderRadius='100%'
                              size='md'
                              color='white'
                              bg='gray.400'
                              onClick={onOpenExamination}
                              icon={<AddIcon />} />
                          </HStack>

                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Examination && Examination.map((Exam, index) => (
                        <Tr key={index}>
                          <Td>{Exam.created_at}</Td>
                          <Td>{Exam.type}</Td>
                          <Td>{Exam.result}</Td>
                        </Tr>
                      ))}
                      {Examination.length === 0 && (
                        <Tr><Td colSpan={3}><Text textAlign='center' fontWeight='bold' fontSize='xl'>No Examination</Text></Td></Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>


              </TabPanel>
              <TabPanel>
                <Box>
                  <Flex justify='flex-start' mb='15px'>
                    <Flex pos="relative" alignItems="center" p={10}>
                      <Box
                        position="absolute"
                        left="50%"
                        height="calc(100% + 15px)"
                        border="1px solid"
                        borderColor={'gray.300'}
                        top="0px"

                      ></Box>
                      <Box pos="relative" p="10px">
                        <Box
                          pos="absolute"
                          width="100%"
                          height="100%"
                          bottom="0"
                          right="0"
                          top="0"
                          left="0"
                          backgroundSize="cover"
                          backgroundRepeat="no-repeat"
                          backgroundPosition="center center"
                          backgroundColor="rgb(255, 255, 255)"
                          borderRadius="100px"
                          border="3px solid rgb(4, 180, 180)"
                          backgroundImage="none"
                          opacity={1}
                        ></Box>
                      </Box>
                    </Flex>
                    <Center>
                      <Box
                        bg='gray.300'
                        pos="relative"
                        p={2}
                        _before={{
                          content: `""`,
                          w: '0',
                          h: '0',
                          borderColor: `transparent #cbd5e0 transparent transparent`,
                          borderStyle: 'solid',
                          borderWidth: '15px 15px 15px 0',
                          position: 'absolute',
                          left: '-15px',
                          top: 'calc(50% - 15px)',
                          display: 'block'
                        }}>
                        <Wrap>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                            <WrapItem key={index}>
                              <Image src='https://scontent.xx.fbcdn.net/v/t1.15752-9/332093841_738616110992091_7103711267090570183_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=aee45a&_nc_eui2=AeET-OrdJjxqAaY1ywMriXvcKDChV5jsspooMKFXmOyymnMkSv9lFZR-eGGjbe6ojfV-Y9OcFOAou9inZQY12CSX&_nc_ohc=IM2xF8xvLe8AX8YHrZo&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdRUveQFqkYfVBQFHa6kK6L1IByaqJcMkDF8no8XJvIh2Q&oe=64281F3D' boxSize='150px' />
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                    </Center>
                  </Flex>
                  <Flex justify='flex-start'>
                    <Flex pos="relative" alignItems="center" p={10}>
                      <Box
                        position="absolute"
                        left="50%"
                        height="calc(100% + 15px)"
                        border="1px solid"
                        borderColor={'gray.300'}
                        top="0px"

                      ></Box>
                      <Box pos="relative" p="10px">
                        <Box
                          pos="absolute"
                          width="100%"
                          height="100%"
                          bottom="0"
                          right="0"
                          top="0"
                          left="0"
                          backgroundSize="cover"
                          backgroundRepeat="no-repeat"
                          backgroundPosition="center center"
                          backgroundColor="rgb(255, 255, 255)"
                          borderRadius="100px"
                          border="3px solid rgb(4, 180, 180)"
                          backgroundImage="none"
                          opacity={1}
                        ></Box>
                      </Box>
                    </Flex>
                    <Center>
                      <Box
                        bg='gray.300'
                        pos="relative"
                        p={2}
                        _before={{
                          content: `""`,
                          w: '0',
                          h: '0',
                          borderColor: `transparent #cbd5e0 transparent transparent`,
                          borderStyle: 'solid',
                          borderWidth: '15px 15px 15px 0',
                          position: 'absolute',
                          left: '-15px',
                          top: 'calc(50% - 15px)',
                          display: 'block'
                        }}>
                        <HStack>
                          <Image src='https://scontent.xx.fbcdn.net/v/t1.15752-9/334534753_600766361536668_4647587475183316471_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=aee45a&_nc_eui2=AeHmZXNouRavSwn4GVDD2hmI4j0xZwgUZK3iPTFnCBRkrdgHnquzHCgL0FH27LyT6aa-sJ7rmIOoxl9UERFOPpo3&_nc_ohc=LWL2DkO5nOYAX-OziSa&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdRFYXsW7idPXeqNEdjUui7uANPRd4zOoPXoTy7GSC5a3w&oe=6427FA22' boxSize='150px' />
                        </HStack>
                      </Box>
                    </Center>
                  </Flex>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  Monitoring Sheet
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
      <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenExamination} onClose={onCloseExamination}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ADD EXAMINATION</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form>
              <FormControl id='ExamDate'>
                <FormLabel>Examination Date</FormLabel>
                <Input type='date' />
              </FormControl>
              <br />
              <FormControl id='ExamType'>
                <FormLabel>Examination Type</FormLabel>
                <Input type='text' />
              </FormControl>
              <br />
              <FormControl id='ExamResult'>
                <FormLabel>Examination Result</FormLabel>
                <Input type='text' />
              </FormControl>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onCloseExamination}>
              Close
            </Button>
            <Button variant='ghost'>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default MedicalRecord;

