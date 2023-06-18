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
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

// Icons
import { DeleteIcon, EditIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";
import { BsFillTrashFill, BsInfoCircle, BsFillImageFill } from "react-icons/bs";
import { AiFillPrinter, AiOutlineCheck, AiOutlineFileText } from "react-icons/ai";
import { FiClipboard } from "react-icons/fi";
import { RiTableFill } from "react-icons/ri";

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
import PrescriptionStyles from "../styles/Prescription.module.css";

// Services
import axios from "./axios";
import { FaPlus } from "react-icons/fa";

// Translation
import { useTranslation } from "react-i18next";


const MedicalRecord = ({ medical_record, user, editRecord }) => {
  const toast = useToast()
  const navigate = useNavigate()

  const { t, i18n } = useTranslation();

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
  const [PrescriptionDeleted, setPrescriptionDeleted] = useState(null);
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
  const { isOpen: isPrescriptionDeleteOpen, onOpen: onPrescriptionDeleteOpen, onClose: onPrescriptionDeleteClose } = useDisclosure()

  const colorModeValue1 = useColorModeValue('gray.700', 'gray.50')
  const colorModeValue2 = useColorModeValue('blue.900', 'gray.300')
  const colorModeValue3 = useColorModeValue('blue.900', 'white')
  const colorModeValue4 = useColorModeValue('gray.50', 'gray.700')
  const colorModeValue5 = useColorModeValue('white', 'gray.700')
  const colorModeValue6 = useColorModeValue('#fafafa', 'gray.800')
  const colorModeValue7 = useColorModeValue('gray.50', 'gray.900')
  const colorModeValue8 = useColorModeValue('gray.200', 'gray.700')
  const colorModeValue9 = useColorModeValue('gray.300', 'gray.700')
  const colorModeValue10 = useColorModeValue('blue.900', 'gray.500')
  const colorModeValue11 = useColorModeValue('white', 'gray.900')
  const colorModeValue12 = useColorModeValue('blue.700', 'gray.300')
  const colorModeValue13 = useColorModeValue('#1a365d', '#718096')


  const breakpointss = {
    sm: '30em', // 480px
    md: '48em', // 768px
    lg: '62em', // 992px
    xl: '80em', // 1280px
    '2xl': '96em', // 1536px
  }

  useEffect(() => {
    setExamination([])
    setObservation([])
    // setMonitoringSheetData([])
    // setMonitoringSheetRow(null)
    // setTreatments([])
    setMonitoringSheetEditInfo(null)
    setPrescriptions([])

    if (user.role == 'doctor') {
      handleMandatoryDeclaration()
    }

    // handleExamination(medical_record.id)
    // handleObservation(medical_record.id)
    // handleMonitoringSheet(medical_record.id)
    // handlePrescription(medical_record.id)

    // check if there is anchor in url
    if (window.location.hash) {
      let anchor = window.location.hash
      switch (anchor) {
        case '#examination':
          if (user.id !== medical_record.user_id) {
            NotAuthorized()
          } else {
            setTabIndex(1)
            handleExamination()
          }

          break;
        case '#observation':
          if (user.id !== medical_record.user_id) {
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
          if (user.id !== medical_record.user_id) {
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
  }, [medical_record])

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
    setExamination([])
    setObservation([])
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
          title: err?.response?.data?.message || err?.message,
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
          title: t('medicalRecord.examinationInfo.deleted'),
          status: 'success',
        }
      )
    }).catch((err) => {
      handleExaminationActions(
        {
          title: err?.response?.data?.message || err,
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
          title: err?.response?.data?.message || err,
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
          title: err?.response?.data?.message || err,
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
          title: err?.response?.data?.message || err,
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
          title: err?.response?.data?.message || err,
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
  const handlePrescriptionDelete = () => {
    setDeleteLoading(true)
    useDelete('/patients/' + medical_record.patient_id + '/medical-records/' + medical_record.id + '/prescriptions/' + PrescriptionDeleted)
      .then((data) => {
        toast({
          title: data.message,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        handlePrescription()
      })
      .catch((err) => {
        toast({
          title: err?.response?.data?.message || err,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })
      .finally(() => {
        setDeleteLoading(false)
        onPrescriptionDeleteClose()
      })

  }

  const handlePrintPrescription = async (prescription) => {
    try {
      setLoadingPrescriptionDownload(true);
      setPrescriptionDownloaded(prescription.id)
      const response = await axios.get(`http://134.122.75.238:8000/api/patients/${medical_record.patient_id}/medical-records/${medical_record.id}/prescriptions/${prescription.id}/pdf`, {
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
          <Tabs isFitted variant='unstyled' color={colorModeValue3} mb={5} index={tabIndex} onChange={handleTabsChange}>
            <TabList mb='1em' bg={colorModeValue9} borderRadius={10} overflow='auto'>

              <Tab borderLeftRadius={10} _selected={{ color: 'white', bg: 'blue.500' }}>
                <Icon h='30px' fontSize='30px' as={BsInfoCircle} display={{ base: 'block', lg: 'none' }} />
                <Text display={{ base: 'none', lg: 'block' }} ml={2}>
                  {t('medicalRecord.information')}
                </Text>
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.500' }}
                onClick={ReloadTabContent}
                isDisabled={user.role == 'doctor' ? false : true}
              >
                <Icon h='30px' fontSize='30px' as={FiClipboard} display={{ base: 'block', lg: 'none' }} />
                <Text display={{ base: 'none', lg: 'block' }} ml={2}>
                  {t('medicalRecord.examinations')}
                </Text>
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.500' }}
                onClick={ReloadTabContent}
                isDisabled={user.role == 'doctor' ? false : true}
              >
                <Icon h='30px' fontSize='30px' as={BsFillImageFill} display={{ base: 'block', lg: 'none' }} />
                <Text display={{ base: 'none', lg: 'block' }} ml={2}>
                  {t('medicalRecord.observations')}
                </Text>
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'blue.500' }}
                onClick={ReloadTabContent}
              >
                <Icon h='30px' fontSize='30px' as={RiTableFill} display={{ base: 'block', lg: 'none' }} />
                <Text display={{ base: 'none', lg: 'block' }} ml={2}>
                  {t('medicalRecord.monitoringSheet')}
                </Text>
              </Tab>
              <Tab
                borderRightRadius={10} _selected={{ color: 'white', bg: 'blue.500' }}
                onClick={ReloadTabContent}
                isDisabled={user.role == 'doctor' ? false : true}
              >
                <Icon h='30px' fontSize='30px' as={AiOutlineFileText} display={{ base: 'block', lg: 'none' }} />
                <Text display={{ base: 'none', lg: 'block' }} ml={2}>
                  {t('medicalRecord.prescriptions')}
                </Text>
              </Tab>
            </TabList>
            <TabPanels>
              {/*  Info Tab */}
              <TabPanel p={0}>
                {/* Medical Record main information */}
                <Box
                  p={0}
                  color={colorModeValue3}
                  borderWidth="2px"
                  borderColor='gray.300'
                  borderRadius={10}
                  overflow='hidden'
                >
                  {/* <Heading p={5}> Medical Record #{medical_record.id}</Heading> */}

                  <Box bg={colorModeValue4} p='20px' px='20px' boxShadow='sm'>
                    <Text
                      fontSize={25}
                      color={colorModeValue1}
                    >
                      {t('medicalRecord.medicalRecord')}
                      #{medical_record.id}
                    </Text>
                    <Box mt={4}>
                      <Table className={styles.table} variant="unstyled">
                        <Tbody fontSize={18}>
                          <Tr>
                            <Td color={colorModeValue1}><Text>{t('medicalRecord.createdBy')}:</Text></Td>
                            <Td color={colorModeValue2}><Text>{medical_record.assigned_doctor.first_name + " " + medical_record.assigned_doctor.last_name}</Text></Td>
                          </Tr>
                          <Tr>
                            <Td color={colorModeValue1}><Text>{t('medicalRecord.stateUponEnter')}:</Text></Td>
                            <Td color={colorModeValue2}><Text>{medical_record.state_upon_enter}</Text></Td>
                          </Tr>
                          <Tr >
                            <Td color={colorModeValue1}><Text>{t('medicalRecord.conditionDescription')}:</Text></Td>
                            <Td color={colorModeValue2}>
                              {medical_record.condition_description.split('\n').map((item, key) => {
                                return <Text key={key} mt={2}>{item}</Text>
                              })}
                            </Td>
                          </Tr>
                          {user.role == 'doctor' && (
                            <Tr>
                              <Td color={colorModeValue1}><Text>{t('medicalRecord.standardTreatment')}:</Text></Td>
                              <Td color={colorModeValue2}>
                                {medical_record.standard_treatment.split('\n').map((item, key) => {
                                  return <Text key={key} mt={2}>{item}</Text>
                                })}
                              </Td>
                            </Tr>
                          )}
                          <Tr>
                            <Td color={colorModeValue1}><Text>{t('medicalRecord.patientEntryDate')}:</Text></Td>
                            <Td color={colorModeValue2}><Text>{medical_record.patient_entry_date}</Text></Td>
                          </Tr>
                          <Tr>
                            <Td color={colorModeValue1}><Text>{t('medicalRecord.bedNumber')}:</Text></Td>
                            <Td color={colorModeValue2}><Text>{medical_record.bed_number}</Text></Td>
                          </Tr>
                          {medical_record.patient_leaving_date && (
                            <>
                              <Tr>
                                <Td color='red.400' colSpan={2}><Text>{t('medicalRecord.leavingInformation')}:</Text></Td>
                              </Tr>
                              <Tr>
                                <Td color={colorModeValue1}><Text>{t('medicalRecord.stateUponExit')}:</Text></Td>
                                <Td color={colorModeValue2}>
                                  <Text>
                                    {medical_record.state_upon_exit || "Still in hospital"}
                                  </Text>
                                </Td>

                              </Tr>
                              <Tr>
                                <Td color={colorModeValue1}><Text>{t('medicalRecord.patientLeavingDate')}:</Text></Td>
                                <Td color={colorModeValue2}>
                                  <Text>
                                    {medical_record.patient_leaving_date
                                      ? medical_record.patient_leaving_date
                                      : t("medicalRecord.stillInHospital")}
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
                      color={colorModeValue3}
                      bg={colorModeValue5}
                      display='flex'
                      borderTop='1px'
                      borderColor='gray.300'
                      gap='1px'
                    >
                      <Button leftIcon={<EditIcon />} w='100%' variant='outline' border={0} colorScheme="green" type="submit" borderRadius={0} onClick={() => handleMedicalRecordEdit(medical_record)}>
                        {t('patient.details.edit')}
                      </Button>
                      {/* <Button leftIcon={<DeleteIcon />} w='50%' variant='outline' border={0} colorScheme="red" type="submit" borderRadius={0} isLoading={deleteLoading} onClick={() => onDeleteOpen()}>
                        {t('patient.details.delete')}
                      </Button> */}
                    </Box>
                  )}
                </Box>

                {user.role == 'doctor' && (
                  <Box
                    mt={3}
                    p="6"
                    color={colorModeValue3}
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
                              {t('medicalRecord.mandatoryDeclaration')}
                            </Text>
                            {user.id == medical_record.user_id && (
                              <Button colorScheme="blue" mt={3} onClick={() => {
                                setMandatoryDeclarationEditMode(true)
                                onOpenMandatoryDeclaration()
                              }}>
                                {t('global.edit')}
                              </Button>
                            )}
                          </Box>
                          <Table variant='simple' colorScheme='blackAlpha' >
                            <Thead>
                              <Tr bg={colorModeValue6}>
                                <Th><Text>{t('medicalRecord.declarationDate')}</Text></Th>
                                <Th><Text>{t('medicalRecord.diagnosis')}</Text></Th>
                                <Th><Text>{t('medicine.detail')}</Text></Th>
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
                            {t('medicalRecord.noMandatoryDeclaration')}
                          </Text>
                          <Button colorScheme="blue" mt={3} onClick={onOpenMandatoryDeclaration}>
                            {t('medicalRecord.createNow')}
                          </Button>
                        </>
                      )

                      : (
                        <Spinner />
                      )}
                  </Box>
                )}

              </TabPanel>

              {/*  Examination Tab */}
              <TabPanel p={0}>
                <Box >
                  <Table variant='simple' colorScheme='blackAlpha' >
                    <Thead>
                      <Tr bg={colorModeValue6}>
                        <Th>
                          <Text>
                            {t('medicalRecord.examinationDate')}
                          </Text>
                        </Th>
                        <Th>
                          <Text>
                            {t('prescription.doctor')}
                          </Text>
                        </Th>
                        <Th>
                          <Text>
                            {t('medicalRecord.treatmentType')}
                          </Text>
                        </Th>
                        <Th pr={3}>
                          <Text>
                            {t('medicalRecord.examinationResult')}
                          </Text>
                        </Th>
                        <Th display='flex' justifyContent='flex-end'>
                          {user.role === 'doctor' && !medical_record.patient_leaving_date && (
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
                          <Td>{Exam?.doctor?.first_name + " " + Exam?.doctor?.last_name}</Td>
                          <Td>{Exam.type}</Td>
                          <Td>
                            {Exam.result}
                          </Td>
                          <Td display='flex' justifyContent='flex-end'>
                            {user.role === 'doctor' && user.id === Exam?.doctor?.id && !medical_record.patient_leaving_date ? (
                              <>
                                <IconButton
                                  borderRadius='100%'
                                  mx={2}
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
                            ) : (
                              <Box>
                                [not owned]
                              </Box>
                            )}
                          </Td>

                        </Tr>
                      ))}
                      {!loadingExamination && Examination.length === 0 && (
                        <Tr><Td colSpan={4}><Text textAlign='center' fontWeight='bold' fontSize='xl'>{t('medicalRecord.noExamination')}</Text></Td></Tr>
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
                {user.role === 'doctor' && !medical_record.patient_leaving_date && (
                  <Flex justify='flex-end' mb='15px'>
                    <Button colorScheme='green' onClick={onOpenObservation} mr={3}>
                      <Text>
                        {t('medicalRecord.addObservation')}
                      </Text>
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
                          borderColor={colorModeValue10}
                          top="0px"
                        ></Box>
                        <Box pos="relative" p="10px">
                          <Text
                            pos="absolute"
                            width="70px"
                            height="35px"
                            bottom="0"
                            right={i18n.dir() === 'rtl' ? "-20px" : 'unset'}
                            top="-8px"
                            left={i18n.dir() === 'rtl' ? 'unset' : "-20px"}
                            fontSize="2xl"
                            backgroundSize="cover"
                            backgroundRepeat="no-repeat"
                            backgroundPosition="center center"
                            backgroundColor={colorModeValue11}
                            color={colorModeValue12}
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
                            borderColor: i18n.dir() === 'rtl' ? `transparent transparent transparent ${colorModeValue13}` : `transparent ${colorModeValue13} transparent transparent`,
                            borderStyle: 'solid',
                            borderWidth: i18n.dir() === 'rtl' ? '15px 15px 15px 15px' : '15px 15px 15px 0',
                            position: 'absolute',
                            left: i18n.dir() === 'rtl' ? 'unset' : '-15px',
                            right: i18n.dir() === 'rtl' ? '-30px' : 'unset',
                            top: 'calc(50% - 15px)',
                            display: 'block',
                          }}>
                          <Box bg={colorModeValue10} p={2} w='100%' borderTopRadius={10} overflow='hidden'>
                            <Text
                              textAlign='center'
                              fontWeight='bold'
                              fontSize='md'
                              color='gray.200'
                              textShadow='2px 2px 8px black'
                            >
                              {obs.name}
                            </Text>
                          </Box>

                          <Flex p='20px' gap='20px' maxW='870px' bg={colorModeValue10} flexWrap='wrap' borderBottomRadius={10} overflow='hidden'>
                            {obs.images && obs.images.map((img, index) => (
                              <Box
                                key={index}
                                p={2}
                                bgImage={'http://134.122.75.238:8000/storage/images/' + img.path}
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
                    <Text textAlign='center'>
                      {t('medicalRecord.noObservation')}
                    </Text>
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
                <Box>
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
              <TabPanel p={0}>
                {user.role == 'doctor' && !medical_record.patient_leaving_date && (
                  <Box>
                    <Flex justify='flex-end' mb='15px'>
                      <Button colorScheme='green' onClick={onOpenPrescriptionForm} mr={3}>
                        <Text>
                          {t('medicalRecord.addPrescription')}
                        </Text>
                      </Button>
                    </Flex>
                  </Box>
                )}
                <Box p={0} bg={colorModeValue7} boxShadow='lg' border='1px' borderColor='gray.300' borderRadius='lg' overflow='hidden'>

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
                          <AccordionButton _hover={{ bg: colorModeValue8 }}>
                            <Box flex="1" textAlign="left">
                              <Text fontWeight='bold' fontSize='xl'>
                                {`${pres.doctor.first_name} ${pres.doctor.last_name} ${t('prescription.prescription')} #${pres.id}`}
                              </Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <Box display='flex' justifyContent='flex-end' mb={2} gap='10px'>
                              {user.role === 'doctor' && user.id === pres.doctor.id && !medical_record.patient_leaving_date && (
                                <>
                                  <Button colorScheme='green' onClick={() => handlePrescriptionEdit(pres)}>
                                    <EditIcon fontSize='20px' />
                                    <Text ml={2}>
                                      {t('global.edit')}
                                    </Text>
                                  </Button>
                                  <Button colorScheme='red' onClick={() => {
                                    setPrescriptionDeleted(pres.id)
                                    onPrescriptionDeleteOpen()
                                  }}>
                                    <DeleteIcon fontSize='20px' />
                                    <Text ml={2}>
                                      {t('global.delete')}
                                    </Text>
                                  </Button>
                                </>

                              )}
                              <Button w='150px' colorScheme='teal' onClick={() => handlePrintPrescription(pres)} isLoading={loadingPrescriptionDownload && PrescriptionDownloaded == pres.id}>
                                <AiFillPrinter fontSize='20px' />
                                <Text ml={2}>
                                  {t('global.print')}
                                </Text>
                              </Button>
                            </Box>

                            <Table variant="simple" colorScheme='blackAlpha' className={PrescriptionStyles.table} border='2px' borderColor='gray.300'>
                              <Thead bg={colorModeValue6}>
                                <Tr>
                                  <Th>
                                    {t('medicalRecord.medicine')}
                                  </Th>
                                  <Th>
                                    {t('medicalRecord.quantity')}
                                  </Th>
                                  <Th>
                                    {t('medicalRecord.dateOfPrescription')}
                                  </Th>
                                  <Th>
                                    <Text textAlign='center'>
                                      {t('medicalRecord.status')}
                                    </Text>
                                  </Th>
                                  <Th>
                                    <Text>
                                      {t('medicalRecord.review')}
                                    </Text>
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
                                        <Badge colorScheme="yellow">
                                          {t('medicalRecord.pending')}
                                        </Badge>
                                      )}
                                      {med.status === 'Approved' && (
                                        <Badge colorScheme="green">
                                          {t('medicalRecord.approved')}
                                        </Badge>
                                      )}
                                      {med.status === 'Rejected' && (
                                        <Badge colorScheme="red">
                                          {t('medicalRecord.rejected')}
                                        </Badge>
                                      )}
                                    </Td>
                                    <Td>
                                      {med.review && (
                                        <Text>{med.review}</Text>
                                      )}
                                      {!med.review && (
                                        <Badge colorScheme="yellow">
                                          {t('medicalRecord.notReviewed')}
                                        </Badge>
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
                      <Text p={5} fontSize='xl' fontWeight='bold' textAlign='center'>
                        {t('medicalRecord.noPrescriptionFound')}
                      </Text>
                    </Box>
                  )}
                </Box>
              </TabPanel>
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
              <Text fontSize='lg' fontWeight='bold'>
                {t('medicalRecord.areYouSure')}
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter justifyContent='center'>
              <Button onClick={onDeleteClose}>
                {t('global.cancel')}
              </Button>
              <Button colorScheme='red' onClick={handleMedicalRecordDelete} ml={3} isLoading={deleteLoading}>
                {t('global.delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Box>
        {/* examination modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenExamination} onClose={onCloseExamination}>
          <ModalOverlay />
          <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }}>
            <ModalHeader>
              {t('medicalRecord.addExamination').toUpperCase()}
            </ModalHeader>
            <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0.75rem', left: i18n.dir() == 'rtl' ? '0.75rem' : 'unset' }} />
            <ModalBody pb={5} pt={0}>
              <ExaminationForm medical_record={medical_record} closeModal={onCloseExamination} closeAndRefresh={handleExaminationActions} editMode={ExaminationEditMode} examination={ExaminationEditInfo} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* observation modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenObservation} onClose={onCloseObservation}>
          <ModalOverlay />
          <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }} maxW='1000px'>
            <ModalHeader>
              {t('medicalRecord.addObservation').toUpperCase()}
            </ModalHeader>
            <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0.75rem', left: i18n.dir() == 'rtl' ? '0.75rem' : 'unset' }} />
            <ModalBody pb={5} pt={0}>
              <ObservationForm medical_record={medical_record} closeModal={onCloseObservation} closeAndRefresh={handleObservationAdd} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* observation images modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenObservationImages} onClose={onCloseObservationImages}>
          <ModalOverlay />
          <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }} maxW='1000px'>
            <ModalHeader>
              {t('medicalRecord.observationInformation')}
            </ModalHeader>
            <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0.75rem', left: i18n.dir() == 'rtl' ? '0.75rem' : 'unset' }} />
            <ModalBody pb={5} pt={0}>
              <OBservationImages Observation={Observation} closeAndRefresh={handleObservationAdd} patientId={medical_record.patient_id} user={user} medical_record={medical_record} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* monitoring sheet modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenMonitoring} onClose={onCloseMonitoring}>
          <ModalOverlay />
          <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }}>
            <ModalHeader>
              {t('medicalRecord.monitoringSheet')}
            </ModalHeader>
            <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0.75rem', left: i18n.dir() == 'rtl' ? '0.75rem' : 'unset' }} />
            <ModalBody pb={5} pt={0}>
              <MonitoringSheetForm medical_record={medical_record} closeModal={onCloseMonitoring} closeAndRefresh={handleMonitoringSheetAdd} EditInfo={MonitoringSheetEditInfo} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* monitoring sheet row edit model */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenMonitoringSheetRow} onClose={onCloseMonitoringSheetRow}>
          <ModalOverlay />
          <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }} maxW='600px'>
            <ModalHeader>
              {t('medicalRecord.monitoringSheetInfo.monitoringSheetRow')}
            </ModalHeader>
            <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0.75rem', left: i18n.dir() == 'rtl' ? '0.75rem' : 'unset' }} />
            <ModalBody pb={5} pt={0}>
              <MonitoringSheetRow user={user} medical_record={medical_record} data={MonitoringSheetRowData} closeModal={onCloseMonitoringSheetRow} closeAndRefresh={handleMonitoringSheetAdd} loadingData={loadingMonitoringSheetRow} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* prescription modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenPrescriptionForm} onClose={handlePrescriptionFormClose}>
          <ModalOverlay />
          <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }} maxW='1000px'>
            <ModalHeader>
              {t('medicalRecord.prescription')}
            </ModalHeader>
            <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0.75rem', left: i18n.dir() == 'rtl' ? '0.75rem' : 'unset' }} />
            <ModalBody pb={5} pt={0}>
              <PrescriptionForm medical_record={medical_record} closeModal={handlePrescriptionFormClose} closeAndRefresh={handlePrescriptionAdd} EditMode={PrescriptionEditMode} prescription={PrescriptionEditInfo} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <AlertDialog
          isOpen={isPrescriptionDeleteOpen}
          onClose={onPrescriptionDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent maxW='300px' p={5}>

              <AlertDialogBody textAlign='center'>
                <Text fontSize='lg' fontWeight='bold'>
                  {t('medicalRecord.areYouSure')}
                </Text>
              </AlertDialogBody>

              <AlertDialogFooter justifyContent='center'>
                <Button onClick={onPrescriptionDeleteClose}>
                  {t('global.cancel')}
                </Button>
                <Button colorScheme='red' onClick={handlePrescriptionDelete} ml={3} isLoading={deleteLoading}>
                  {t('global.delete')}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* mandatory declaration modal */}
        <Modal blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isOpenMandatoryDeclaration} onClose={onCloseMandatoryDeclaration}>
          <ModalOverlay />
          <ModalContent style={{ direction: i18n.dir(), "fontFamily": i18n.dir() == 'rtl' ? "changa" : 'Light' }}>
            <ModalHeader>
              {t('medicalRecord.mandatoryDeclaration')}
            </ModalHeader>
            <ModalCloseButton style={{ right: i18n.dir() == 'rtl' ? 'unset' : '0.75rem', left: i18n.dir() == 'rtl' ? '0.75rem' : 'unset' }} />
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

