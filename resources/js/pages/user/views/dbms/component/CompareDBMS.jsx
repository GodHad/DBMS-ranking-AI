import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  useColorModeValue,
  BreadcrumbLink,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'
import { Select as MultiSelect } from 'chakra-react-select';

import { Link } from 'react-router-dom';

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

export default function CompareDBMS(props) {
  const { selectedDBMS, setSelectedDBMS, vendors } = props;
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const secondaryText = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [data, setData] = useState(null);
  const [options, setOptions] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(null)

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

    setSelectedOptions(selectedDBMS.map(dbms => ({ label: dbms.db_name, value: dbms.id })))
  }, [selectedDBMS])

  useEffect(() => {
    if (vendors) setOptions(vendors.map(vendor => ({ label: vendor.db_name, value: vendor.id })))
  }, [vendors])

  const handleSelectChange = (value) => {
    if (value.length < 1 && value.length > 5) return;
    setSelectedOptions(value);
    setSelectedDBMS(value.map(option => vendors.find(vendor => vendor.id === option.value)))
  }

  return (
    <Box
      flexDirection="column"
      w="100%"
      px="0px"
      overflow={'hidden'}
    >
      <Breadcrumb px="25px">
        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
          <Link to='/'>
            Home
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px' onClick={() => setSelectedDBMS(null)}>
          <BreadcrumbLink>
            DB Ranking
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
          <BreadcrumbLink>
            Compare DBMS
          </BreadcrumbLink>
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
          DBMS Comparison
        </Text>
      </Flex>
      <Box display={"flex"} gap={2} alignItems={"center"} px={6} w={'full'} justifyContent={{ base: 'right', md: 'inherit' }}>
        {options &&
          <MultiSelect
            isMulti
            isSearchable
            value={selectedOptions}
            placeholder='Select categories'
            variant='auth'
            fontSize='sm'
            ms={{ base: "0px", md: "0px" }}
            type='text'
            fontWeight='500'
            size='lg'
            options={options}
            onChange={handleSelectChange}
          />
        }
      </Box>

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
    </Box>
  );
}
