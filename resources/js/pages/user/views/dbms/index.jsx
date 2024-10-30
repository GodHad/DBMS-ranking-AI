import {
    Flex,
    Text,
    Box,
    SimpleGrid,
    Breadcrumb,
    BreadcrumbItem,
    Heading,
    Stack,
    useColorModeValue,
    useBreakpointValue,
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext } from 'react'
import {
    Skeleton,
} from "@chakra-ui/skeleton";

import Card from '../../../../components/card/Card';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { getVendors } from '../../../admin/views/admin/dbms/dbms/requests/use-request';
import { DBMSContext } from '../../../../contexts/DBMSContext';
import { generateSlug } from '../../../../variables/statics';

const chunkIntoColumns = (data, columnCount) => {
    const rowsPerColumn = Math.ceil(data.length / columnCount);
    const columns = Array.from({ length: columnCount }, () => []);

    data.forEach((item, index) => {
        const columnIndex = Math.floor(index / rowsPerColumn);
        columns[columnIndex].push(item);
    });

    return columns;
};

export default function Vendor() {
    const { vendors: data, setVendors: setData } = useContext(DBMSContext);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const { data: vendors = [], isLoadingVendor } = useQuery(
        'vendors',
        getVendors,
        {
            staleTime: 300000,
            enabled: data.length === 0,
            onSuccess: (data) => {
                setData(data)
            }
        }
    );

    useEffect(() => {
        setData(vendors || []);
    }, [vendors])

    const columnCount = useBreakpointValue({
        base: 4,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
    });

    const [columns, setColumns] = useState(null);

    useEffect(() => {
        if (data) setColumns(chunkIntoColumns(data, columnCount));
    }, [data]);

    return (
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
            </Breadcrumb>
            <Flex px="25px" mb="8px" gap={4} flexDir={{ base: 'column' }} justifyContent="space-between" align={{ base: 'inherit' }}>
                <Text
                    color={textColor}
                    fontSize={{ md: "22px", base: '20px' }}
                    mb="4px"
                    fontWeight="700"
                    lineHeight="100%"
                >
                    DBMS
                </Text>
                <SimpleGrid columns={columnCount} spacing={4}>
                    {columns ? columns.map((items, index) => (
                        <Box key={index} mb={4}>
                            {items.map((item) => (
                                <Link to={`/dbms/${generateSlug(item.db_name)}`} key={item.db_name}>
                                    <Text color={textColor} cursor={"pointer"} mb="5px" _hover={{ color: "blue.500" }}>
                                        {item.db_name}
                                    </Text>
                                </Link>
                            ))}
                        </Box>
                    )) : <>
                        <Stack gap="1">
                            <Skeleton height={"20px"} borderRadius={"12px"} />
                            <Skeleton height={"20px"} borderRadius={"12px"} />
                            <Skeleton height={"20px"} borderRadius={"12px"} />
                            <Skeleton height={"20px"} borderRadius={"12px"} />
                        </Stack>
                    </>
                    }
                </SimpleGrid>
            </Flex>
        </Card >
    );
}
