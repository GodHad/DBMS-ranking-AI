import React, { useState, useEffect } from 'react';
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
import { MdDelete, MdEdit, MdArrowLeft, MdArrowRight, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// Custom components
import Card from '../../../../../../../components/card/Card';
import Menu from '../../../../../../../components/menu/MainMenu';
import BlogForm from './components/BlogForm';
import { MdAdd } from 'react-icons/md'
import { getBlogs, getBlog, deleteBlog } from './requests/use-request';
import { APP_URL } from '../../../../../variables/statics';

const columnHelper = createColumnHelper();

const initialBlog = {
    id: null,
    title: '',
    description: '',
    content: '',
    tags: [],
    categories: [],
    featured_images: []
}

const stripHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

export default () => {
    const toast = useToast();
    const queryClient = useQueryClient();

    const [sorting, setSorting] = useState([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const [openedPage, setOpenedPage] = useState(0);

    const [blog, setBlog] = useState(initialBlog);
    const { data: blogs, isLoadingBlogs } = useQuery('blogs', getBlogs);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [blogId, setBlogId] = useState(null)

    const { data: _blog, isLoading: isLoadingBlog } = useQuery(
        ['blog', blogId],
        () => getBlog(blogId),
        {
            enabled: !!blogId, // Only run the query if blogId is not null
        }
    );

    useEffect(() => {
        if (_blog) 
            setBlog({
                ..._blog, 
                tags: _blog.tags.map(tag => tag.id), 
                categories: _blog.categories.map(category => category.id), 
                featured_images: _blog.featured_images.map(image => (APP_URL + 'storage/' + image.url)) || [],
            });
    }, [_blog])

    const handleGetBlogAndOpenModal = async (id) => {
        setBlogId(id);
        setOpenedPage(1);
    }

    const handleDeleteBlog = useMutation(deleteBlog, {
        onSuccess: () => {
            queryClient.invalidateQueries('blogs');
            toast({
                title: "Delete Blog successfully",
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        },
        onError: () => {
            toast({
                title: "Failed to Delete Blog",
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
        columnHelper.accessor('title', {
            id: 'title',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Title
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="sm" fontWeight="700">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('description', {
            id: 'description',
            header: () => (
                <Text
                    justifyContent="center"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Content
                </Text>
            ),
            cell: (info) => {
                return (
                    <Box maxW={"400px"}>
                        <Text color={textColor} fontSize="sm" fontWeight="700" isTruncated>
                            {stripHTML(info.getValue())}
                        </Text>
                    </Box>
                )
            },
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
                        onClick={() => { handleGetBlogAndOpenModal(info.row.original.id); }}
                    >
                        <Icon as={MdEdit} color='secondaryGray.500' h='18px' w='18px' />
                    </Link>
                    <Link
                        variant='no-hover'
                        me='16px'
                        ms='auto'
                        p='0px !important'
                        onClick={() => handleDeleteBlog.mutate(info.row.original.id)}
                    >
                        <Icon as={MdDelete} color='secondaryGray.500' h='18px' w='18px' />
                    </Link>
                </>
            ),
        }),
    ];

    const table = useReactTable({
        data: blogs || [],
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
                            Blogs
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
                            onClick={() => { setOpenedPage(1); setBlog(initialBlog) }}
                        >
                            <Icon as={MdAdd} h='18px' w='18px' />New Blog
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
                                                No Blogs
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
            {openedPage === 1 && <BlogForm blog={blog} setOpenedPage={() => { setOpenedPage(0); setBlogId(null) }} />}
        </Card>
    )
}