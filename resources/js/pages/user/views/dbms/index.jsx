import {
    Flex,
    Icon,
    IconButton,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Box,
    Button,
    FormControl,
    useColorModeValue,
    useBreakpointValue,
} from '@chakra-ui/react';
import React, { useState, useEffect, useMemo } from 'react'
import { Select } from 'chakra-react-select';
import countryList from 'react-select-country-list';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

// Custom components
import Card from '../../../../components/card/Card';
import Menu from '../../../../components/menu/MainMenu'
import { MdAdd, MdArrowUpward, MdArrowDownward, MdRemove, MdAutoGraph, MdTableView } from 'react-icons/md'
import moment from 'moment';
import { useQuery } from 'react-query';
import { getVendors, getCategories } from '../../../admin/views/admin/dbms/dbms/requests/use-request';
import RankChart from './RankCharts';
import Sidebar, { SidebarResponsive } from './Sidebar/Sidebar';

const columnHelper = createColumnHelper();

export default function Vendor() {

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const [data, setData] = useState([]);

    const [country, setCountry] = useState({value: ' '});

    const handleChangeCountry = value => {
        setCountry(value);
    }

    const { data: vendors, isLoadingVendor } = useQuery(
        ['vendors', country],
        () => getVendors(country.value),
        {
            enabled: !!country,
        }
    );
    const { data: categories, isLoadingCategory } = useQuery('categories', getCategories);

    useEffect(() => {
        setData(vendors);
    }, [vendors])

    const columns = [
        columnHelper.group({
            header: 'Rank',  // Main header
            columns: [
                columnHelper.accessor('overall_ranking', {
                    id: 'current_ranking',
                    header: () => (
                        <Text
                            justifyContent="center"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                        >
                            {moment().subtract(1, 'months').format('MMM YYYY')}
                        </Text>
                    ),
                    cell: (info) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                                {info.getValue() === '10000000' ? 'N/A' : info.row.index + 1}
                            </Text>
                        </div>
                    ),
                }),
                columnHelper.accessor('prev_month_overall_ranking', {
                    id: 'prev_month_ranking',
                    header: () => (
                        <Text
                            justifyContent="center"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                        >
                            {moment().subtract(2, 'months').format('MMM YYYY')}
                        </Text>
                    ),
                    cell: (info) => {
                        const currentRank = info.row.original.overall_ranking;
                        return (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, position: "relative" }}>
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                    {currentRank < info.getValue() && <Icon position={"absolute"} left={"-12px"} as={MdArrowUpward} h='18px' w='18px' color={'green.300'} boxSize={5} />}
                                    {currentRank > info.getValue() && <Icon position={"absolute"} as={MdArrowDownward} left={"-12px"} h='18px' w='18px' color={"red.600"} boxSize={5} />}
                                    {info.getValue()}
                                </Text>
                            </div>
                        )
                    },
                }),
                columnHelper.accessor('prev_year_overall_ranking', {
                    id: 'prev_year_ranking',
                    header: () => (
                        <Text
                            justifyContent="center"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                        >
                            {moment().subtract(13, 'months').format('MMM YYYY')}
                        </Text>
                    ),
                    cell: (info) => {
                        const currentRank = info.row.original.overall_ranking;
                        return (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                    {currentRank < info.getValue() && <Icon position={"absolute"} left={"-12px"} as={MdArrowUpward} h='18px' w='18px' color={'green.300'} boxSize={5} />}
                                    {currentRank > info.getValue() && <Icon position={"absolute"} left={"-12px"} as={MdArrowDownward} h='18px' w='18px' color={"red.600"} boxSize={5} />}
                                    {info.getValue()}
                                </Text>
                            </div>
                        )
                    },
                }),
            ],
        }),
        columnHelper.group({
            id: 'name',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Name
                </Text>
            ),
            columns: [
                columnHelper.accessor('db_name', {
                    id: 'db_name',
                    header: null,
                    cell: (info) => (
                        <Flex align="center">
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                                {info.getValue()}
                            </Text>
                        </Flex>
                    ),
                }),
            ]
        }),
        columnHelper.group({
            id: 'db_model',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Database Model
                </Text>
            ),
            columns: [
                columnHelper.accessor('primary_category', {
                    id: 'primary_category',
                    header: null,
                    cell: (info) => {
                        const primary_categories = info.getValue().map(category => category.shortname);
                        let text;
                        if (!primary_categories)
                            return <></>
                        if (isLoadingCategory || !categories) text = ''
                        else text = primary_categories.join(', ');
                        return (
                            <Flex align="center">
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                    {text}
                                    {primary_categories.length > 1 && ", Multi-Model"}
                                </Text>
                            </Flex>
                        )
                    },
                }),
            ],
        }),
        columnHelper.group({
            header: 'Avg. Score',
            columns: [
                columnHelper.accessor('overall_avg_score', {
                    id: 'overall_avg_score',
                    header: () => (
                        <Text
                            justifyContent="space-between"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                        >
                            {moment().subtract(1, 'months').format('MMM YYYY')}
                        </Text>
                    ),
                    cell: (info) => (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                            {info.getValue() === '10000000' ? 'N/A' : Number(info.getValue()).toFixed(2)}
                        </Text>
                    )
                }),
                columnHelper.accessor('prev_month_overall_avg_score', {
                    id: 'prev_month_overall_avg_score',
                    header: () => (
                        <Text
                            justifyContent="space-between"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                        >
                            {moment().subtract(2, 'months').format('MMM YYYY')}
                        </Text>
                    ),
                    cell: (info) => {
                        const overall_avg_score = info.row.original.overall_avg_score
                        return (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                {
                                    overall_avg_score < info.getValue() ?
                                        <Text color={'red.600'} fontSize="sm" fontWeight="700" position={"relative"}>
                                            <Icon as={MdRemove} h='18px' w='18px' color={'red.600'} boxSize={5} position={"absolute"} left={"-20px"} />
                                            {Number(info.getValue() - overall_avg_score).toFixed(2)}
                                        </Text>
                                        : overall_avg_score > info.getValue() ?
                                            <Text color={'green.300'} fontSize="sm" fontWeight="700" position={"relative"}>
                                                <Icon as={MdAdd} h='18px' w='18px' color={'green.300'} boxSize={5} position={"absolute"} left={"-20px"} />
                                                {Number(overall_avg_score - info.getValue()).toFixed(2)}
                                            </Text>
                                            : <Text fontSize="sm" fontWeight="700" position={"relative"}>0.00</Text>
                                }
                            </div>
                        )
                    }
                }),
                columnHelper.accessor('prev_year_overall_avg_score', {
                    id: 'prev_year_overall_avg_score',
                    header: () => (
                        <Text
                            justifyContent="space-between"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                        >
                            {moment().subtract(13, 'months').format('MMM YYYY')}
                        </Text>
                    ),
                    cell: (info) => {
                        const overall_avg_score = info.row.original.overall_avg_score
                        return (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                {
                                    overall_avg_score < info.getValue() ?
                                        <Text color={'red.600'} fontSize="sm" fontWeight="700" position={"relative"}>
                                            <Icon as={MdRemove} h='18px' w='18px' color={'red.600'} boxSize={5} position={"absolute"} left={"-20px"} />
                                            {Number(info.getValue() - overall_avg_score).toFixed(2)}
                                        </Text>
                                        : overall_avg_score > info.getValue() ?
                                            <Text color={'green.300'} fontSize="sm" fontWeight="700" position={"relative"}>
                                                <Icon as={MdAdd} h='18px' w='18px' color={'green.300'} boxSize={5} position={"absolute"} left={"-20px"} />
                                                {Number(overall_avg_score - info.getValue()).toFixed(2)}
                                            </Text>
                                            : <Text fontSize="sm" fontWeight="700" position={"relative"}>0.00</Text>
                                }
                            </div>
                        )
                    }
                }),
            ]
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
    });

    const bgList = useColorModeValue("white", "whiteAlpha.100");
    const bgShadow = useColorModeValue(
        "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
        "unset"
    );

    const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const bgHover = useColorModeValue(
        { bg: "secondaryGray.400" },
        { bg: "whiteAlpha.50" }
    );
    const bgFocus = useColorModeValue(
        { bg: "secondaryGray.300" },
        { bg: "whiteAlpha.100" }
    );

    const [showing, setShowing] = useState(0);
    const [showingCategory, setShowingCategory] = useState(0);

    useEffect(() => {
        if (isLoadingVendor) return;
        if (showingCategory === 0) setData(vendors);
        else {
            const showingVendors = vendors.filter(vendor => vendor.primary_category.map(category => category.id).includes(showingCategory));

            const prevMonthOverallRanking = showingVendors.map(vendor => vendor.prev_month_overall_ranking).sort();
            const prevYearOverAllRanking = showingVendors.map(vendor => vendor.prev_year_overall_ranking).sort();

            setData(showingVendors.map(vendor => ({ ...vendor, prev_month_overall_ranking: prevMonthOverallRanking.indexOf(vendor.prev_month_overall_ranking) + 1, prev_year_overall_ranking: prevYearOverAllRanking.indexOf(vendor.prev_year_overall_ranking) + 1 })))
        }
    }, [showingCategory, setData, isLoadingVendor, vendors])

    const [options, setOptions] = useState([{ id: 0, value: 'all', label: 'All DBMS' }]);

    useEffect(() => {
        if (!isLoadingCategory && categories) setOptions([{ id: 0, value: 'all', label: 'All DBMS' }].concat(categories.map(category => ({ id: category.id, label: category.title, value: category.title }))))
    }, [categories, isLoadingCategory])

    const countryOptions = useMemo(() => [{ value: ' ', label: 'WorldWide' }].concat(countryList().getData()), [{ value: ' ', label: 'WorldWide' }])

    return (
        <Card
            flexDirection="column"
            w="100%"
            px="0px"
            minH="500px"
            overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
            <Sidebar categories={options} showingCategory={showingCategory} setShowingCategory={setShowingCategory} />
            <Flex justifyContent={"flex-end"}>
                <Box width={{ xl: 'calc(100% - 290px)', base: '100%' }} float={"right"}>
                    <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
                        <Text
                            color={textColor}
                            fontSize="22px"
                            mb="4px"
                            fontWeight="700"
                            lineHeight="100%"
                        >
                            DBMS Ranking for {options[showingCategory].label}
                        </Text>
                        <Box display={"flex"} gap={2} alignItems={"center"}>
                            <Select
                                options={countryOptions}
                                value={country}
                                onChange={handleChangeCountry}
                                isSearchable
                                chakraStyles={{
                                    container: (provided) => ({
                                        ...provided,
                                        width: '200px', // Set the container width here
                                    }),
                                }}
                            />
                            <IconButton
                                align='center'
                                justifyContent='center'
                                bg={bgButton}
                                _hover={bgHover}
                                _focus={bgFocus}
                                _active={bgFocus}
                                w='37px'
                                h='37px'
                                lineHeight='100%'
                                borderRadius='10px'
                                onClick={() => setShowing(prev => 1 - prev)}
                            >
                                <Icon as={showing === 0 ? MdAutoGraph : MdTableView} width={"20px"} height={"20px"} color="inherit" />
                            </IconButton>
                            <SidebarResponsive categories={options} showingCategory={showingCategory} setShowingCategory={setShowingCategory} />
                        </Box>
                    </Flex>
                    {showing === 0 ?
                        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
                            <Thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <Th
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    pe="10px"
                                                    borderColor={borderColor}
                                                    cursor="pointer"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <Flex
                                                        justifyContent="space-between"
                                                        align="center"
                                                        fontSize={{ sm: '10px', lg: '12px' }}
                                                        color="gray.400"
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext(),
                                                        )}
                                                        {{
                                                            asc: '',
                                                            desc: '',
                                                        }[header.column.getIsSorted()] ?? null}
                                                    </Flex>
                                                </Th>
                                            );
                                        })}
                                    </Tr>
                                ))}
                            </Thead>
                            <Tbody>
                                {table.getRowModel().rows.length !== 0 ? table
                                    .getRowModel()
                                    .rows
                                    .map((row) => {
                                        return (
                                            <Tr key={row.id}>
                                                {row.getVisibleCells().map((cell) => {
                                                    return (
                                                        <Td
                                                            key={cell.id}
                                                            fontSize={{ sm: '14px' }}
                                                            minW={{ sm: '70px', md: '70px', lg: 'auto' }}
                                                            borderColor="transparent"
                                                        >
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext(),
                                                            )}
                                                        </Td>
                                                    );
                                                })}
                                            </Tr>
                                        );
                                    }) : (
                                    <Tr>
                                        <Td
                                            fontSize={{ sm: '14px' }}
                                            minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                                            borderColor="transparent"
                                            colSpan={8}
                                        >
                                            <Text
                                                color={textColor}
                                                mb="4px"
                                                align={"center"}
                                                fontWeight="700"
                                                lineHeight="100%"
                                            >
                                                No Databases
                                            </Text>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table> : <RankChart showingCategory={options[showingCategory].id} country={country} />
                    }
                </Box>
            </Flex>
        </Card>
    );
}