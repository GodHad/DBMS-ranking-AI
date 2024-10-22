import {
    Flex,
    Box,
    Button,
    Icon,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Link,
    FormControl,
    Tooltip,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select as SimpleSelect,
    useToast,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { MdDelete, MdEdit, MdArrowLeft, MdArrowRight, MdChevronLeft, MdChevronRight, MdArrowUpward, MdArrowDownward, MdRemove } from 'react-icons/md';
import React, { useState, useEffect } from 'react'

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel
} from '@tanstack/react-table';

// Custom components
import Card from '../../../../../../components/card/Card';
import Menu from '../../../../../../components/menu/MainMenu';
import DBMSForm from './components/DBMSForm';
import { MdAdd } from 'react-icons/md'
import moment from 'moment';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteVendor, getCategories, getVendors } from './requests/use-request';

const columnHelper = createColumnHelper();

const initialVendor = {
    id: null,
    company_name: '',
    description: '',
    primary_category: [],
    secondary_category: [],
    contact_info: '',
    website_url: '',
    technical_doc: '',
    developer: '',
    initial_release: '',
    current_release: '',
    license: '',
    cloud_based_only: 0,
    dbaas_offerings: '',
    implementation_lang: '',
    server_os: '',
    data_scheme: 0,
    typing: 0,
    xml_support: 0,
    secondary_indexes: 0,
    sql: '',
    apis_access_method: '',
    supported_programming_lang: '',
    server_side_scripts: '',
    triggers: 0,
    partitioning_methods: '',
    replication_methods: '',
    mapreduce: 1,
    consistency_concepts: '',
    foreign_keys: 0,
    trasaction_concepts: 0,
    concurrency: 0,
    durability: 0,
    in_memory_capabilities: 0,
    user_concepts: '',
    db_name: '',
}

