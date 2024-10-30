import React, { useState } from 'react';
import {
    Flex,
    Box,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
    Breadcrumb,
    BreadcrumbItem,
    useColorModeValue,
    useToast
} from '@chakra-ui/react'
import {
    MdPhone,
    MdEmail,
    MdLocationOn,
    MdOutlineEmail,
} from 'react-icons/md'
import { BsPerson } from 'react-icons/bs'
import { useMutation } from 'react-query';
import { sendRequest } from './request/use-request';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function Contact() {
    const toast = useToast();
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'gray.400');
    let buttonText = useColorModeValue('gray.700', 'gray.300');
    const formTextColor = useColorModeValue('secondaryGray.900', 'white');
    const formCardBg = useColorModeValue("gray.200", "navy.900");
    const [form, setForm] = useState({
        email: '',
        title: '',
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
            setForm({ email: '', title: '', content: '' });
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
                <title>DB Rank AI | Contact us</title>
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
                    <BreadcrumbItem color={textColor} fontSize='sm' mb='5px'>
                        <Link to='/contactus'>
                            Contact us
                        </Link>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Heading>Contact us</Heading>
                <Text mt={{ sm: 3, md: 3, lg: 5 }} color={textColor}>
                    Fill up the form below to contact
                </Text>
                <Box p={4}>
                    <Flex spacing={{ base: 20, sm: 3, md: 5, lg: 20 }} flexDir={'column'}>
                        <Box>
                            <Box py={{ base: 5, sm: 5, md: 8, lg: 10 }}>
                                <HStack pl={0} spacing={3} alignItems="flex-start">
                                    <Button
                                        size="md"
                                        height="48px"
                                        width="200px"
                                        variant="ghost"
                                        color={buttonText}
                                        _hover={{ border: '2px solid #1C6FEB' }}
                                        leftIcon={<MdPhone color="#1970F1" size="20px" />}>
                                        +91-988888888
                                    </Button>
                                    <Button
                                        size="md"
                                        height="48px"
                                        width="200px"
                                        variant="ghost"
                                        color={buttonText}
                                        _hover={{ border: '2px solid #1C6FEB' }}
                                        leftIcon={<MdEmail color="#1970F1" size="20px" />}>
                                        office@dbrank.ai
                                    </Button>
                                    <Button
                                        size="md"
                                        height="48px"
                                        width="200px"
                                        variant="ghost"
                                        color={buttonText}
                                        _hover={{ border: '2px solid #1C6FEB' }}
                                        leftIcon={<MdLocationOn color="#1970F1" size="20px" />}>
                                        London, England
                                    </Button>
                                </HStack>
                            </Box>
                        </Box>
                        <Box bg={formCardBg} borderRadius="lg">
                            <Box m={8} color={formTextColor}>
                                <VStack spacing={5}>
                                    <FormControl>
                                        <FormLabel>Your Mail</FormLabel>
                                        <InputGroup borderColor="#E0E1E7">
                                            <InputLeftElement pointerEvents="none">
                                                <MdOutlineEmail color="gray.800" />
                                            </InputLeftElement>
                                            <Input type="email" size="md" name='email' value={form.email} onChange={handleChange} />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Title</FormLabel>
                                        <InputGroup borderColor="#E0E1E7">
                                            <InputLeftElement pointerEvents="none">
                                                <BsPerson color="gray.800" />
                                            </InputLeftElement>
                                            <Input type="text" size="md" name='title' value={form.title} onChange={handleChange} />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl>
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
                                    <FormControl float="right">
                                        <Button variant="solid" bg="#0D74FF" color="white" _hover={{}} onClick={handleSubmit}>
                                            Send Message
                                        </Button>
                                    </FormControl>
                                </VStack>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </>
    )
}