import {
    Flex,
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Tr,
    Image,
    Icon,
    Breadcrumb,
    BreadcrumbItem,
    useColorModeValue,
    BreadcrumbLink,
    Button,
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext, useMemo } from 'react'
import { MdCheckCircle, MdOutlineRemoveCircle, MdVisibility } from 'react-icons/md';
import Card from '../../../../../components/card/Card';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DBMSContext } from '../../../../../contexts/DBMSContext';
import { APP_URL, generateSlug } from '../../../../../variables/statics';
import { getVendors } from '../../../../admin/views/admin/dbms/dbms/requests/use-request';
import { useQuery } from 'react-query';
import { Skeleton } from '@chakra-ui/skeleton';
import { Helmet } from 'react-helmet';

export const headers = [
    { key: 'db_name', name: 'Name' },
    { key: 'description', name: 'Description' },
    { key: 'primary_category', name: 'Primary Database Model' },
    { key: 'secondary_category', name: 'Secondary Database Models' },
    { key: 'overall_ranking', name: 'DB Ranking' },
    { key: 'webisite_url', name: 'Website' },
    { key: 'technical_doc', name: 'Technical Documentation' },
    { key: 'developer', name: 'Developer' },
    { key: 'initial_release', name: 'Initial Release' },
    { key: 'current_release', name: 'Current Release' },
    { key: 'license', name: 'License' },
    { key: 'cloud_based_only', name: 'Cloud-based only', yes: true },
    { key: 'dbaas_offerings', name: 'DBaas Offerings' },
    { key: 'implementation_lang', name: 'Implementation Language' },
    { key: 'server_os', name: 'Server Operating Systems' },
    { key: 'data_scheme', name: 'Data Scheme' },
    { key: 'typing', name: 'Typing', yes: true },
    { key: 'xml_support', name: 'XML Support', yes: true },
    { key: 'secondary_indexes', name: 'Secondary Indexes', yes: true },
    { key: 'sql', name: 'SQL' },
    { key: 'apis_access_method', name: 'APIS And Other Access Methods' },
    { key: 'supported_programming_lang', name: 'Supported Programming Languages' },
    { key: 'server_side_scripts', name: 'Server-side Scripts' },
    { key: 'triggers', name: 'Triggers', yes: true },
    { key: 'partitioning_methods', name: 'Partitioning Methods' },
    { key: 'replication_methods', name: 'Replication Methods' },
    { key: 'mapreduce', name: 'MapReduce' },
    { key: 'consistency_concepts', name: 'Consistency Concepts' },
    { key: 'foreign_keys', name: 'Foreign Keys', yes: true },
    { key: 'transaction_concepts', name: 'Transcation Concepts' },
    { key: 'concurrency', name: 'Concurrency', yes: true },
    { key: 'durability', name: 'Durability', yes: true },
    { key: 'in_memory_capabilities', name: 'In-memory capabilities', yes: true },
    { key: 'user_concepts', name: 'User Concepts' },
]