export default function Vendor() {
    const toast = useToast();
    const queryClient = useQueryClient();

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const [showingCategory, setShowingCategory] = useState('');
    const [data, setData] = useState([]);
    const [openedPage, setOpenedPage] = useState(0)
    const [vendor, setVendor] = useState(initialVendor)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data: vendors, isLoadingVendor } = useQuery('vendors', getVendors);
    const { data: categories, isLoadingCategory } = useQuery('categories', getCategories);

    const deleteUser = useMutation(deleteVendor, {
        onSuccess: () => {
            queryClient.invalidateQueries('vendors');
            toast({
                title: "Delete vendor successfully",
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        },
        onError: (error) => {
            const errors = error.response.data.errors ? error.response.data.errors : {error: error.response.data.error};
            const key = errors[Object.keys(errors)[0]];
            toast({
                title: "Failed to delete vendor",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    useEffect(() => {
        if (isLoadingVendor) return;
        if (showingCategory === '') setData(vendors);
        else {
            const showingVendors = vendors.filter(vendor => vendor.primary_category.includes('' + showingCategory))
            setData(showingVendors)
        }
    }, [showingCategory, setData, isLoadingVendor, vendors])

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
                                {info.getValue() === '10000000' ? 'N/A' : info.getValue()}
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: "relative" }}>
                                {currentRank < info.getValue() && <Icon position={"absolute"} left={"-25px"} as={MdArrowUpward} h='18px' w='18px' color={'green.300'} boxSize={5} />}
                                {currentRank > info.getValue() && <Icon position={"absolute"} as={MdArrowDownward} left={"-25px"} h='18px' w='18px' color={"red.600"} boxSize={5} />}
                                <Text color={textColor} fontSize="sm" fontWeight="700">
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                                {currentRank < info.getValue() && <Icon position={"absolute"} left={"-25px"} as={MdArrowUpward} h='18px' w='18px' color={'green.300'} boxSize={5} />}
                                {currentRank > info.getValue() && <Icon position={"absolute"} left={"-25px"} as={MdArrowDownward} h='18px' w='18px' color={"red.600"} boxSize={5} />}
                                <Text color={textColor} fontSize="sm" fontWeight="700">
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
                        const primary_categories = info.getValue();
                        let text;
                        if (!info.row.original.primary_categories || !info.row.original.secondary_category)
                            return <></>
                        if (isLoadingCategory || !categories) text = ''
                        else text = primary_categories.filter(category => category !== '').map(category => categories.find(_category => _category.id == category).shortname).join(', ');
                        const secondary_categories = info.row.original.secondary_category.filter(category => category !== '');
                        return (
                            <Flex align="center">
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                    {text}
                                    {secondary_categories.length > 0 && ", Multi-Model"}
                                </Text>
                            </Flex>
                        )
                    },
                }),
            ]
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {overall_avg_score < info.getValue() &&
                                    <>
                                        <Text color={'red.600'} fontSize="sm" fontWeight="700" position={"relative"} marginLeft={"25px"}>
                                            <Icon as={MdRemove} h='18px' w='18px' color={'red.600'} boxSize={5} position={"absolute"} left={"-25px"} />
                                            {Number(info.getValue() - overall_avg_score).toFixed(2)}
                                        </Text>
                                    </>
                                }
                                {overall_avg_score > info.getValue() &&
                                    <>
                                        <Text color={'green.300'} fontSize="sm" fontWeight="700" position={"relative"} marginLeft={"25px"}>
                                            <Icon as={MdAdd} h='18px' w='18px' color={'green.300'} boxSize={5} position={"absolute"} left={"-25px"} />
                                            {Number(overall_avg_score - info.getValue()).toFixed(2)}
                                        </Text>
                                    </>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {overall_avg_score < info.getValue() &&
                                    <>
                                        <Text color={'red.600'} fontSize="sm" fontWeight="700" position={"relative"} marginLeft={"25px"}>
                                            <Icon as={MdRemove} h='18px' w='18px' color={'red.600'} boxSize={5} position={"absolute"} left={"-25px"} />
                                            {Number(info.getValue() - overall_avg_score).toFixed(2)}
                                        </Text>
                                    </>
                                }
                                {overall_avg_score > info.getValue() &&
                                    <>
                                        <Text color={'green.300'} fontSize="sm" fontWeight="700" position={"relative"} marginLeft={"25px"}>
                                            <Icon as={MdAdd} h='18px' w='18px' color={'green.300'} boxSize={5} position={"absolute"} left={"-25px"} />
                                            {Number(overall_avg_score - info.getValue()).toFixed(2)}
                                        </Text>
                                    </>
                                }
                            </div>
                        )
                    }
                }),
            ]
        }),
        columnHelper.group({
            header: 'Actions',
            columns: [
                columnHelper.accessor('action', {
                    id: 'action',
                    header: () => (
                        <Text
                            justifyContent="space-between"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                        >

                        </Text>
                    ),
                    cell: (info) => (
                        <>
                            <Link
                                variant='no-hover'
                                me='16px'
                                ms='auto'
                                p='0px !important'
                                onClick={() => { setVendor(info.row.original); setOpenedPage(1) }}
                            >
                                <Icon as={MdEdit} color='secondaryGray.500' h='18px' w='18px' />
                            </Link>
                            <Link
                                variant='no-hover'
                                me='16px'
                                ms='auto'
                                p='0px !important'
                                onClick={() => deleteUser.mutate(info.row.original.id)}
                            >
                                <Icon as={MdDelete} color='secondaryGray.500' h='18px' w='18px' />
                            </Link>
                        </>
                    ),
                }),
            ]
        })
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        debugTable: true,
    });

    const [options, setOptions] = useState([{ value: 'all', label: 'All' }]);

    useEffect(() => {
        if (!isLoadingCategory && categories) setOptions([{ value: 'all', label: 'All' }].concat(categories.map(category => ({ id: category.id, label: category.title, value: category.title }))))
    }, [categories, isLoadingCategory])

    return (
        <Card
            flexDirection="column"
            w="100%"
            px="0px"
            overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
            {openedPage === 0 && (
                <>
                    <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
                        <Text
                            color={textColor}
                            fontSize="22px"
                            mb="4px"
                            fontWeight="700"
                            lineHeight="100%"
                        >
                            DBMS
                        </Text>
                        <Menu />
                    </Flex>
                    <div style={{ display: 'flex', justifyContent: "space-between", marginTop: '20px', marginLeft: '20px', alignItems: 'center' }}>
                        <Flex w='100%'>
                            <Button
                                me='100%'
                                w='140px'
                                minW='140px'
                                variant='brand'
                                fontWeight='500'
                                onClick={() => { setOpenedPage(1); setVendor(initialVendor) }}
                            >
                                <Icon as={MdAdd} h='18px' w='18px' />New DBMS
                            </Button>
                        </Flex>
                        <FormControl p={4} w={"50%"} minW={"200px"} maxW={"300px"}>
                            <Select
                                id="color-select"
                                name="colors"
                                options={options}
                                closeMenuOnSelect={false}
                                size="lg"
                                onChange={(e) => setShowingCategory(e.id)}
                            />
                        </FormControl>
                    </div>
                    <Flex w='100%'>
                    </Flex>
                    <Box>
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
                                                            minW={{ sm: '150px', md: '200px', lg: 'auto' }}
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
                                                No Categories
                                            </Text>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                        {table.getRowModel().rows.length !== 0 &&
                            <Flex justifyContent="space-between" m={4} alignItems="center" >
                                <Flex>
                                    <Tooltip label="First Page" >
                                        <IconButton
                                            onClick={() => table.firstPage()}
                                            isDisabled={!table.getCanPreviousPage()}
                                            icon={<MdArrowLeft h={3} w={3} />}
                                            mr={4}
                                        />
                                    </Tooltip>
                                    <Tooltip label="Previous Page" >
                                        <IconButton
                                            onClick={() => table.previousPage()}
                                            isDisabled={!table.getCanPreviousPage()}
                                            icon={<MdChevronLeft h={6} w={6} />}
                                        />
                                    </Tooltip>
                                </Flex>

                                <Flex alignItems="center" >
                                    <Text flexShrink="0" mr={8} >
                                        Page{" "}
                                        <Text fontWeight="bold" as="span" >
                                            {table.getState().pagination.pageIndex + 1}
                                        </Text>{" "}
                                        of{" "}
                                        <Text fontWeight="bold" as="span" >
                                            {table.getPageCount().toLocaleString()}
                                        </Text>
                                    </Text>
                                    <Text flexShrink="0" > Go to page: </Text>{" "}
                                    <NumberInput
                                        ml={2}
                                        mr={8}
                                        w={28}
                                        min={1}
                                        max={table.getPageCount()}
                                        onChange={value => {
                                            const page = Number(value) - 1;
                                            table.setPageIndex(page)
                                        }}
                                        defaultValue={table.getState().pagination.pageIndex + 1}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper >
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <SimpleSelect
                                        w={32}
                                        color={textColor}
                                        value={table.getState().pagination.pageSize}
                                        onChange={e => {
                                            table.setPageSize(Number(e.target.value))
                                        }}
                                    >
                                        {
                                            [10, 20, 30, 40, 50].map((pageSize) => (
                                                <option key={pageSize} value={pageSize} >
                                                    Show {pageSize}
                                                </option>
                                            ))
                                        }
                                    </SimpleSelect>
                                </Flex>

                                <Flex >
                                    <Tooltip label="Next Page" >
                                        <IconButton
                                            onClick={() => table.nextPage()}
                                            isDisabled={!table.getCanNextPage()}
                                            icon={<MdChevronRight h={10} w={10} />}
                                        />
                                    </Tooltip>
                                    <Tooltip label="Last Page" >
                                        <IconButton
                                            onClick={() => table.lastPage()}
                                            isDisabled={!table.getCanNextPage()}
                                            icon={<MdArrowRight h={10} w={10} />}
                                            ml={4}
                                        />
                                    </Tooltip>
                                </Flex>
                            </Flex>
                        }
                    </Box>
                </>
            )}
            {openedPage === 1 && <DBMSForm vendor={vendor} categories={categories} setOpenedPage={() => { setOpenedPage(0); }} />}
        </Card>
    );
}
