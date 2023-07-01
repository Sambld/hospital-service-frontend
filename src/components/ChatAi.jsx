import {
  Box,
  Button,
  Center,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { FiInfo } from "react-icons/fi";
import { Form } from "react-router-dom";
import useLoader from "../hooks/useLoader";

// Translation
import { useTranslation } from "react-i18next";

const ChatAi = (user) => {

  const [chatText, setChatText] = useState('')
  const [chatData, setChatData] = useState(null)
  const [chatLoading, setChatLoading] = useState(false)

  const { isOpen: isHelpOpen, onOpen: onHelpOpen, onClose: onHelpClose } = useDisclosure()
  const [suggestionsData, setSuggestionsData] = useState([
    'get the latest patients added',
    'get patients  that has a temperator greater than 40 in the last month including the date . without repetition',
    'Obtain a list of patients whose names start with the letter "R."',
    'Retrieve all medicines that are less than 10 in stock',
    'get the patients with age greater than 50',
    'Get the list of medicines that have expired',
    'get  medicines that used last month'

  ])

  const { t, i18n } = useTranslation();
  const toast = useToast();

  const getAiChat = () => {
    setChatLoading(true)
    useLoader('/ai-search?q=' + chatText)
      .then(res => {
        setChatLoading(false)
        setChatData(res)
      })
      .catch(err => {
        setChatLoading(false)
        setChatData([])
        toast({
          title: t('chatAi.error'),
          description: err?.response?.data?.message || err?.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      })
  }
  return (
    <Box
      mt={5}
      w='100%'
      position='relative'
    >
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius='xl'
        position='relative'
        w='100%'
      >

        <Box
          display='flex'
          alignItems='center'
          gap={3}
          zIndex={1}
        >
          <MdOutlineMarkUnreadChatAlt size={30} color={useColorModeValue('#374083', 'gray.200')} />
          <Text color={useColorModeValue('#374083', 'gray.200')} fontSize={25} size="md">
            {t('chatAi.title')}
          </Text>
          <FiInfo
            size={25}
            color={useColorModeValue('#374083', 'gray.200')}
            cursor='pointer'
            onClick={() => onHelpOpen()}
          />
        </Box>

        <Form onSubmit={(e) => {
          e.preventDefault()
          getAiChat()
        }}>
          <FormControl
            zIndex={1}
            borderRadius='md'
            display='flex'
            alignItems='center'
            gap={2}
            mt={5}
          >
            <Input
              bg={useColorModeValue('white', 'gray.800')}
              placeholder={t('chatAi.placeholder')}
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
            />
            <Button
              type="submit"
              variant='ghost'
              isLoading={chatLoading}
            >
              <AiOutlineSend size={30} color={useColorModeValue('#374083', 'gray.200')} />
            </Button>
          </FormControl>
        </Form>


        {chatLoading && <Center p='10px'>
          <Spinner thickness='5px'
            speed='0.65s'
            emptyColor='gray.200'
            color='gray.500'
            size='xl' />
        </Center>}
        {!chatLoading && chatData && chatData.length === 0 && (
          <Box p='10px' display='flex' flexDirection='column' alignItems='center' justifyContent='center' gap={2}>
            <HiOutlineEmojiSad size='50px' />
            <Text fontSize='lg' fontWeight='normal'>
              {t("chatAi.noResponse")}
            </Text>
          </Box>
        )}
        {!chatLoading && chatData && chatData.length > 0 && (
          <Box
            overflowY='auto'
            p={2}
            m={2}
            borderRadius='md'
            maxH='60vh'
          >
            <Table variant='simple' boxShadow='md' bg='white' color='gray.700' borderRadius='md'>
              <Thead bg='blue.700'>
                <Tr>
                  {Object.keys(chatData[0]).map((key, index) => (
                    <Th color='white' key={index}>{key}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {chatData.map((item, index) => (
                  <Tr>
                    {Object.keys(item).map((key, index) => (
                      <Td key={index}>{item[key]}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>

          </Box>
        )}
      </Box>
      <Modal closeOnOverlayClick={true} isOpen={isHelpOpen} onClose={onHelpClose}>
        <ModalOverlay />
        <ModalContent maxW="56rem" pb={4}>
          <ModalHeader>
            {t('chatAi.suggestions')}
          </ModalHeader>
          <ModalBody maxH='60vh' overflowY='auto'>
            {suggestionsData.map((item, index) => (
              <Box
                key={index}
                p={2}
                shadow="md"
                borderWidth="1px"
                bg={useColorModeValue('blue.600', 'gray.800')}
                color={useColorModeValue('white', 'gray.200')}
                onClick={() => {
                  setChatText(item)
                  getAiChat()
                  onHelpClose()
                }}
                cursor='pointer'
                borderRadius='md'
                position='relative'
                w='100%'
                mb={2}
              >
                <Text fontSize='lg' fontWeight='normal'>
                  {item}
                </Text>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ChatAi;