export default function DBMS() {
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

    useEffect(() => {
        if (selectedDBMS.length === 0 && vendors.length !== 0 && _vendors) navigate('/not-found');
    }, [selectedDBMS, navigate])

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const viewsColor = useColorModeValue('blue.300', 'blue.600');

    const [data, setData] = useState(null);

    useEffect(() => {
        setData(selectedDBMS.map(dbms => {
            const primaryRanking = dbms.primary_ranking.split(' ');
            return {
                ...dbms,
                overall_ranking: `
                    <span style="margin-right: 8px; line-height: 36px;">Overall Avg. Score:</span> ${dbms.overall_avg_score}<br> 
                    <span style="margin-right: 8px; line-height: 36px;">Rank:</span> #${dbms.overall_ranking} Overall<br>
                    ${dbms.primary_category.map((category, index) => (`<span style="margin-right: 8px; line-height: 36px; opacity: 0">Rank: </span> #${primaryRanking[index]} ${category.shortname}<br>`)).join(' ')}
                `,
                primary_category: dbms.primary_category.map(category => category.title).join(', '),
                secondary_category: dbms.secondary_category.map(category => category.title).join(', '),
            }
        }))

    }, [selectedDBMS])

    return (
        <>
            <Helmet>
                (<title>{`DB Rank AI | DBMS | ${selectedDBMS && selectedDBMS.length > 0 && selectedDBMS[0].db_name}`}</title>)
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
                            <Link to='/dbms'>
                                DBMS
                            </Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <BreadcrumbLink>
                                {
                                    selectedDBMS.length === 1 ?
                                        selectedDBMS[0].db_name
                                        : selectedDBMS.map((dbms, index) => (index === selectedDBMS.length - 1) ? dbms.db_name : `${dbms.db_name} vs. `)
                                }
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
                            {
                                selectedDBMS.length === 1 ?
                                    selectedDBMS[0].db_name
                                    : selectedDBMS.map((dbms, index) => (index === selectedDBMS.length - 1) ? dbms.db_name : `${dbms.db_name} vs. `)
                            }
                        </Text>
                        <Link to={`/dbms/compare/${slug}`}>
                            <Text
                                color={'blue.500'}
                                fontSize={{ md: "14px", base: '20px' }}
                                mb="4px"
                                fontWeight="400"
                                lineHeight="100%"
                            >
                                Compare with other
                            </Text>
                        </Link>
                    </Flex>
                    {selectedDBMS.length > 0 ?
                        <>
                            <Image
                                mb={5}
                                w="100%"
                                maxH={'300px'}
                                objectFit="cover"
                                objectPosition="center"
                                src={`${APP_URL}storage/${selectedDBMS[0].banner}?w=1400&auto=compression,format`}
                                alt={selectedDBMS[0].db_name}
                            />
                            <Flex alignItems={'center'}>
                                <Image
                                    mb={5}
                                    mx={5}
                                    w="172px"
                                    h={'172px'}
                                    objectFit="cover"
                                    objectPosition="center"
                                    border={borderColor}
                                    borderStyle={'solid'}
                                    borderWidth={1}
                                    src={`${APP_URL}storage/${selectedDBMS[0].logo_url}?w=1400&auto=compression,format`}
                                    alt={selectedDBMS[0].db_name}
                                />
                                <Flex justifyContent={'space-between'} flexDir={'row'} w='full' mx={'16px'}>
                                    <Flex flexDir={'column'} gap={2}>
                                        <a href={selectedDBMS[0].website_url} target='_blank'>
                                            <Text
                                                color={textColor}
                                                mb="4px"
                                                fontWeight="700"
                                                lineHeight="120%"
                                                fontSize={'20px'}
                                            >{selectedDBMS[0].db_name}</Text>
                                        </a>
                                        <Flex align="center">
                                            <Icon
                                                w="24px"
                                                h="24px"
                                                me="5px"
                                                color={viewsColor}
                                                as={MdVisibility}
                                            />
                                            <Text
                                                color={viewsColor}
                                                fontWeight="600"
                                                lineHeight="120%"
                                                fontSize={'18px'}
                                            >
                                                {selectedDBMS[0].profile_views} views
                                            </Text>
                                        </Flex>
                                        {data && data.length > 0 &&
                                            <Text
                                                color={textColor}
                                                fontWeight="400"
                                                lineHeight="120%"
                                                fontSize={'16px'}
                                                dangerouslySetInnerHTML={{ __html: data[0].overall_ranking }}
                                            />
                                        }
                                    </Flex>
                                    <Flex flexDir={'column'}>
                                        <Flex gap={4}>
                                            <Link to={selectedDBMS[0].website_url}>
                                                <Button
                                                    fontSize='sm'
                                                    variant='outline'
                                                    fontWeight='500'
                                                    minW={'120px'}
                                                    w='100%'
                                                    h='50'
                                                    mb='24px'
                                                >
                                                    Contact
                                                </Button>
                                            </Link>
                                            <Link to={selectedDBMS[0].website_url}>
                                                <Button
                                                    fontSize='sm'
                                                    variant='brand'
                                                    fontWeight='500'
                                                    minW={'120px'}
                                                    w='100%'
                                                    h='50'
                                                    mb='24px'
                                                >
                                                    Website
                                                </Button>
                                            </Link>
                                        </Flex>
                                        <Flex align="center">
                                            <Icon
                                                w="24px"
                                                h="24px"
                                                me="5px"
                                                color={selectedDBMS[0].approved === 1 ? 'green.500' : 'gray.500'}
                                                as={selectedDBMS[0].approved === 1 ? MdCheckCircle : MdOutlineRemoveCircle}
                                            />
                                            <Text color={selectedDBMS[0].approved === 1 ? 'green.500' : 'gray.500'} fontSize="sm" fontWeight="700">
                                                {selectedDBMS[0].approved === 1 ? 'Claimed' : 'Unclaimed'}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </>
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
                    }
                    <Box
                        overflow={'auto'}
                        maxH={'80vh'}
                        sx={{
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                height: '8px',
                                backgroundColor: 'transparent', // Change to transparent or the desired color
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: borderColor, // Color for the scrollbar thumb
                                borderRadius: '20px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'rgba(0, 0, 0, 0.15)', // Track color, adjust as needed
                                borderRadius: '20px',
                            },
                        }}>
                        <Table variant="simple" color="gray.500" mb="24px" mt="12px" style={{ tableLayout: 'fixed' }}>
                            <Tbody>
                                {headers.map(header => (
                                    <Tr key={header.key}>
                                        <Th
                                            pe="10px"
                                            borderColor={borderColor}
                                            width={'150px'}
                                        >
                                            {header.name}
                                        </Th>
                                        {data && data.length > 0 ? data.map(dbms => (
                                            <Td
                                                key={dbms.id}
                                                pe="10px"
                                                borderColor={borderColor}
                                                width={'300px'}
                                            >
                                                <Text
                                                    color={textColor}
                                                    mb="4px"
                                                    fontWeight="500"
                                                    lineHeight="120%"
                                                    dangerouslySetInnerHTML={{ __html: header.yes ? dbms[header.key] ? 'Yes' : 'No' : dbms[header.key] }}
                                                />
                                            </Td>
                                        )) : (
                                            <Td
                                                pe="10px"
                                                borderColor={borderColor}
                                                width={'300px'}
                                            >
                                                <Skeleton width={'300px'} height={"30px"} borderRadius={"12px"} />
                                            </Td>
                                        )}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Card>
            </Box>
        </>
    );
}
