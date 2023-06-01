import {
  Box,
  Button,
  Center,
  FormControl,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { Form } from "react-router-dom";
import useLoader from "../hooks/useLoader";

// Translation
import { useTranslation } from "react-i18next";

const ChatAi = (user) => {

  const [chatText, setChatText] = useState('')
  const [chatData, setChatData] = useState(null)
  const [chatLoading, setChatLoading] = useState(false)

  const { t, i18n } = useTranslation();

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
              onClick={getAiChat}
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
            maxH='70vh'
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
    </Box>
  );
}

export default ChatAi;