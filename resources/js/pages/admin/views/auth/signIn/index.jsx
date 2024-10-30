import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import DefaultAuth from "../../../layouts/auth/Default";
import illustration from "../../../../../assets/img/auth/Demo.jpg";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import axios from "../../../../../variables/axiosConfig";
import { UserContext } from "../../../../../contexts/UserContext";
import { Helmet } from "react-helmet";

function SignIn() {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const handleChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    const res = await axios.post('/api/login', form);
    if (!res.data.success) {
      toast({
        title: "Sign in failed",
        description: key,
        position: 'top-right',
        status: "error",
        insert: "top",
        duration: 5000,
        isClosable: true
      })
    } else {
      toast({
        title: "You logged successfully",
        position: 'top-right',
        status: "success",
        insert: "top",
        duration: 5000,
        isClosable: true
      })

      navigate('/admin');

      setUser(res.data.user);
    }
  }

  return (
    <>
      <Helmet>
        <title>DB Rank AI | Sign In</title>
      </Helmet>
      <DefaultAuth illustrationBackground={illustration} image={illustration}>
        <Flex
          maxW={{ base: "100%", lg: "45%" }}
          w='100%'
          mx={{ base: "auto", lg: "0px" }}
          me='auto'
          h='100%'
          alignItems='start'
          justifyContent='center'
          mb={{ base: "30px", md: "60px" }}
          px={{ base: "25px", md: "0px" }}
          mt={{ base: "40px", md: "14vh" }}
          flexDirection='column'>
          <Box me='auto'>
            <Heading color={textColor} fontSize='36px' mb='10px'>
              Sign In
            </Heading>
            <Text
              mb='36px'
              ms='4px'
              color={textColorSecondary}
              fontWeight='400'
              fontSize='md'>
              We invite representatives of DBMS vendors to <Link to={'/contact-us'}><span style={{ color: '#2b6cb0', textDecoration: 'underline' }}>contact us</span></Link> for getting a user account. This enables you to increase the coverage and visibility of your system on this site, see <Link to={'/services'}><span style={{ color: '#2b6cb0', textDecoration: 'underline' }}>more details</span></Link>.
            </Text>
          </Box>
          <Flex
            zIndex='2'
            direction='column'
            w={{ base: "100%" }}
            maxW='100%'
            background='transparent'
            borderRadius='15px'
            mx={{ base: "auto", lg: "unset" }}
            me='auto'
            mb={{ base: "20px", md: "auto" }}>
            <FormControl>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='email'
                placeholder='mail@simmmple.com'
                mb='24px'
                fontWeight='500'
                size='lg'
                name="email"
                value={form.email}
                onChange={handleChangeForm}
              />
              <FormLabel
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  isRequired={true}
                  fontSize='sm'
                  placeholder='Min. 8 characters'
                  mb='24px'
                  size='lg'
                  type={show ? "text" : "password"}
                  variant='auth'
                  name="password"
                  value={form.password}
                  onChange={handleChangeForm}
                />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Button
                fontSize='sm'
                variant='brand'
                fontWeight='500'
                w='100%'
                h='50'
                mb='24px'
                onClick={handleLogin}
              >
                Sign In
              </Button>
            </FormControl>
          </Flex>
        </Flex>
      </DefaultAuth>
    </>
  );
}

export default SignIn;
