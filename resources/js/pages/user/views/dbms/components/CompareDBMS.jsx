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
import { headers } from './DBMS';
import { Skeleton } from '@chakra-ui/skeleton';
import { Helmet } from 'react-helmet';

export default function CompareDBMS(props) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { vendors, setVendors } = useContext(DBMSContext);

  const { data: _vendors, isLoadingVendor } = useQuery(
    'user_vendors',
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
      `,
        primary_category: dbms.primary_category.map(category => category.title).join('\n'),
        secondary_category: dbms.secondary_category.map(category => category.title).join('\n'),
      }
    }))

    setSelectedOptions(selectedDBMS.map(dbms => ({ label: dbms.db_name, value: dbms.id })))
  }, [selectedDBMS])

  useEffect(() => {
    if (vendors) setOptions(vendors.map(vendor => ({ label: vendor.db_name, value: vendor.id })))
  }, [vendors])

  const handleSelectChange = (value) => {
    const navigateUrl = value.map((option, index) => generateSlug(option.label)).join(';');
    navigate(`/dbms/compare/${encodeURIComponent(navigateUrl)}`);
  }

  return (
    <>
      <Helmet>
        (<title>{`DB Rank AI | DBMS Compare | ${
          selectedDBMS.length === 1 ?
            selectedDBMS[0].db_name
            : selectedDBMS.map((dbms, index) => (index === selectedDBMS.length - 1) ? dbms.db_name : `${dbms.db_name} vs.`).join(' ')
        }`}</title>)
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
                Compare
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
              {
                selectedDBMS.length === 1 ?
                  selectedDBMS[0].db_name
                  : selectedDBMS.map((dbms, index) => (index === selectedDBMS.length - 1) ? dbms.db_name : `${dbms.db_name} vs. `)
              }
            </Text>
          </Flex>
          <Box display={"flex"} gap={2} alignItems={"center"} px={6} w={'full'} justifyContent={{ base: 'right', md: 'inherit' }}>
            {options &&
              <FormControl mb={"24px"}>
                <FormLabel
                  display='flex'
                  ms='4px'
                  fontSize='sm'
                  fontWeight='500'
                  color={textColor}
                  mb='8px'
                >
                  Compare with:
                </FormLabel>
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
              </FormControl>
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
