import React, { useState, useEffect, useContext } from 'react';
import { Box, SimpleGrid, Heading, Text, Breadcrumb, BreadcrumbItem, Stack, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import Card from "../../../../components/card/Card";
import { getEncyclopedias } from '../../../admin/views/admin/encyclopedia/requests/use-request';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
    Skeleton,
    SkeletonCircle,
} from "@chakra-ui/skeleton";
import { generateSlug } from '../../../../variables/statics';
import { DBMSContext } from '../../../../contexts/DBMSContext';
import { Helmet } from 'react-helmet';

const groupByFirstLetter = (data) => {
    const groupedData = {};
    data.forEach((item) => {
        const firstLetter = item.title[0].toUpperCase();
        if (!groupedData[firstLetter]) {
            groupedData[firstLetter] = [];
        }
        groupedData[firstLetter].push(item);
    });
    return groupedData;
};

const sortAlphabetically = (groupedData) => {
    return Object.keys(groupedData)
        .sort()
        .map((letter) => ({
            letter,
            items: groupedData[letter],
        }));
};

const chunkIntoColumns = (data, columnCount) => {
    const rowsPerColumn = Math.ceil(data.length / columnCount);
    const columns = Array.from({ length: columnCount }, () => []);

    data.forEach((item, index) => {
        const columnIndex = Math.floor(index / rowsPerColumn);
        columns[columnIndex].push(item);
    });

    return columns;
};

const EncyclopediaPage = () => {
    const { encyclopedias: data, setEncyclopedias: setData } = useContext(DBMSContext);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'white');
    const columnCount = useBreakpointValue({
        base: 4,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
    });

    const { data: encyclopedias = [], isLoading } = useQuery(
        'encyclopedias',
        getEncyclopedias,
        {
            staleTime: 300000,
            enabled: data.length === 0,
            onSuccess: (data) => {
                if (data.length !== setData.length)
                    setData(data)
            }
        });

    const [columns, setColumns] = useState(null);

    useEffect(() => {
        if (encyclopedias.length > 0) {
            const groupedData = groupByFirstLetter(encyclopedias);
            const sortedData = sortAlphabetically(groupedData);
            setColumns(chunkIntoColumns(sortedData, columnCount));
        }
    }, [encyclopedias, columnCount]);

    return (
        <>
            <Helmet>
                <title>DB Rank AI | Encyclopedia</title>
            </Helmet>
            <Card
                w="100%"
                px="0px"
                minH="calc(100vh - 150px)"
            >
                <Box width={'100%'} px="25px">
                    <Breadcrumb>
                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <Link to='/'>
                                Home
                            </Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <Link to='/encyclopedia'>
                                Encyclopedia
                            </Link>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Text
                        color={textColor}
                        fontSize="22px"
                        mb="30px"
                        fontWeight="700"
                        lineHeight="100%"
                    >
                        Encyclopedia
                    </Text>
                    <SimpleGrid columns={columnCount} spacing={4}>
                        {columns ? columns.map((column, index) => (
                            <Box key={index}>
                                {column.map(({ letter, items }) => (
                                    <Box key={letter} mb={4}>
                                        <Heading size="md" mb="18px">{letter}</Heading>
                                        {items.map((item) => (
                                            <Link key={item.title} to={`/encyclopedia/${generateSlug(item.title)}`}>
                                                <Text color="blue.500" cursor={"pointer"} mb="5px" _hover={{ textDecor: 'underline' }}>
                                                    {item.title}
                                                </Text>
                                            </Link>
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                        )) : <>
                            <Stack gap="1">
                                <SkeletonCircle size={10} />
                                <Skeleton height={"20px"} borderRadius={"12px"} />
                                <Skeleton height={"20px"} borderRadius={"12px"} />
                            </Stack>
                            <Stack gap="1">
                                <SkeletonCircle size={10} />
                                <Skeleton height={"20px"} borderRadius={"12px"} />
                                <Skeleton height={"20px"} borderRadius={"12px"} />
                            </Stack>
                            <Stack gap="1">
                                <SkeletonCircle size={10} />
                                <Skeleton height={"20px"} borderRadius={"12px"} />
                                <Skeleton height={"20px"} borderRadius={"12px"} />
                            </Stack>
                            <Stack gap="1">
                                <SkeletonCircle size={10} />
                                <Skeleton height={"20px"} borderRadius={"12px"} />
                                <Skeleton height={"20px"} borderRadius={"12px"} />
                            </Stack>
                        </>
                        }
                    </SimpleGrid>
                </Box>
            </Card >
        </>
    )
};

export default EncyclopediaPage;
