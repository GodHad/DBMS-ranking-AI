import {
    Flex,
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Tr,
    FormControl,
    FormLabel,
    Breadcrumb,
    BreadcrumbItem,
    useColorModeValue,
    BreadcrumbLink,
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext, useMemo } from 'react'
import { Select as MultiSelect } from 'chakra-react-select';
import Card from '../../../../../components/card/Card';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DBMSContext } from '../../../../../contexts/DBMSContext';
import { generateSlug } from '../../../../../variables/statics';
import { getVendors } from '../../../../admin/views/admin/dbms/dbms/requests/use-request';
import { useQuery } from 'react-query';

const headers = [
    { key: 'db_name', name: 'Name' },
    { key: 'description', name: 'Description' },
    // { key: 'primary_category', name: 'Primary Database Model' },
    // { key: 'secondary_category', name: 'Secondary Database Models' },
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

    const { data: _vendors, isLoadingVendor } = useQuery(
        'vendors',
        getVendors,
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
    const secondaryText = useColorModeValue('gray.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const [data, setData] = useState(null);

    useEffect(() => {
        setData(selectedDBMS.map(dbms => {
            const primaryRanking = dbms.primary_ranking.split(' ');
            return {
                ...dbms,
                overall_ranking: `
            <span style="margin-right: 8px">Overall Avg. Score:</span> ${dbms.overall_avg_score}<br> 
            <span style="margin-right: 8px">Rank:</span> #${dbms.overall_ranking} Overall<br>
            ${dbms.primary_category.map((category, index) => (`<span style="margin-right: 8px; opacity: 0">Rank: </span> #${primaryRanking[index]} ${category.shortname}<br>`))}
        `}
        }))

    }, [selectedDBMS])

    return (
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
                <Flex px="25px" mb="8px" gap={4} flexDir={{ base: 'column', md: 'row' }} justifyContent="space-between" align={{ base: 'inherit', md: "center" }}>
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
                            color={'blue.400'}
                            fontSize={{ md: "14px", base: '20px' }}
                            mb="4px"
                            fontWeight="400"
                            lineHeight="100%"
                        >
                            Compare with other
                        </Text>
                    </Link>
                </Flex>

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
                                    {data && data.map(dbms => (
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
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Card>
        </Box>
    );
}
