import React, { useState } from 'react';
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
    Link,
    Tooltip,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import {
    MdDelete,
    MdEdit,
    MdArrowLeft,
    MdArrowRight,
    MdChevronLeft,
    MdChevronRight,
    MdCheckCircle,
    MdOutlineRemoveCircle
} from 'react-icons/md';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    getPaginationRowModel,
} from '@tanstack/react-table';

// Custom components
import Card from '../../../../../../components/card/Card';
import Menu from '../../../../../../components/menu/MainMenu';
import VendorForm from './components/VendorForm';
import { MdAdd } from 'react-icons/md'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getVendors, getVendor, deleteVendor } from './requests/use-request';

const columnHelper = createColumnHelper();

const initialVendor = {
    id: null,
    name: '',
    surname: '',
    phone_number: '',
    job_title: '',
    company: '',
    approved: 0,
    userRoleId: null
}

const Vendor = () => {
    const toast = useToast();
    const queryClient = useQueryClient();

    const [sorting, setSorting] = useState([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const [openedPage, setOpenedPage] = useState(0);

    const [vendor, setVendor] = useState(initialVendor);
    const { data: vendors, isLoadingSponsors } = useQuery('vendors', getVendors);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const handleDeleteVendor = useMutation(deleteVendor, {
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

    const columns = [
        columnHelper.accessor('no', {
            id: 'no',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    No
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="sm" fontWeight="700">
                    {info.row.index + 1}
                </Text>
            ),
        }),
        columnHelper.accessor('name', {
            id: 'name',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    First Name
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="sm" fontWeight="700">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('surname', {
            id: 'surname',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Surname
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="sm" fontWeight="700">
                    {info.getValue()}
                </Text>
            )
        }),
        columnHelper.accessor('email', {
            id: 'email',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Email
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="sm" fontWeight="700">
                    {info.getValue()}
                </Text>
            )
        }),
        columnHelper.accessor('phone_number', {
            id: 'phone_number',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Phone Number
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="sm" fontWeight="700">
                    {info.getValue()}
                </Text>
            )
        }),
        // columnHelper.accessor('job_title', {
        //     id: 'job_title',
        //     header: () => (
        //         <Text
        //             justifyContent="center"
        //             align="center"
        //             fontSize={{ sm: '10px', lg: '12px' }}
        //             color="gray.400"
        //         >
        //             Job Title
        //         </Text>
        //     ),
        //     cell: (info) => (
        //         <Text color={textColor} fontSize="sm" fontWeight="700">
        //             {info.getValue()}
        //         </Text>
        //     )
        // }),
        columnHelper.accessor('company', {
            id: 'company',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Company
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="sm" fontWeight="700">
                    {info.getValue()}
                </Text>
            )
        }),
        columnHelper.accessor('approved', {
            id: 'aproved',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Approved
                </Text>
            ),
            cell: (info) => (
                <Flex align="center">
                    <Icon
                        w="24px"
                        h="24px"
                        me="5px"
                        color={info.getValue() === 1 ? 'green.500' : 'gray.500'}
                        as={info.getValue() === 1 ? MdCheckCircle : MdOutlineRemoveCircle}
                    />
                </Flex>
            )
        }),
        columnHelper.accessor('action', {
            id: 'action',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Actions
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
                        onClick={() => handleDeleteVendor.mutate(info.row.original.id)}
                    >
                        <Icon as={MdDelete} color='secondaryGray.500' h='18px' w='18px' />
                    </Link>
                </>
            ),
        }),
    ];

    const table = useReactTable({
        data: vendors || [],
        columns,
        state: {
            sorting,
            pagination
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        debugTable: true,
    });

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
                            Vendors
                        </Text>
                        <Menu />
                    </Flex>
                    <Flex w='100%'>
                        <Button
                            mb='50px'
                            mt={{ base: "20px" }}
                            ml={{ base: "20px" }}
                            variant='brand'
                            fontWeight='500'
                            onClick={() => { setOpenedPage(1); setVendor(initialVendor) }}
                        >
                            <Icon as={MdAdd} h='18px' w='18px' />New Vendor
                        </Button>
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
                                                No Vendors
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
                                    <Select
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
                                    </Select>
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
            {openedPage === 1 && <VendorForm vendor={vendor} setOpenedPage={() => { setOpenedPage(0); }} />}
        </Card>
    )
}

export default Vendor;