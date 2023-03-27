import {
  Box,
  Heading,
  Text,
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
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddIcon } from '@chakra-ui/icons'
import { Form } from "react-router-dom";

// Hooks
import useLoader from "../hooks/useLoader";
// Components
import ExaminationForm from "./ExaminationForm";
import ObservationForm from "./ObservationForm";
import OBservationImages from "./ObservationImages";
import MonitoringSheet from "./MonitoringSheet";
import MonitoringSheetForm from "./MonitoringSheetForm";
import MonitoringSheetRow from "./MonitoringSheetRow";

const MedicalRecord = ({ medical_record, user }) => {
  const toast = useToast()
  const [Examination, setExamination] = useState([]);
  const [Observations, setObservations] = useState([]);
  const [Observation, setObservation] = useState([]);
  const [MonitoringSheetData, setMonitoringSheetData] = useState([]);
  const [MonitoringSheetRowData , setMonitoringSheetRow] = useState(null);
  const [loadingExamination, setLoadingExamination] = useState(false)
  const [loadingObservation, setLoadingObservation] = useState(false)
  const [loadingMonitoringSheet, setLoadingMonitoringSheet] = useState(false)
  const [loadingMonitoringSheetRow, setLoadingMonitoringSheetRow] = useState(false)
  const { isOpen: isOpenExamination, onOpen: onOpenExamination, onClose: onCloseExamination } = useDisclosure()
  const { isOpen: isOpenObservation, onOpen: onOpenObservation, onClose: onCloseObservation } = useDisclosure()
  const { isOpen: isOpenPrescription, onOpen: onOpenPrescription, onClose: onClosePrescription } = useDisclosure()
  const { isOpen: isOpenMonitoring, onOpen: onOpenMonitoring, onClose: onCloseMonitoring } = useDisclosure()
  const { isOpen: isOpenObservationImages, onOpen: onOpenObservationImages, onClose: onCloseObservationImages } = useDisclosure()
  const { isOpen: isOpenMonitoringSheetRow, onOpen: onOpenMonitoringSheetRow, onClose: onCloseMonitoringSheetRow } = useDisclosure()

  useEffect(() => {
    setExamination([])
    setObservation([])
    setMonitoringSheetData([])

    handleExamination(medical_record.id)
    handleObservation(medical_record.id)
    handleMonitoringSheet(medical_record.id)
  }, [medical_record])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  const changeFormat = (date) => {
    let date_ = new Date(date)
    return date_.getUTCDate() + '-' + (date_.getUTCMonth() + 1) + '-' + date_.getUTCFullYear() + '/' + date_.getUTCHours() + ':' + date_.getUTCMinutes()
  }
  const formateDayOrdinalSuffix = (date) => {
    let date_ = new Date(date)
    let day = date_.getUTCDate()
    let j = day % 10,
      k = day % 100;
    // with switch
    switch (true) {
      case j == 1 && k != 11:
        return day + "st";
      case j == 2 && k != 12:
        return day + "nd";
      case j == 3 && k != 13:
        return day + "rd";
      default:
        return day + "th";
    }
  }

  const handleExamination = () => {
    setExamination([])
    setLoadingExamination(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/examinations')
      .then((data) => {
        setLoadingExamination(false)
        setExamination(data.data || [])
      })
  }
  const handleExaminationAdd = (message) => {
    onCloseExamination()
    toast({
      title: message.title,
      status: message.status,
      duration: 9000,
      isClosable: true,
    })
    handleExamination()
  }

  const handleObservation = () => {
    setObservations([])
    setLoadingObservation(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/observations')
      .then((data) => {
        setLoadingObservation(false)
        setObservations(data.data || [])
      })
  }
  const handleObservationAdd = (message) => {
    onCloseObservation()
    onCloseObservationImages()
    toast({
      title: message.title,
      status: message.status,
      duration: 9000,
      isClosable: true,
    })
    handleObservation()
  }

  const handleMonitoringSheet = () => {
    setLoadingMonitoringSheet(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets')
      .then((data) => {
        setLoadingMonitoringSheet(false)
        let monitoringSheetData = data.data || []
        setMonitoringSheetData(monitoringSheetData)
      })
  }

  // const MonitoringSheetTreatment = async (monitoringSheetData) => {
  //   try {
  //     const promises = [];
  //     let MSD = monitoringSheetData;
  //     MSD.map((item) => {
  //       const promise = useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + item.id + '/treatments')
  //         .then((subData) => {
  //           item.treatments = subData.data || []
  //         })
  //       promises.push(promise)
  //     })
  //     await Promise.all(promises);
  //     return MSD
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }


  const handleMonitoringSheetAdd = (message) => {
    onCloseMonitoring()
    onCloseMonitoringSheetRow()
    toast({
      title: message.title,
      status: message.status,
      duration: 9000,
      isClosable: true,
    })
    handleMonitoringSheet()
  }

  const handleMonitoringSheetRow = (data) => {
    setMonitoringSheetRow(null)
    setLoadingMonitoringSheetRow(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + data )
      .then((data) => {
        setLoadingMonitoringSheetRow(false)
        setMonitoringSheetRow(data.data)
      })
    onOpenMonitoringSheetRow()
  }
  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
    >
      {medical_record && (
        <>
          {/* Medical Record Examination, Observation, Monitoring Sheet */}
          <Tabs isFitted variant='unstyled' color='blue.900' mb={5}>
            <TabList mb='1em' bg='gray.300' borderRadius={10}>
              <Tab borderLeftRadius={10} _selected={{ color: 'white', bg: 'blue.500' }}>Information</Tab>
              <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Examination</Tab>
              <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Observation</Tab>
              <Tab borderRightRadius={10} _selected={{ color: 'white', bg: 'blue.500' }}>Monitoring Sheet</Tab>
            </TabList>
            <TabPanels>
              {/*  Info Tab */}
              <TabPanel p={0}>
                {/* Medical Record main information */}
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
              </TabPanel>

              {/*  Examination Tab */}
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
                            {user.role === 'doctor' && medical_record.user_id === user.id && !medical_record.patient_leaving_date && (
                              <IconButton
                                borderRadius='100%'
                                size='sm'
                                color='white'
                                bg='gray.400'
                                onClick={onOpenExamination}
                                icon={<AddIcon />} />
                            )}
                          </HStack>

                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Examination && Examination.map((Exam, index) => (
                        <Tr key={index}>
                          <Td>{changeFormat(Exam.created_at)}</Td>
                          <Td>{Exam.type}</Td>
                          <Td>{Exam.result}</Td>
                        </Tr>
                      ))}
                      {!loadingExamination && Examination.length === 0 && (
                        <Tr><Td colSpan={3}><Text textAlign='center' fontWeight='bold' fontSize='xl'>No Examination</Text></Td></Tr>
                      )}
                    </Tbody>
                  </Table>
                  {loadingExamination && (
                    <Center p='10px'>
                      <Spinner thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl' />
                    </Center>
                  )}
                </Box>


              </TabPanel>

              {/*  Observation Tab */}
              <TabPanel>
                {user.role === 'doctor' && medical_record.user_id === user.id && !medical_record.patient_leaving_date && (
                  <Flex justify='flex-end' mb='15px'>
                    <Button colorScheme='red' onClick={onOpenObservation} mr={3}>
                      <Text>Add Observation</Text>
                    </Button>
                  </Flex>
                )}
                {Observations && Observations.map((obs, index) => (
                  <Box key={index}>
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
                          <Text
                            pos="absolute"
                            width="70px"
                            height="35px"
                            bottom="0"
                            right="0"
                            top="0"
                            left="-20px"
                            fontSize="2xl"
                            backgroundSize="cover"
                            backgroundRepeat="no-repeat"
                            backgroundPosition="center center"
                            backgroundColor="rgb(255, 255, 255)"
                            // borderRadius="100px"
                            // border="3px solid rgb(4, 180, 180)"  
                            backgroundImage="none"
                            opacity={1}
                          >
                            {formateDayOrdinalSuffix(obs.created_at)}
                          </Text>

                        </Box>
                      </Flex>
                      <Center onClick={() => {
                        setObservation(obs)
                        onOpenObservationImages()
                      }} cursor='pointer'>
                        <Box
                          gap={0}
                          pos="relative"

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
                          <Wrap spacing={0}>
                            {obs.images && obs.images.map((img, index) => (
                              <WrapItem key={index} bg='gray.300' p={2}>
                                <Image src={'http://localhost:8000/storage/images/' + img.path} boxSize='150px' />
                              </WrapItem>
                            ))}
                          </Wrap>
                        </Box>
                      </Center>
                    </Flex>
                  </Box>
                ))}
                {!loadingObservation && Observations.length === 0 && (
                  <Box>
                    <Text textAlign='center'>No Observation</Text>
                  </Box>
                )}
                {loadingObservation && (
                  <Center p='10px'>
                    <Spinner thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='blue.500'
                      size='xl' />
                  </Center>
                )}
              </TabPanel>

              {/* monitoring sheet tab */}
              <TabPanel>
                <Box>
                  <MonitoringSheet
                    data={MonitoringSheetData}
                    openMonitoringForm={onOpenMonitoring}
                    openMonitoringRow={handleMonitoringSheetRow}
                    medical_record={medical_record}
                    user={user}
                    loading={loadingMonitoringSheet}
                  />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Divider />
        </>
      )}

      {/* Medical Record Modal */}
      <Box>
        {/* examination modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenExamination} onClose={onCloseExamination}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ADD EXAMINATION</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5} pt={0}>
              <ExaminationForm medical_record={medical_record} closeModal={onCloseExamination} closeAndRefresh={handleExaminationAdd} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* observation modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenObservation} onClose={onCloseObservation}>
          <ModalOverlay />
          <ModalContent maxW='1000px'>
            <ModalHeader>ADD OBSERVATION</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5} pt={0}>
              <ObservationForm medical_record={medical_record} closeModal={onCloseObservation} closeAndRefresh={handleObservationAdd} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* observation images modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenObservationImages} onClose={onCloseObservationImages}>
          <ModalOverlay />
          <ModalContent maxW='1000px'>
            <ModalHeader>Observation Information</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5} pt={0}>
              <OBservationImages Observation={Observation} closeAndRefresh={handleObservationAdd} patientId={medical_record.patient_id} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* monitoring sheet modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenMonitoring} onClose={onCloseMonitoring}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Monitoring Sheet</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5} pt={0}>
              <MonitoringSheetForm medical_record={medical_record} closeModal={onCloseMonitoring} closeAndRefresh={handleMonitoringSheetAdd} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* monitoring sheet row edit model */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenMonitoringSheetRow} onClose={onCloseMonitoringSheetRow}>
          <ModalOverlay />
          <ModalContent maxW='600px'>
            <ModalHeader>Monitoring Sheet Row</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5} pt={0}>
              <MonitoringSheetRow user={user} medical_record={medical_record} data={MonitoringSheetRowData} closeModal={onCloseMonitoringSheetRow} closeAndRefresh={handleMonitoringSheetAdd} loadingData={loadingMonitoringSheetRow} />
            </ModalBody>
          </ModalContent>
        </Modal>

      </Box>


    </Box>
  );
};
export default MedicalRecord;

