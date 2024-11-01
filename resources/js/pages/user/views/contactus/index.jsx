import React, { useState } from 'react';
import {
    Flex,
    Box,
    Heading,
    Text,
    Button,
    VStack,
    Stack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
    Breadcrumb,
    BreadcrumbItem,
    useColorModeValue,
    useToast,
    HStack,
    SimpleGrid,
    BreadcrumbLink
} from '@chakra-ui/react'
import {
    MdEmail,
    MdOutlineEmail,
    MdPhone,
    MdOutlineBusiness,
} from 'react-icons/md'
import { useMutation } from 'react-query';
import { sendRequest } from './request/use-request';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FaLinkedin } from 'react-icons/fa';

export default function Contact() {
    const toast = useToast();
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let buttonText = useColorModeValue('gray.700', 'gray.300');
    const formTextColor = useColorModeValue('secondaryGray.900', 'white');
    const formCardBg = useColorModeValue("gray.200", "navy.900");

    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        company: '',
        jobtitle: '',
        content: ''
    })

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const mutation = useMutation(sendRequest, {
        onSuccess: () => {
            toast({
                title: "Send request successfully",
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            });
            setForm({
                firstname: '',
                lastname: '',
                mobile: '',
                email: '',
                company: '',
                jobtitle: '',
                content: ''
            });
            setSuccess(true);
        },
        onError: (error) => {
            const errors = error.response.data.errors ? error.response.data.errors : { error: error.response.data.error };
            const key = errors[Object.keys(errors)[0]];
            toast({
                title: "Failed to send request.",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            });
        }
    });

    const handleSubmit = () => {
        mutation.mutate(form); // Call the mutation function
    };

    return (
        <>
            <Helmet>
                <title>DBMS Ranking AI | Contact us</title>
            </Helmet>
            <Box
                color={textColor}
                borderRadius="lg"
                mx={{ sm: 4, md: 16, lg: 10 }}
                px={{ sm: 5, md: 5, lg: 16 }}>
                <Breadcrumb>
                    <BreadcrumbItem color={textColor} fontSize='sm' mb='5px'>
                        <Link to='/'>
                            Home
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem color={textColor} fontSize='sm' mb='5px' onClick={() => setSuccess(false)}>
                        <Link to='/contact-us'>
                            Contact us
                        </Link>
                    </BreadcrumbItem>
                    {success &&
                        <BreadcrumbItem color={textColor} fontSize={'sm'} mb={'5px'}>
                            <BreadcrumbLink>
                                Thank You
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    }
                </Breadcrumb>
                <Heading>Contact us</Heading>
                {!success ? (
                    <>
                        <Flex>
                            <Box py={{ base: 5, sm: 5, md: 8, lg: 10 }}>
                                <HStack pl={0} spacing={3} alignItems="flex-start" justifyContent={'flex-start'}>
                                    <Button
                                        size="md"
                                        height="48px"
                                        width="100%"
                                        variant="ghost"
                                        color={buttonText}
                                        justifyContent={'flex-start'}
                                        _hover={{ border: '2px solid #1C6FEB' }}
                                        leftIcon={<MdEmail color="#1970F1" size="20px" />}>
                                        office@dbrank.ai
                                    </Button>
                                    <Link to={'https://linkedIn.com/company/db-rank'}>
                                        <Button
                                            size="md"
                                            height="48px"
                                            width="100%"
                                            variant="ghost"
                                            color={buttonText}
                                            justifyContent={'flex-start'}
                                            _hover={{ border: '2px solid #1C6FEB' }}
                                            leftIcon={<FaLinkedin color="#1970F1" size="20px" />}>
                                            LinkedIn
                                        </Button>
                                    </Link>
                                </HStack>
                            </Box>
                        </Flex>
                        <Text mt={{ sm: 3, md: 3, lg: 5 }} color={textColor}>
                            Please fill in the form below and one of our colleagues will get back to you as soon as possible.
                        </Text>
                        <Box p={4}>
                            <Flex spacing={{ base: 20, sm: 3, md: 5, lg: 20 }} flexDir={'column'}>
                                <Box bg={formCardBg} borderRadius="lg">
                                    <Box m={8} color={formTextColor}>
                                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                                            <FormControl>
                                                <FormLabel>First Name</FormLabel>
                                                <InputGroup borderColor="#E0E1E7">
                                                    <Input borderColor="gray.300" color={textColor} type="text" size="md" name='firstname' value={form.firstname} onChange={handleChange} />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Last Name</FormLabel>
                                                <InputGroup borderColor="#E0E1E7">
                                                    <Input borderColor="gray.300" color={textColor} type="text" size="md" name='lastname' value={form.lastname} onChange={handleChange} />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Mobile</FormLabel>
                                                <InputGroup borderColor="#E0E1E7">
                                                    <InputLeftElement pointerEvents="none">
                                                        <MdPhone color="gray.800" />
                                                    </InputLeftElement>
                                                    <Input borderColor="gray.300" color={textColor} type="text" size="md" name='mobile' value={form.mobile} onChange={handleChange} />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Email</FormLabel>
                                                <InputGroup borderColor="#E0E1E7">
                                                    <InputLeftElement pointerEvents="none">
                                                        <MdOutlineEmail color="gray.800" />
                                                    </InputLeftElement>
                                                    <Input borderColor="gray.300" color={textColor} type="email" size="md" name='email' value={form.email} onChange={handleChange} />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Company</FormLabel>
                                                <InputGroup borderColor="#E0E1E7">
                                                    <InputLeftElement pointerEvents="none">
                                                        <MdOutlineBusiness color="gray.800" />
                                                    </InputLeftElement>
                                                    <Input borderColor="gray.300" color={textColor} type="text" size="md" name='company' value={form.company} onChange={handleChange} />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Job Title</FormLabel>
                                                <InputGroup borderColor="#E0E1E7">
                                                    <Input borderColor="gray.300" color={textColor} type="text" size="md" name='jobtitle' value={form.jobtitle} onChange={handleChange} />
                                                </InputGroup>
                                            </FormControl>
                                        </SimpleGrid>
                                        <FormControl mt={5}>
                                            <FormLabel>Message</FormLabel>
                                            <Textarea
                                                borderColor="gray.300"
                                                _hover={{
                                                    borderRadius: 'gray.300',
                                                }}
                                                placeholder="message"
                                                name='content'
                                                value={form.content}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl float="right" mt={5} mb={5}>
                                            <Button variant="solid" bgGradient="linear(to-r, green.400, blue.800)" color="white" _hover={{}} onClick={handleSubmit}>
                                                Send Message
                                            </Button>
                                        </FormControl>
                                    </Box>
                                </Box>
                            </Flex>
                        </Box>
                    </>
                ) : (
                    <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'} minH={'300px'}>
                        <Text mt={{ sm: 3, md: 3, lg: 5 }} color={textColor} fontSize={'18px'}>
                            Message received, thank you!
                        </Text>
                        <Text mt={{ sm: 3, md: 3, lg: 5 }} color={textColor} fontSize={'18px'}>
                            One of our colleagues will be in touch soon…
                        </Text>
                        <Link to={'/'}>
                            <Button
                                mt={{ sm: 12, md: 12, lg: 20 }}
                                colorScheme="teal"
                                bgGradient="linear(to-r, green.400, blue.800)"
                                color="white"
                                variant="solid">
                                Return to Home
                            </Button>
                        </Link>
                    </Flex>
                )}
            </Box>
        </>
    )
}