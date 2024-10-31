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
    IconButton,
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext, useMemo } from 'react'
import { MdCheckCircle, MdOutlineRemoveCircle, MdVisibility, MdEdit } from 'react-icons/md';
import Card from '../../../../../components/card/Card';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DBMSContext } from '../../../../../contexts/DBMSContext';
import { APP_URL, generateSlug } from '../../../../../variables/statics';
import { getVendors } from '../../../../admin/views/admin/dbms/dbms/requests/use-request';
import { useQuery } from 'react-query';
import { Skeleton } from '@chakra-ui/skeleton';
import { Helmet } from 'react-helmet';
import { UserContext } from '../../../../../contexts/UserContext';
import VendorForm from '../../../../admin/views/admin/dbms/dbms/components/DBMSForm';
import { getCategories } from '../../../../admin/views/admin/dbms/dbms/requests/use-request';

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
    const { user } = useContext(UserContext);
    const { data: categories, isLoadingCategory } = useQuery('categories', getCategories);
    const { data: _vendors } = useQuery(
        'user_vendors',
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
        const dbmsName = decodeURIComponent(slug);
        return vendors.find(vendor => dbmsName === generateSlug(vendor.db_name));
    }, [vendors, slug]);

    useEffect(() => {
        if (!selectedDBMS && vendors.length !== 0 && _vendors) navigate('/not-found');
    }, [selectedDBMS, navigate])

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const viewsColor = useColorModeValue('blue.300', 'blue.600');

    const [data, setData] = useState(null);

    useEffect(() => {
        if (selectedDBMS) {
            setData(prev => {
                const primaryRanking = selectedDBMS.primary_ranking.split(' ');
                return {
                    ...selectedDBMS,
                    overall_ranking: `
                    <span style="margin-right: 8px; line-height: 36px;">Score:</span> ${selectedDBMS.overall_avg_score}<br> 
                    <span style="margin-right: 8px; line-height: 36px;">Rank:</span> #${selectedDBMS.overall_ranking} Overall<br>
                    ${selectedDBMS.primary_category.map((category, index) => (`<span style="margin-right: 8px; line-height: 36px; opacity: 0">Rank: </span> #${primaryRanking[index]} ${category.shortname}<br>`)).join(' ')}
                `,
                    primary_category: selectedDBMS.primary_category.map(category => category.title).join(', '),
                    secondary_category: selectedDBMS.secondary_category.map(category => category.title).join(', '),
                }
            })
        }
    }, [selectedDBMS])

    const [editing, setEditing] = useState(false);

    return (
        <>
            <Helmet>
                (<title>{`DB Rank AI | DBMS | ${selectedDBMS && selectedDBMS.db_name}`}</title>)
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
                                {selectedDBMS && selectedDBMS.db_name}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Flex px="25px" mb="20px" gap={4} flexDir={{ base: 'column', md: 'row' }} justifyContent="space-between" align={{ base: 'inherit', md: "center" }}>
                        <Flex alignItems={'center'} gap={2}>
                        </Flex>
                        <Flex gap={4} alignItems={'center'} justifyContent={'right'}>
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
                    </Flex>
                    {editing ? <VendorForm vendor={selectedDBMS} setOpenedPage={setEditing} categories={categories} /> :
                        <>
                            {selectedDBMS ?
                                <>
                                    <Image
                                        mb={5}
                                        w="100%"
                                        maxH={'300px'}
                                        objectFit="cover"
                                        objectPosition="center"
                                        src={`${APP_URL}storage/${selectedDBMS.banner}?w=1400&auto=compression,format`}
                                        alt={selectedDBMS.db_name}
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
                                            src={`${APP_URL}storage/${selectedDBMS.logo_url}?w=1400&auto=compression,format`}
                                            alt={selectedDBMS.db_name}
                                        />
                                        <Flex justifyContent={'space-between'} flexDir={{ base: 'column', lg: 'row' }} w='full' mx={'16px'} gap={4}>
                                            <Flex flexDir={'column'} gap={2}>
                                                <Flex align={'center'} gap={2}>
                                                    <a href={selectedDBMS.website_url} target='_blank'>
                                                        <Text
                                                            color={textColor}
                                                            mb="4px"
                                                            fontWeight="700"
                                                            lineHeight="120%"
                                                            fontSize={'20px'}
                                                        >{selectedDBMS.db_name}</Text>
                                                    </a>
                                                    {(user && selectedDBMS && selectedDBMS.user.length && user.id === selectedDBMS.user[0].id) && !editing ? (
                                                        <IconButton
                                                            aria-label="Edit"
                                                            icon={<MdEdit />}
                                                            colorScheme="blue"
                                                            variant="outline"
                                                            isRound
                                                            size="sm"
                                                            float={'right'}
                                                            onClick={() => setEditing(true)}
                                                        />
                                                    ) : <></>}
                                                </Flex>
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
                                                        {selectedDBMS.profile_views} views
                                                    </Text>
                                                </Flex>
                                                {data &&
                                                    <Text
                                                        color={textColor}
                                                        fontWeight="400"
                                                        lineHeight="120%"
                                                        fontSize={'16px'}
                                                        dangerouslySetInnerHTML={{ __html: data.overall_ranking }}
                                                    />
                                                }
                                            </Flex>
                                            <Flex flexDir={'column'}>
                                                <Flex gap={2} flexDir={{ base: 'column', md: 'row' }}>
                                                    <Link to={selectedDBMS.website_url}>
                                                        <Button
                                                            fontSize='sm'
                                                            variant='outline'
                                                            fontWeight='500'
                                                            minW={'120px'}
                                                            w='100%'
                                                            h='50'
                                                            mb={{ base: '10px', md: '24px' }}
                                                        >
                                                            Contact
                                                        </Button>
                                                    </Link>
                                                    <Link to={selectedDBMS.website_url}>
                                                        <Button
                                                            fontSize='sm'
                                                            variant='brand'
                                                            fontWeight='500'
                                                            minW={'120px'}
                                                            w='100%'
                                                            h='50'
                                                            mb={{ base: '10px', md: '24px' }}
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
                                                        color={selectedDBMS.approved === 1 ? 'green.500' : 'gray.500'}
                                                        as={selectedDBMS.approved === 1 ? MdCheckCircle : MdOutlineRemoveCircle}
                                                    />
                                                    <Text color={selectedDBMS.approved === 1 ? 'green.500' : 'gray.500'} fontSize="sm" fontWeight="700">
                                                        {selectedDBMS.approved === 1 ? 'Claimed' : 'Unclaimed'}
                                                    </Text>
                                                    {selectedDBMS.approved === 0 &&
                                                        <Link to={`/claim-dbms/${generateSlug(selectedDBMS.db_name)}`}>
                                                            <Text color={'blue.500'} fontSize="sm" fontWeight="700" textDecor={'underline'}>
                                                                (Claim DBMS)
                                                            </Text>
                                                        </Link>
                                                    }
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
                                                {data ? (
                                                    <Td
                                                        key={data.id}
                                                        pe="10px"
                                                        borderColor={borderColor}
                                                        width={'300px'}
                                                    >
                                                        <Text
                                                            color={textColor}
                                                            mb="4px"
                                                            fontWeight="500"
                                                            lineHeight="120%"
                                                            dangerouslySetInnerHTML={{ __html: header.yes ? data[header.key] ? 'Yes' : 'No' : data[header.key] }}
                                                        />
                                                    </Td>
                                                ) : (
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
                        </>
                    }
                </Card>
            </Box>
        </>
    );
}
