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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

// Hooks
import useLoader from "../hooks/useLoader";
import useDelete from "../hooks/useDelete";
import { useNavigate } from "react-router-dom";

// Components
import ExaminationForm from "./ExaminationForm";
import ObservationForm from "./ObservationForm";
import OBservationImages from "./ObservationImages";
import MonitoringSheet from "./MonitoringSheet";
import MonitoringSheetForm from "./MonitoringSheetForm";
import MonitoringSheetRow from "./MonitoringSheetRow";
import PrescriptionForm from "./PrescriptionForm";


const MedicalRecord = ({ medical_record, user, editRecord }) => {
  const toast = useToast()
  const navigate = useNavigate()

  const [tabIndex, setTabIndex] = useState(0)

  const [Examination, setExamination] = useState([]);
  const [ExaminationEditMode, setExaminationEditMode] = useState(false)
  const [ExaminationEditInfo, setExaminationEditInfo] = useState(null)

  const [Observations, setObservations] = useState([]);
  const [Observation, setObservation] = useState([]);

  const [MonitoringSheetData, setMonitoringSheetData] = useState([]);
  const [MonitoringSheetRowData, setMonitoringSheetRow] = useState(null);
  const [Treatments, setTreatments] = useState([]);
  const [MonitoringSheetEditInfo, setMonitoringSheetEditInfo] = useState(null)

  const [Prescriptions, setPrescriptions] = useState([]);


  const [deleteLoading, setDeleteLoading] = useState(false)
  const [loadingExamination, setLoadingExamination] = useState(false)
  const [loadingObservation, setLoadingObservation] = useState(false)
  const [loadingMonitoringSheet, setLoadingMonitoringSheet] = useState(false)
  const [loadingMonitoringSheetRow, setLoadingMonitoringSheetRow] = useState(false)
  const [loadingPrescription, setLoadingPrescription] = useState(false)

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
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

    // handleExamination(medical_record.id)
    // handleObservation(medical_record.id)
    // handleMonitoringSheet(medical_record.id)
    // handlePrescription(medical_record.id)

    // check if there is anchor in url
    if (window.location.hash) {
      let anchor = window.location.hash
      switch (anchor) {
        case '#examination':
          setTabIndex(1)
          break;
        case '#observation':
          setTabIndex(2)
          break;
        case '#monitoring':
          setTabIndex(3)
          break;
        case '#prescription':
          setTabIndex(4)
          break;
        default:
          setTabIndex(0)
          break;
      }
    }
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
        if (Examination.length == 0) { 
          handleExamination(medical_record.id)
        }
        break;
      case 2:
        console.log('hihihi')
        if (Observations.length == 0) {
          handleObservation(medical_record.id)
        }
        break;
      case 3:
        if (MonitoringSheetData.length == 0) {
        } else {
          setMonitoringSheetData([])
          setMonitoringSheetRow(null)
          setTreatments([])
          setMonitoringSheetEditInfo(null)
        }
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

  const handleMedicalRecordDelete = () => {
    setDeleteLoading(true)
    useDelete('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id)
      .then((data) => {
        setDeleteLoading(false)
        toast({
          title: data.message,
          status: data.status,
          duration: 9000,
          isClosable: true,
        })
        window.location = '/patients/' + medical_record.patient_id
      })
      .catch((error) => {
        setDeleteLoading(false)
        toast({
          title: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        onDeleteClose()
      })
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

  const handleExaminationActions = (message) => {
    onCloseExamination()
    setExaminationEditMode(false)
    toast({
      title: message.title,
      status: message.status,
      duration: 9000,
      isClosable: true,
    })
    handleExamination()
  }

  const handleExaminationEdit = (examination) => {
    setExaminationEditInfo(examination)
    setExaminationEditMode(true)
    onOpenExamination()
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
    if (message?.status === 'success') {
      onClosePrescriptionForm()
    }

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
                onClick={ReloadTabContent}
              >
                Observation
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.500' }}
                onClick={ReloadTabContent}
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
                  p={0}
                  color='blue.900'
                  borderWidth="2px"
                  borderColor='gray.300'
                  borderRadius={10}
                  overflow='hidden'
                >
                  <Heading p={5}> Medical Record #{medical_record.id}</Heading>

                  <Stack p={5} mt="4" spacing="4">
                    <Box>
                      <Text fontWeight="bold">Condition description: </Text>
                      {medical_record.condition_description.split('\n').map((item, key) => {
                        return <Text key={key} ml={5}>{item}</Text>
                      })}
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Standard treatment: </Text>
                      {medical_record.standard_treatment.split('\n').map((item, key) => {
                        return <Text key={key} ml={5}>{item}</Text>
                      })}
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
                  {user.id == medical_record.user_id && (
                    <Box
                      color='blue.900'
                      bg='gray.300'
                      display='flex'
                      borderTop='1px'
                      borderColor='gray.300'
                      gap='1px'
                    >
                      <Button leftIcon={<EditIcon />} bg='white' w='50%' variant='outline' border={0} colorScheme="green" type="submit" borderRadius={0} onClick={() => handleMedicalRecordEdit(medical_record)}>
                        Edit
                      </Button>
                      <Button leftIcon={<DeleteIcon />} bg='white' w='50%' variant='outline' border={0} colorScheme="red" type="submit" borderRadius={0} isLoading={deleteLoading} onClick={() => onDeleteOpen()}>
                        Delete
                      </Button>
                    </Box>
                  )}
                </Box>


                <Box
                  mt={3}
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
                          <Td>{Exam.result}</Td>
                          <Td display='flex' justifyContent='flex-end'>
                            {user.role === 'doctor' && medical_record.user_id === user.id && !medical_record.patient_leaving_date && (
                              <IconButton
                                borderRadius='100%'
                                size='sm'
                                color='white'
                                bg='green.400'
                                onClick={() => handleExaminationEdit(Exam)}
                                icon={<EditIcon />} />
                            )}
                          </Td>

                        </Tr>
                      ))}
                      {!loadingExamination && Examination.length === 0 && (
                        <Tr><Td colSpan={4}><Text textAlign='center' fontWeight='bold' fontSize='xl'>No Examination</Text></Td></Tr>
                      )}
                    </Tbody>
                  </Table>
                  {loadingExamination && (
                    <Center p='10px'>
                      <Spinner thickness='5px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='gray.500'
                        size='md' />
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
                    <Spinner thickness='5px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='gray.500'
                      size='md' />
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
                        <Th>
                          <Text>Review</Text>
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
                          <Td>
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
                          <Td colSpan='2'>
                            <Text>
                              {pres.review ? pres.review : 'No Review'}
                            </Text>
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
                      <Spinner thickness='5px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='gray.500'
                        size='md' />
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
      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent maxW='300px' p={5}>

            <AlertDialogBody textAlign='center'>
              <Text fontSize='lg' fontWeight='bold'>Are you sure?</Text>
            </AlertDialogBody>

            <AlertDialogFooter justifyContent='center'>
              <Button onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleMedicalRecordDelete} ml={3} isLoading={deleteLoading}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box>
        {/* examination modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenExamination} onClose={onCloseExamination}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ADD EXAMINATION</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5} pt={0}>
              <ExaminationForm medical_record={medical_record} closeModal={onCloseExamination} closeAndRefresh={handleExaminationActions} editMode={ExaminationEditMode} examination={ExaminationEditInfo} />
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

