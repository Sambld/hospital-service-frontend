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
  InputRightElement
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Form, redirect } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

async function loginUser(data) {
  const user = {
    username: data['username'],
    password: data['password'],
  }
  return axios.post('/login', user)
    .then(res => res.data)
 }

const Login = ({setUser}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const token = await loginUser({
      username,
      password
    });
    setLoading(false);
    setUser(token);
  }
  return (
    <Stack
      mt='100px'
      mb="2"
      justifyContent="center"
      alignItems="center"

    >
      <Avatar bg="#374083" />
      <Heading color="#374083">Welcome</Heading>
      <Box minW={{ base: "90%", md: "468px" }}>
        <Form onSubmit={handleSubmit}>
          <Stack
            spacing={4}
            p="1rem"
            backgroundColor="whiteAlpha.500"
            boxShadow="2xl"
            border='1px'
            borderColor='gray.300'
            borderRadius='2xl'
          >
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input 
                type="text" 
                value={username} 
                placeholder="user name" 
                name="username"
                onChange={({ target }) => setUsername(target.value)} />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<CFaLock color="gray.300" />}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
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
  );
}

export default Login;