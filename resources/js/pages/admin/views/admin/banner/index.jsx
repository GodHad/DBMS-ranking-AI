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

import Card from '../../../../../components/card/Card';
import BannerForm from './components/BannerForm';
import { MdAdd } from 'react-icons/md'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getBanners, deleteBanner } from './requests/use-request';

const columnHelper = createColumnHelper();

const initialBanner = {
    id: null,
    link: '',
    url: '',
    type: 0
}

export default function Banner() {
    const toast = useToast();
    const queryClient = useQueryClient();

    const [sorting, setSorting] = useState([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const [openedPage, setOpenedPage] = useState(0);

    const [banner, setBanner] = useState(initialBanner);
    const { data: banners, isLoadingBanners } = useQuery('banners', getBanners);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const handleDeleteBanner = useMutation(deleteBanner, {
        onSuccess: () => {
            queryClient.invalidateQueries('banners');
            toast({
                title: "Delete banner successfully",
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        },
        onError: (error) => {
            const errors = error.response.data.errors ? error.response.data.errors : { error: error.response.data.error };
            const key = errors[Object.keys(errors)[0]];
            toast({
                title: "Failed to delete banner",
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
        columnHelper.accessor('type', {
            id: 'type',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Type
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="sm" fontWeight="700" _hover={{ color: 'blue.400' }}>
                    {info.getValue() === 0 ? 'Top Banner' : 'Bottom Banner'}
                </Text>
            )
        }),
        columnHelper.accessor('link', {
            id: 'link',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Link
                </Text>
            ),
            cell: (info) => (
                <a href={info.getValue()} target='_blank'>
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                        {info.getValue()}
                    </Text>
                </a>
            ),
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
                        onClick={() => { setBanner(info.row.original); setOpenedPage(1) }}
                    >
                        <Icon as={MdEdit} color='secondaryGray.500' h='18px' w='18px' />
                    </Link>
                    <Link
                        variant='no-hover'
                        me='16px'
                        ms='auto'
                        p='0px !important'
                        onClick={() => handleDeleteBanner.mutate(info.row.original.id)}
                    >
                        <Icon as={MdDelete} color='secondaryGray.500' h='18px' w='18px' />
                    </Link>
                </>
            ),
        }),
    ];

    const table = useReactTable({
        data: banners || [],
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
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Card
                flexDirection="column"
                w="100%"
                px="0px"
                overflowX={{ sm: 'scroll', lg: 'hidden' }}
            >
                {openedPage === 0 && (
                    <>
                        <Flex w='100%'>
                            <Button
                                mb='50px'
                                mt={{ base: "20px" }}
                                ml={{ base: "20px" }}
                                variant='brand'
                                fontWeight='500'
                                onClick={() => { setOpenedPage(1); setBanner(initialBanner) }}
                            >
                                <Icon as={MdAdd} h='18px' w='18px' />New Banner
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
                                                    No Banners
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
                {openedPage === 1 && <BannerForm banner={banner} setOpenedPage={() => { setOpenedPage(0); }} />}
            </Card>
        </Box >
    );
}