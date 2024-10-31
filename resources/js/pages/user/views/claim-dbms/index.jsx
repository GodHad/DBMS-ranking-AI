import {
    Flex,
    Box,
    Text,
    Breadcrumb,
    BreadcrumbItem,
    useColorModeValue,
    BreadcrumbLink,
    SimpleGrid,
    Button,
    FormControl,
    FormLabel,
    InputGroup,
    Input,
    InputLeftElement,
    Textarea,
    useToast
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
    MdOutlineEmail,
    MdPhone,
    MdOutlineBusiness,
} from 'react-icons/md';
import Card from '../../../../components/card/Card';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DBMSContext } from '../../../../contexts/DBMSContext';
import { generateSlug } from '../../../../variables/statics';
import { getVendors } from '../../../admin/views/admin/dbms/dbms/requests/use-request';
import { useQuery } from 'react-query';
import { Skeleton } from '@chakra-ui/skeleton';
import { Helmet } from 'react-helmet';
import { useMutation } from 'react-query';
import { sendRequest } from './request/use-request';

export default function DBMS() {
    const toast = useToast();
    const navigate = useNavigate();
    const { slug } = useParams();
    const { vendors, setVendors } = useContext(DBMSContext);

    const { data: _vendors } = useQuery(
        'vendors',
        () => getVendors(' '),
        {
            staleTime: 300000,
            enabled: vendors.length === 0,
            onSuccess: (data) => {
                setVendors(data)
            }
        }
    );

    const selectedDBMS = useMemo(() => {
        const dbmsNames = decodeURIComponent(slug).split(';');
        return vendors.filter(vendor => dbmsNames.includes(generateSlug(vendor.db_name)));
    }, [vendors, slug]);

    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        company: '',
        jobtitle: '',
        content: '',
        dbms_id: 0
    })

    useEffect(() => {
        if (selectedDBMS.length === 0 && vendors.length !== 0 && _vendors) navigate('/not-found');
        if (selectedDBMS.length > 0) setForm(prev => ({ ...prev, dbms_id: selectedDBMS[0].id }))
    }, [selectedDBMS, navigate])

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const formTextColor = useColorModeValue('secondaryGray.900', 'white');
    const formCardBg = useColorModeValue("gray.200", "navy.900");

    const [success, setSuccess] = useState(false);

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
                (<title>{`DB Rank AI | Claim DBMS | ${selectedDBMS && selectedDBMS.length > 0 && selectedDBMS[0].db_name}`}</title>)
            </Helmet>
            <Box
                flexDirection="column"
                w="100%"
                px="0px"
                overflow={'hidden'}
            >
                <Card
                    flexDirection="column"
                    w="100%"
                    px="0px"
                    minH="calc(100vh - 150px)"
                    overflowX={{ sm: 'auto', lg: 'hidden' }}
                >
                    <Breadcrumb px="25px">
                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <Link to='/'>
                                Home
                            </Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <BreadcrumbLink>
                                Claim DBMS
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <BreadcrumbLink>
                                {selectedDBMS.length > 0
                                    && selectedDBMS[0].db_name}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Flex px="25px" mb="20px" gap={4} flexDir={{ base: 'column', md: 'row' }} justifyContent="space-between" align={{ base: 'inherit', md: "center" }}>
                        <Text
                            color={textColor}
                            fontSize={{ md: "22px", base: '20px' }}
                            mb="4px"
                            fontWeight="700"
                            lineHeight="100%"
                        >
                            Claim {selectedDBMS.length > 0 && selectedDBMS[0].db_name}
                        </Text>
                    </Flex>
                    {!success ? (
                        selectedDBMS.length > 0 ?
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
                                                    Request Claim
                                                </Button>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Flex>
                            </Box>
                            :
                            <>
                                <Skeleton height={"300px"} borderRadius={"12px"} mb={5} />
                                <Flex alignItems={'center'}>
                                    <Skeleton
                                        mb={5}
                                        mx={5}
                                        w="172px"
                                        h={'172px'}
                                        objectFit="cover"
                                        objectPosition="center"
                                        border={borderColor}
                                        borderStyle={'solid'}
                                        borderWidth={1} />
                                    <Flex flexDir={'column'} gap={2}>
                                        <Skeleton width={'200px'} height={"30px"} borderRadius={"12px"} />
                                        <Skeleton width={'200px'} height={"30px"} borderRadius={"12px"} />
                                        <Skeleton width={'200px'} height={"30px"} borderRadius={"12px"} />
                                        <Skeleton width={'200px'} height={"30px"} borderRadius={"12px"} />
                                    </Flex>
                                </Flex>
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
                    )
                    }
                </Card>
            </Box>
        </>
    );
}
