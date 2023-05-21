import React, { useEffect, useState } from "react";
import axios from "../components/axios";

import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  HStack,
  Text,
  VStack,
  Icon,
  FormLabel,
  Checkbox,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock, FaShieldVirus, FaUserMd, FaFileMedical, FaPrescriptionBottleAlt, FaMicroscope, FaMedkit } from "react-icons/fa";
import { Form, redirect } from "react-router-dom";
import { BsFillGrid3X3GapFill, BsVirus } from "react-icons/bs";
import { GiVirus } from "react-icons/gi";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

async function loginUser(data) {
  const user = {
    username: data['username'],
    password: data['password'],
  }
  return axios.post('/login', user)
    .then(res => res.data)
    .catch(err => Promise.reject(err));
}

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const toast = useToast();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const token = await loginUser({
      username,
      password
    }).then(res => {
      setUser(res, rememberMe);
    }).catch(err => {
      toast({
        title: "Error Logging In",
        description: err.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }).finally(() => {
      setLoading(false);
    });

  }

  const handleForgotPassword = () => {
    toast({
      title: "Forgot Password",
      description: "Please contact your administrator.",
      status: "info",
      duration: 9000,
      isClosable: true,
    })
  }
  return (
    <Box h="100vh" bgGradient="linear(to-r, blue.700, blue.900)" display="flex" justifyContent="space-between" position="relative">

      <Box >
        <Box position="absolute" top={5} left={5} opacity={0.5} transform='rotate(170deg)' >
          <BsFillGrid3X3GapFill fontSize='10rem' color='white' />
        </Box>
        <Box position="absolute" bottom={5} right='50%' opacity={0.5} transform='rotate(170deg)' >
          <BsVirus fontSize='10rem' color='white' />
        </Box>
        <Box position="absolute" bottom={5} left={5} opacity={0.5} transform='rotate(170deg)' >
          <GiVirus fontSize='10rem' color='white' />
        </Box>
      </Box>
      <Box minH="100%" w={{ base: "0%", lg: "50%", xl: '60%' }} display={{ base: "none", lg: "flex" }} justifyContent="space-between" >
        <Box minH="100" w='100%' pl={10} display="flex" justifyContent="center" alignItems='center' flexDirection="column">
          <VStack color="white" spacing={4}>
            <FaShieldVirus fontSize='130px' />
            <Text fontSize='40px'>Infectious Diseases</Text>
            <VStack spacing={4} p={6} color="gray.300" align="start">
              <Flex alignItems="right">
                <Icon as={FaUserMd} boxSize={6} mr={2} />
                <Text>Healthcare Professional Dashboard</Text>
              </Flex>
              <Flex alignItems="right">
                <Icon as={FaFileMedical} boxSize={6} mr={2} />
                <Text>Integrated Patient Records</Text>
              </Flex>
              <Flex alignItems="right">
                <Icon as={FaPrescriptionBottleAlt} boxSize={6} mr={2} />
                <Text>Electronic Prescription System</Text>
              </Flex>
              <Flex alignItems="right">
                <Icon as={FaMicroscope} boxSize={6} mr={2} />
                <Text>Laboratory and Test Result Viewer</Text>
              </Flex>
              <Flex alignItems="right">
                <Icon as={FaMedkit} boxSize={6} mr={2} />
                <Text>Medication Interaction Checker</Text>
              </Flex>
            </VStack>
          </VStack>
        </Box>
        <Box position='absolute' bottom={5} left={'25%'} color='white' fontSize='sm' textShadow='1px 1px 1px black'>
          <Text fontSize={{ base: '8px', lg: '15px' }} >
            &copy; 2023 Infectious Diseases. All rights reserved.
          </Text>
        </Box>
      </Box>

      <Box p={{ base: 0, lg: 2 }} pr={{ base: 0, lg: 0 }} w={{ base: "100%", lg: "50%", xl: '40%' }} >
        <Stack
          h='100%'
          bg={useColorModeValue("#e2e8f0", "gray.900")}
          borderLeftRadius={{ base: "0", lg: "50" }}
          alignItems="center"
          justify="center"
          p={8}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">

          </Box>
          <Box w={{ base: "100%", md: "80%" }}>
            <Form onSubmit={handleSubmit}>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor={useColorModeValue("whiteAlpha.900", 'gray.700')}
                boxShadow="md"
                borderRadius='2xl'
                gap={3}
              >
                <Text fontSize="4xl" color={useColorModeValue("blue.900", "white")}
                fontWeight="bold">
                  Login
                </Text>
                <FormControl>
                  <FormLabel color="gray.400" fontSize="12px">
                    Username
                  </FormLabel>
                  <InputGroup position="relative">
                    <Icon as={FaUserAlt} color='gray.300' boxSize={4} mr={2} position="absolute" left={3} top={3} />
                    <Input
                      type="text"
                      value={username}
                      placeholder="user name"
                      _placeholder={{ color: useColorModeValue("gray.500", "gray.100") }}
                      name="username"
                      pl={10}
                      onChange={({ target }) => setUsername(target.value)} />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.400" fontSize="12px">
                    Password
                  </FormLabel>
                  <InputGroup position="relative">
                    <Icon as={CFaLock} color='gray.300' boxSize={4} mr={2} position="absolute" left={3} top={3} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      _placeholder={{ color: useColorModeValue("gray.500", "gray.100") }}
                      name="password"
                      value={password}
                      pl={10}
                      onChange={({ target }) => setPassword(target.value)}
                    />
                      <Button h="1.75rem" size="sm" onClick={handleShowClick} position="absolute" right={2} top="6px" zIndex={2}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  {/* checkbox */}
                  <HStack spacing="24px" justifyContent="space-between" alignItems="center">
                    <Checkbox colorScheme="blue" value={rememberMe} onChange={({ target }) => setRememberMe(target.checked)}>
                      Remember me
                    </Checkbox>
                    <Link color="blue.400" onClick={handleForgotPassword}>
                      Forgot password?
                    </Link>
                  </HStack>

                </FormControl>
                <Button
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
                  width="full"
                  borderRadius='md'
                  isLoading={loading}
                >
                  Login
                </Button>
              </Stack>
            </Form>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default Login;