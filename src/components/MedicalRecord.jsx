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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

// Icons
import { DeleteIcon, EditIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillPrinter, AiOutlineCheck } from "react-icons/ai";


// Hooks
import useLoader from "../hooks/useLoader";
import useDelete from "../hooks/useDelete";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Components
import ExaminationForm from "./ExaminationForm";
import ObservationForm from "./ObservationForm";
import OBservationImages from "./ObservationImages";
import MonitoringSheet from "./MonitoringSheet";
import MonitoringSheetForm from "./MonitoringSheetForm";
import MonitoringSheetRow from "./MonitoringSheetRow";
import PrescriptionForm from "./PrescriptionForm";
import MandatoryDeclarationForm from "./mandatory-declaration/MandatoryDeclarationForm";

// Styles
import styles from "../styles/MedicalRecord.module.css";
import MonitoringSheetStyles from "../styles/MonitoringSheet.module.css";

// Services
import axios from "./axios";
import { FaPlus } from "react-icons/fa";


const MedicalRecord = ({ medical_record, user, editRecord }) => {
  const toast = useToast()
  const navigate = useNavigate()

  const [tabIndex, setTabIndex] = useState(0)

  const [Examination, setExamination] = useState([]);
  const [ExaminationEditMode, setExaminationEditMode] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [ExaminationEditInfo, setExaminationEditInfo] = useState(null)

  const [Observations, setObservations] = useState([]);
  const [Observation, setObservation] = useState([]);

  const [MonitoringSheetData, setMonitoringSheetData] = useState([]);
  const [MonitoringSheetRowData, setMonitoringSheetRow] = useState(null);
  const [Treatments, setTreatments] = useState([]);
  const [MonitoringSheetEditInfo, setMonitoringSheetEditInfo] = useState(null)

  const [Prescriptions, setPrescriptions] = useState([]);
  const [PrescriptionDownloaded, setPrescriptionDownloaded] = useState(null);
  const [PrescriptionEditMode, setPrescriptionEditMode] = useState(false)
  const [PrescriptionEditInfo, setPrescriptionEditInfo] = useState(null)

  const [MandatoryDeclaration, setMandatoryDeclaration] = useState(null)
  const [MandatoryDeclarationEditMode, setMandatoryDeclarationEditMode] = useState(false)


  const [deleteLoading, setDeleteLoading] = useState(false)
  const [loadingExamination, setLoadingExamination] = useState(false)
  const [loadingObservation, setLoadingObservation] = useState(false)
  const [loadingMonitoringSheet, setLoadingMonitoringSheet] = useState(false)
  const [loadingMonitoringSheetRow, setLoadingMonitoringSheetRow] = useState(false)
  const [loadingPrescription, setLoadingPrescription] = useState(false)
  const [loadingPrescriptionDownload, setLoadingPrescriptionDownload] = useState(false)
  const [loadingMandatoryDeclaration, setLoadingMandatoryDeclaration] = useState(true)

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isOpenExamination, onOpen: onOpenExamination, onClose: onCloseExamination } = useDisclosure()
  const { isOpen: isOpenObservation, onOpen: onOpenObservation, onClose: onCloseObservation } = useDisclosure()
  const { isOpen: isOpenPrescription, onOpen: onOpenPrescription, onClose: onClosePrescription } = useDisclosure()
  const { isOpen: isOpenMonitoring, onOpen: onOpenMonitoring, onClose: onCloseMonitoring } = useDisclosure()
  const { isOpen: isOpenObservationImages, onOpen: onOpenObservationImages, onClose: onCloseObservationImages } = useDisclosure()
  const { isOpen: isOpenMonitoringSheetRow, onOpen: onOpenMonitoringSheetRow, onClose: onCloseMonitoringSheetRow } = useDisclosure()
  const { isOpen: isOpenPrescriptionForm, onOpen: onOpenPrescriptionForm, onClose: onClosePrescriptionForm } = useDisclosure()
  const { isOpen: isOpenMandatoryDeclaration, onOpen: onOpenMandatoryDeclaration, onClose: onCloseMandatoryDeclaration } = useDisclosure()

  useEffect(() => {
    setExamination([])
    setObservation([])
    // setMonitoringSheetData([])
    // setMonitoringSheetRow(null)
    // setTreatments([])
    setMonitoringSheetEditInfo(null)
    setPrescriptions([])


    handleMandatoryDeclaration()

    // handleExamination(medical_record.id)
    // handleObservation(medical_record.id)
    // handleMonitoringSheet(medical_record.id)
    // handlePrescription(medical_record.id)

    // check if there is anchor in url
    if (window.location.hash) {
      let anchor = window.location.hash
      switch (anchor) {
        case '#examination':
          if (user.role !== 'doctor') {
            NotAuthorized()
          } else {
            setTabIndex(1)
            handleExamination()
          }

          break;
        case '#observation':
          if (user.role !== 'doctor') {
            NotAuthorized()
          } else {
            setTabIndex(2)
            handleObservation()
          }

          break;
        case '#monitoring':
          setTabIndex(3)
          handleMonitoringSheet()
          break;
        case '#prescription':
          if (user.role !== 'doctor') {
            NotAuthorized()
          } else {
            setTabIndex(4)
            handlePrescription()
          }

          break;
        default:
          setTabIndex(0)
          break;
      }
      ReloadTabContent()
    }
  }, [medical_record, tabIndex])

  const NotAuthorized = () => {
    toast({
      title: "You are not authorized to view this page",
      status: "error",
      duration: 3000,
      isClosable: true,
    })
    window.location.hash = ''
    setTabIndex(0)
  }
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
    setLoadingExamination(true)
    setLoadingMonitoringSheet(true)
    setLoadingPrescription(true)
    setTabIndex(index)
  }

  const ReloadTabContent = () => {
    switch (tabIndex) {
      case 1:
        if (Examination.length == 0) {
          handleExamination()
        }
        break;
      case 2:
        if (Observations.length == 0) {
          handleObservation()
        }
        break;
      case 3:
        if (MonitoringSheetData.length == 0) {
          handleMonitoringSheet()

        } else {

          // setMonitoringSheetData([])
          // setMonitoringSheetRow(null)
          // setTreatments([])
          // setMonitoringSheetEditInfo(null)
        }

        break;
      case 4:
        setPrescriptions([])
        handlePrescription()
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
        toast({
          title: data.message,
          status: data.status,
          duration: 9000,
          isClosable: true,
        })
        window.location = '/patients/' + medical_record.patient_id
      })
      .catch((error) => {
        toast({
          title: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        onDeleteClose()
      })
      .finally(() => {
        setDeleteLoading(false)
      })
  }


  // Examination
  const handleExamination = () => {
    setExamination([])
    setLoadingExamination(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/examinations')
      .then((data) => {
        setExamination(data.data || [])
      })
      .catch((err) => {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })
      .finally(() => {
        setLoadingExamination(false)
      })
  }
  const handleDeleteExaminationConfirm = (Exam) => {
    if (deleteConfirmation) {
      handleDeleteExamination(Exam);
    } else {
      setDeleteConfirmation(true);
    }
  };
  const handleDeleteExamination = (examination) => {
    setDeleteLoading(true);
    useDelete('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/examinations/' + examination.id).then((res) => {
      handleExaminationActions(
        {
          title: 'Examination deleted successfully.',
          status: 'success',
        }
      )
    }).catch((err) => {
      handleExaminationActions(
        {
          title: err.response.data.message,
          status: 'error',
        }
      )
    })
      .finally(() => {
        setDeleteLoading(false)
      })
  };

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
        setObservations(data.data || [])
      })
      .catch((err) => {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })
      .finally(() => {
        setLoadingObservation(false)
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
        console.log('hello')
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
      .catch((err) => {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })
      .finally(() => {
        setLoadingMonitoringSheet(false)
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
        setMonitoringSheetRow(data.data)
      })
      .catch((err) => {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })
      .finally(() => {
        setLoadingMonitoringSheetRow(false)
      })
    onOpenMonitoringSheetRow()
  }

  const refreshMonitoringSheet = () => {
    handleMonitoringSheet()
    setMonitoringSheetData([])
    setMonitoringSheetRow(null)
    setTreatments([])
    setMonitoringSheetEditInfo(null)
  }
  // Prescription
  const handlePrescription = () => {
    setPrescriptions([])
    setLoadingPrescription(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/prescriptions')
      .then((data) => {
        setPrescriptions(data.reverse() || [])
      })
      .catch((err) => {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })
      .finally(() => {
        setLoadingPrescription(false)
      })
  }
  const handlePrescriptionAdd = (message) => {
    onClosePrescriptionForm()

    toast({
      title: message.title,
      description: message?.description,
      status: message.status,
      duration: 9000,
      isClosable: true,
    })
    handlePrescription()
    setPrescriptionEditMode(false)
    setPrescriptionEditInfo(null)
  }
  const handlePrescriptionEdit = (prescription) => {
    setPrescriptionEditMode(true)
    setPrescriptionEditInfo(prescription)
    onOpenPrescriptionForm()
  }



  const handlePrintPrescription = async (prescription) => {
    try {
      setLoadingPrescriptionDownload(true);
      setPrescriptionDownloaded(prescription.id)
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/${medical_record.patient_id}/medical-records/${medical_record.id}/prescriptions/${prescription.id}/pdf`, {
        responseType: 'blob', // Set the response type to 'blob' to receive binary data
      });
      // Create a temporary link element
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Set the download attribute with the desired file name
      link.setAttribute('download', 'prescription.pdf');

      // Append the link to the document body and trigger the download
      document.body.appendChild(link);
      link.click();


      // Clean up by removing the temporary link
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading prescription:', error);
    } finally {
      setLoadingPrescriptionDownload(false);
      setPrescriptionDownloaded(null)
    }
  }

  const handlePrescriptionFormClose = () => {
    setPrescriptionEditMode(false)
    setPrescriptionEditInfo(null)
    handlePrescription()
    onClosePrescriptionForm()
  }

  // Mandatory Declaration

  const handleMandatoryDeclaration = () => {
    setMandatoryDeclaration(null)
    setLoadingMandatoryDeclaration(true)
    useLoader('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/mandatory-declaration')
      .then((data) => {
        setMandatoryDeclaration(data.data || null)
      })
      .finally(() => {
        setLoadingMandatoryDeclaration(false)
      })
  }

  const handleMandatoryDeclarationAdd = (message) => {
    onCloseMandatoryDeclaration()
    toast({
      title: message.title,
      description: message?.description,
      status: message.status,
      duration: 9000,
      isClosable: true,
    })
    handleMandatoryDeclaration()
    setMandatoryDeclarationEditMode(false)
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
                isDisabled={user.id == medical_record.user_id ? false : true}
              >
                Examination
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.500' }}
                onClick={ReloadTabContent}
                isDisabled={user.id == medical_record.user_id ? false : true}
              >
                Observation
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.500' }}
                onClick={ReloadTabContent}
              >
                Monitoring Sheet
              </Tab>
              <Tab
                borderRightRadius={10} _selected={{ color: 'white', bg: 'blue.500' }}
                onClick={ReloadTabContent}
                isDisabled={user.id == medical_record.user_id ? false : true}
              >
                Prescriptions
              </Tab>
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
                  {/* <Heading p={5}> Medical Record #{medical_record.id}</Heading> */}

                  <Box bg='gray.50' p='20px' px='20px' boxShadow='sm'>
                    <Text
                      fontSize={25}
                      color='gray.700'
                    >
                      Medical Record #{medical_record.id}
                    </Text>
                    <Box mt={4}>
                      <Table className={styles.table} variant="unstyled">
                        <Tbody fontSize={18}>
                          <Tr >
                            <Td color='gray.700'><Text>Condition description:</Text></Td>
                            <Td color='blue.900'>
                              {medical_record.condition_description.split('\n').map((item, key) => {
                                return <Text key={key} mt={2}>{item}</Text>
                              })}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td color='gray.700'><Text>Standard treatment:</Text></Td>
                            <Td color='blue.900'>
                              {medical_record.standard_treatment.split('\n').map((item, key) => {
                                return <Text key={key} mt={2}>{item}</Text>
                              })}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td color='gray.700'><Text>State upon enter:</Text></Td>
                            <Td color='blue.900'><Text>{medical_record.state_upon_enter}</Text></Td>
                          </Tr>
                          <Tr>
                            <Td color='gray.700'><Text>Patient entry date:</Text></Td>
                            <Td color='blue.900'><Text>{medical_record.patient_entry_date}</Text></Td>
                          </Tr>
                          <Tr>
                            <Td color='gray.700'><Text>Bed number:</Text></Td>
                            <Td color='blue.900'><Text>{medical_record.bed_number}</Text></Td>
                          </Tr>
                          {medical_record.patient_leaving_date && (
                            <>
                              <Tr>
                                <Td color='green.400' colSpan={2}><Text>Leaving Information:</Text></Td>
                              </Tr>
                              <Tr>
                                <Td color='gray.700'><Text>State upon exit:</Text></Td>
                                <Td color='blue.900'>
                                  <Text>
                                    {medical_record.state_upon_exit || "Still in hospital"}
                                  </Text>
                                </Td>

                              </Tr>
                              <Tr>
                                <Td color='gray.700'><Text>Patient leaving date:</Text></Td>
                                <Td color='blue.900'>
                                  <Text>
                                    {medical_record.patient_leaving_date
                                      ? medical_record.patient_leaving_date
                                      : "Still in hospital"}
                                  </Text>
                                </Td>
                              </Tr>
                            </>
                          )}
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
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
                  {!loadingMandatoryDeclaration ?
                    MandatoryDeclaration ? (
                      <>
                        <Box w='100%' display='flex' justifyContent='space-between' alignItems='center' mb={3}>
                          <Text fontWeight="bold" textAlign='left' fontSize={20}>
                            Mandatory Declaration
                          </Text>
                          {user.id == medical_record.user_id && (
                            <Button colorScheme="blue" mt={3} onClick={() => {
                              setMandatoryDeclarationEditMode(true)
                              onOpenMandatoryDeclaration()
                            }}>
                              Edit
                            </Button>
                          )}
                        </Box>
                        <Table variant='simple' colorScheme='blackAlpha' >
                          <Thead>
                            <Tr bg='gray.200'>
                              <Th><Text>Declaration Date</Text></Th>
                              <Th><Text>Diagnosis</Text></Th>
                              <Th><Text>Detailed Diagnosis</Text></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td><Text>{formatDate(MandatoryDeclaration.created_at)}</Text></Td>
                              <Td><Text>{MandatoryDeclaration.diagnosis}</Text></Td>
                              <Td><Text>{MandatoryDeclaration.detail}</Text></Td>
                            </Tr>
                          </Tbody>
                        </Table>

                      </>
                    ) : (
                      <>
                        <Text fontWeight="bold" textAlign='center'>
                          Mandatory declaration has not been created yet.
                        </Text>
                        <Button colorScheme="blue" mt={3} onClick={onOpenMandatoryDeclaration}>
                          Create Now
                        </Button>
                      </>
                    )

                    : (
                      <Spinner />
                    )}
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
                              <>
                                <IconButton
                                  borderRadius='100%'
                                  mr={2}
                                  size='sm'
                                  color='white'
                                  bg='green.400'
                                  onClick={() => handleExaminationEdit(Exam)}
                                  icon={<EditIcon />} />
                                <IconButton
                                  colorScheme='red'
                                  borderRadius='100%'
                                  size='sm'
                                  color='white'
                                  bg='red.400'
                                  onClick={() => handleDeleteExaminationConfirm(Exam)}
                                  isLoading={deleteLoading}
                                  onMouseLeave={() => setDeleteConfirmation(false)}
                                  icon={deleteConfirmation ? <AiOutlineCheck /> : <BsFillTrashFill />} />
                              </>
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
              <TabPanel p={0}>
                {user.role === 'doctor' && medical_record.user_id === user.id && !medical_record.patient_leaving_date && (
                  <Flex justify='flex-end' mb='15px'>
                    <Button colorScheme='green' onClick={onOpenObservation} mr={3}>
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
                          borderColor={'blue.900'}
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
                          boxShadow='2px 2px 8px black'
                          borderRadius={10}
                          _before={{
                            content: `""`,
                            w: '0',
                            h: '0',
                            borderColor: `transparent #1a365d transparent transparent`,
                            borderStyle: 'solid',
                            borderWidth: '15px 15px 15px 0',
                            position: 'absolute',
                            left: '-15px',
                            top: 'calc(50% - 15px)',
                            display: 'block',
                          }}>
                          <Box bg='blue.900' p={2} w='100%' borderTopRadius={10} overflow='hidden'>
                            <Text
                              textAlign='center'
                              fontWeight='bold'
                              fontSize='xl'
                              color='gray.200'
                              textShadow='2px 2px 8px black'
                            >
                              {obs.name}
                            </Text>
                          </Box>

                          <Flex p='5px' gap='5px' maxW='780px' bg='blue.900' flexWrap='wrap' borderBottomRadius={10} overflow='hidden'>
                            {obs.images && obs.images.map((img, index) => (
                              <Box
                                key={index}
                                p={2}
                                bgImage={'http://localhost:8000/storage/images/' + img.path}
                                bgSize='cover'
                                bgPosition='center'
                                boxSize='150px'
                                borderRadius={10}
                                boxShadow='2px 2px 8px black'
                              >
                              </Box>
                            ))}
                          </Flex>
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
                    refresh={refreshMonitoringSheet}
                    user={user}
                    loading={loadingMonitoringSheet}
                  />
                </Box>
              </TabPanel>

              {/* Prescription */}
              {user.id == medical_record.user_id && (
                <TabPanel p={0}>
                  <Box>
                    <Flex justify='flex-end' mb='15px'>
                      <Button colorScheme='green' onClick={onOpenPrescriptionForm} mr={3}>
                        <Text>Add Prescription</Text>
                      </Button>
                    </Flex>
                  </Box>
                  <Box p={2} bg='gray.50' boxShadow='lg' borderRadius='lg' border='2px' borderColor='gray.300' >

                    {loadingPrescription ? (
                      <Center p='10px'>
                        <Spinner thickness='5px'
                          speed='0.65s'
                          emptyColor='gray.200'
                          color='gray.500'
                          size='md' />
                      </Center>
                    ) : Prescriptions.length > 0 ? (

                      <Accordion border='4px' borderColor='gray.300' allowMultiple>
                        {Prescriptions && Prescriptions.map((pres, index) => (
                          <AccordionItem key={index} >
                            <AccordionButton>
                              <Box flex="1" textAlign="left">
                                <Text fontWeight='bold' fontSize='xl'>{pres.name} #{pres.id}</Text>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                              <Box display='flex' justifyContent='flex-end' mb={2} gap='10px'>
                                {user.role === 'doctor' && medical_record.user_id === user.id && !medical_record.patient_leaving_date && (
                                  <Button colorScheme='green' onClick={() => handlePrescriptionEdit(pres)}>
                                    <EditIcon fontSize='20px' />
                                    <Text ml={2}>Edit</Text>
                                  </Button>
                                )}
                                <Button w='100px' colorScheme='teal' onClick={() => handlePrintPrescription(pres)} isLoading={loadingPrescriptionDownload && PrescriptionDownloaded == pres.id}>
                                  <AiFillPrinter fontSize='20px' />
                                  <Text ml={2}>Print</Text>
                                </Button>
                              </Box>

                              <Table variant="simple" colorScheme='blackAlpha' className={MonitoringSheetStyles.table} border='2px' borderColor='gray.300'>
                                <Thead bg='gray.200'>
                                  <Tr>
                                    <Th>Medicine</Th>
                                    <Th>Quantity</Th>
                                    <Th>Date of Prescription</Th>
                                    <Th>
                                      <Text textAlign='center'>status</Text>
                                    </Th>
                                    <Th>
                                      <Text>Review</Text>
                                    </Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {pres.medicine_requests && pres.medicine_requests.map((med, index) => (
                                    <Tr key={index}>
                                      <Td>{med.medicine.name}</Td>
                                      <Td>{med.quantity}</Td>
                                      <Td>{changeFormat(med.created_at)}</Td>
                                      <Td>
                                        {med.status === 'Pending' && (
                                          <Badge colorScheme="yellow">Pending</Badge>
                                        )}
                                        {med.status === 'Approved' && (
                                          <Badge colorScheme="green">Approved</Badge>
                                        )}
                                        {med.status === 'Rejected' && (
                                          <Badge colorScheme="red">Rejected</Badge>
                                        )}
                                      </Td>
                                      <Td>
                                        {med.review && (
                                          <Badge colorScheme="green">Reviewed</Badge>
                                        )}
                                        {!med.review && (
                                          <Badge colorScheme="red">Not Reviewed</Badge>
                                        )}
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>

                            </AccordionPanel>
                          </AccordionItem>
                        ))}

                      </Accordion>
                    ) : (
                      <Box>
                        <Text fontSize='xl' fontWeight='bold' textAlign='center'>
                          No Prescription Found
                        </Text>
                      </Box>
                    )}
                  </Box>
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
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenPrescriptionForm} onClose={handlePrescriptionFormClose}>
          <ModalOverlay />
          <ModalContent maxW='1000px'>
            <ModalHeader>Prescription</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5} pt={0}>
              <PrescriptionForm medical_record={medical_record} closeModal={handlePrescriptionFormClose} closeAndRefresh={handlePrescriptionAdd} EditMode={PrescriptionEditMode} prescription={PrescriptionEditInfo} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* mandatory declaration modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenMandatoryDeclaration} onClose={onCloseMandatoryDeclaration}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Mandatory Declaration</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5} pt={0}>
              <MandatoryDeclarationForm medical_record={medical_record} closeModal={onCloseMandatoryDeclaration} closeAndRefresh={handleMandatoryDeclarationAdd} EditMode={MandatoryDeclarationEditMode} mandatory_declaration={MandatoryDeclaration} />
            </ModalBody>
          </ModalContent>
        </Modal>


      </Box>


    </Box >
  );
};
export default MedicalRecord;

