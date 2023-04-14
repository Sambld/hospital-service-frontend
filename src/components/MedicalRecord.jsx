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
  Badge,
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
import PrescriptionForm from "./PrescriptionForm";

const MedicalRecord = ({ medical_record, user , editRecord}) => {
  const toast = useToast()
  const [tabIndex, setTabIndex] = useState(0)

  const [Examination, setExamination] = useState([]);

  const [Observations, setObservations] = useState([]);
  const [Observation, setObservation] = useState([]);

  const [MonitoringSheetData, setMonitoringSheetData] = useState([]);
  const [MonitoringSheetRowData, setMonitoringSheetRow] = useState(null);
  const [Treatments, setTreatments] = useState([]);
  const [MonitoringSheetEditInfo, setMonitoringSheetEditInfo] = useState(null)

  const [Prescriptions, setPrescriptions] = useState([]);


  const [loadingExamination, setLoadingExamination] = useState(false)
  const [loadingObservation, setLoadingObservation] = useState(false)
  const [loadingMonitoringSheet, setLoadingMonitoringSheet] = useState(false)
  const [loadingMonitoringSheetRow, setLoadingMonitoringSheetRow] = useState(false)
  const [loadingPrescription, setLoadingPrescription] = useState(false)

  const { isOpen: isOpenExamination, onOpen: onOpenExamination, onClose: onCloseExamination } = useDisclosure()
  const { isOpen: isOpenObservation, onOpen: onOpenObservation, onClose: onCloseObservation } = useDisclosure()
  const { isOpen: isOpenPrescription, onOpen: onOpenPrescription, onClose: onClosePrescription } = useDisclosure()
  const { isOpen: isOpenMonitoring, onOpen: onOpenMonitoring, onClose: onCloseMonitoring } = useDisclosure()
  const { isOpen: isOpenObservationImages, onOpen: onOpenObservationImages, onClose: onCloseObservationImages } = useDisclosure()
  const { isOpen: isOpenMonitoringSheetRow, onOpen: onOpenMonitoringSheetRow, onClose: onCloseMonitoringSheetRow } = useDisclosure()
  const { isOpen: isOpenPrescriptionForm, onOpen: onOpenPrescriptionForm, onClose: onClosePrescriptionForm } = useDisclosure()

  useEffect(() => {
    setExamination([])
    setObservation([])
    setMonitoringSheetData([])
    setMonitoringSheetRow(null)
    setTreatments([])
    setMonitoringSheetEditInfo(null)
    setPrescriptions([])

    handleExamination(medical_record.id)
    handleObservation(medical_record.id)
    handleMonitoringSheet(medical_record.id)
    handlePrescription(medical_record.id)
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

  const handleTabsChange = (index) => {
    setTabIndex(index)
  }

  const ReloadTabContent = () => {
    switch (tabIndex) {
      case 1:
        setExamination([])
        handleExamination(medical_record.id)
        break;
      case 2:
        setObservation([])
        handleObservation(medical_record.id)
        break;
      case 3:
        setMonitoringSheetData([])
        setMonitoringSheetRow(null)
        setTreatments([])
        setMonitoringSheetEditInfo(null)
        handleMonitoringSheet(medical_record.id)
        break;
      case 4:
        setPrescriptions([])
        handlePrescription(medical_record.id)
        break;
    }

  }

  // Record
  const handleMedicalRecordEdit = () => {
    editRecord(medical_record)
  }

  
  // Examination
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

  // Observation
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

  // Monitoring Sheet
  const handleMonitoringSheet = () => {
    setLoadingMonitoringSheet(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets')
      .then((data) => {
        setLoadingMonitoringSheet(false)
        let monitoringSheetData = data.data || []
        if (monitoringSheetData.length > 0) {
          let treatmentsList = []
          monitoringSheetData.map((data2) => {
            if (data2.treatments.length > 0) {
              data2.treatments.map((treatment) => {
                if (!treatmentsList.includes(treatment.name)) {
                  treatmentsList.push(treatment.name)
                }
              })
            }
          })
          setTreatments(treatmentsList)
        }

        setMonitoringSheetData(monitoringSheetData)
      })
  }

  const handleMonitoringSheetEdit = (startDate) => {
    setMonitoringSheetEditInfo({
      Start_date: startDate
    })
    onOpenMonitoring()
  }

  const handleMonitoringSheetAdd = (message) => {
    onCloseMonitoring()
    onCloseMonitoringSheetRow()
    setMonitoringSheetEditInfo(null)
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
    setMonitoringSheetEditInfo(null)
    setLoadingMonitoringSheetRow(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/monitoring-sheets/' + data)
      .then((data) => {
        setLoadingMonitoringSheetRow(false)
        setMonitoringSheetRow(data.data)
      })
    onOpenMonitoringSheetRow()
  }

  // Prescription
  const handlePrescription = () => {
    setPrescriptions([])
    setLoadingPrescription(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/medicine-requests')
      .then((data) => {
        setLoadingPrescription(false)
        setPrescriptions(data.data || [])
      })
  }
  const handlePrescriptionAdd = (message) => {
    onClosePrescriptionForm()
    toast({
      title: message.title,
      status: message.status,
      duration: 9000,
      isClosable: true,
    })
    handlePrescription()
  }


  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
    >
      {medical_record && (
        <>
          {/* Medical Record Examination, Observation, Monitoring Sheet */}
          <Tabs isFitted variant='unstyled' color='blue.900' mb={5} index={tabIndex} onChange={handleTabsChange}>
            <TabList mb='1em' bg='gray.300' borderRadius={10}>
              <Tab borderLeftRadius={10} _selected={{ color: 'white', bg: 'blue.500' }}>Information</Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.500' }}
                onClick={ReloadTabContent}
              >
                Examination
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.500' }}
              >
                Observation
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.500' }}
              >
                Monitoring Sheet
              </Tab>
              {user.id == medical_record.user_id && (
                <Tab
                  borderRightRadius={10} _selected={{ color: 'white', bg: 'blue.500' }}
                  onClick={ReloadTabContent}
                >
                  Prescriptions
                </Tab>
              )}
            </TabList>
            <TabPanels>
              {/*  Info Tab */}
              <TabPanel p={0}>
                {/* Medical Record main information */}
                <Box
                  p="6"
                  color='blue.900'
                  borderWidth="2px"
                  borderColor='gray.300'
                  borderRadius={10}
                  borderBottomRadius={0}
                >
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
                <Box
                  mb={3}
                  color='blue.900'
                  borderRadius={10}
                  borderTopRadius={0}
                  display='flex'
                  justifyContent='flex-end'
                >
                  <Button variant='solid' colorScheme='green' type="submit" borderRadius={0} onClick={() => handleMedicalRecordEdit(medical_record)}>
                    {/* add icon */}
                    <Text ml="5px" >Edit</Text>
                  </Button>
                  <Button variant='solid' colorScheme='red' type="submit" borderRadius={0}>
                    Delete
                  </Button>
                </Box>
                <Box
                  mb={3}
                  p="6"
                  color='blue.900'
                  borderWidth="2px"
                  borderColor='gray.300'
                  borderRadius={10}
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                >
                  <Text fontWeight="bold" textAlign='center'>
                    Mandatory declaration has not been created yet.
                  </Text>
                  <Button colorScheme="blue" mt={3} >
                    Create Now
                  </Button>
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
                          <Text>Result</Text>
                        </Th>
                        <Th display='flex' justifyContent='flex-end'>
                          {user.role === 'doctor' && medical_record.user_id === user.id && !medical_record.patient_leaving_date && (
                            <IconButton
                              borderRadius='100%'
                              size='sm'
                              color='white'
                              bg='gray.400'
                              onClick={onOpenExamination}
                              icon={<AddIcon />} />
                          )}

                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Examination && Examination.map((Exam, index) => (
                        <Tr key={index}>
                          <Td>{changeFormat(Exam.created_at)}</Td>
                          <Td>{Exam.type}</Td>
                          <Td colSpan='2'>{Exam.result}</Td>
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
              <TabPanel p={0}>
                <Box

                >
                  <MonitoringSheet
                    data={MonitoringSheetData}
                    treatments={Treatments}
                    openMonitoringForm={onOpenMonitoring}
                    openMonitoringEditForm={handleMonitoringSheetEdit}
                    openMonitoringRow={handleMonitoringSheetRow}
                    medical_record={medical_record}
                    user={user}
                    loading={loadingMonitoringSheet}
                  />
                </Box>
              </TabPanel>

              {/* Prescription */}
              {user.id == medical_record.user_id && (
                <TabPanel p={0}>
                  <Table variant="simple">
                    <Thead bg='gray.200'>
                      <Tr>
                        <Th>Medicine</Th>
                        <Th>Quantity</Th>
                        <Th>Date of Prescription</Th>
                        <Th>
                          <Text>status</Text>
                        </Th>
                        <Th display='flex' justifyContent='flex-end'>
                          {user.role === 'doctor' && medical_record.user_id === user.id && !medical_record.patient_leaving_date && (
                            <IconButton
                              borderRadius='100%'
                              size='sm'
                              color='white'
                              bg='gray.400'
                              onClick={onOpenPrescriptionForm}
                              icon={<AddIcon />} />
                          )}
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Prescriptions && Prescriptions.map((pres, index) => (
                        <Tr key={index}>
                          <Td>{pres.medicine.name}</Td>
                          <Td>{pres.quantity}</Td>
                          <Td>{changeFormat(pres.created_at)}</Td>
                          <Td colSpan='2'>
                            {pres.status.toLowerCase() === 'pending' && (
                              <Badge colorScheme='yellow'>Pending</Badge>
                            )}
                            {pres.status.toLowerCase() === 'approved' && (
                              <Badge colorScheme='green'>Approved</Badge>
                            )}
                            {pres.status.toLowerCase() === 'rejected' && (
                              <Badge colorScheme='red'>Rejected</Badge>
                            )}
                          </Td>
                        </Tr>
                      ))}
                      {!loadingPrescription && Prescriptions.length === 0 && (
                        <Tr><Td colSpan={4} p={5}><Text textAlign='center' fontWeight='bold' fontSize='lg'>No Prescription</Text></Td></Tr>
                      )}
                    </Tbody>
                  </Table>
                  {loadingPrescription && (
                    <Center p='10px'>
                      <Spinner thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl' />
                    </Center>
                  )}

                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
          <Divider />
        </>
      )
      }

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
              <MonitoringSheetForm medical_record={medical_record} closeModal={onCloseMonitoring} closeAndRefresh={handleMonitoringSheetAdd} EditInfo={MonitoringSheetEditInfo} />
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

        {/* prescription modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenPrescriptionForm} onClose={onClosePrescriptionForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Prescription</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5} pt={0}>
              <PrescriptionForm medical_record={medical_record} closeModal={onClosePrescriptionForm} closeAndRefresh={handlePrescriptionAdd} />
            </ModalBody>
          </ModalContent>
        </Modal>

      </Box>


    </Box >
  );
};
export default MedicalRecord;

