import React, { useState, useEffect, useMemo } from 'react';
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
} from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import Card from '../../../../../../../components/card/Card';
import BlogForm from './components/BlogForm';
import { MdAdd } from 'react-icons/md'
import { getBlogs, getBlog, deleteBlog } from './requests/use-request';

const columnHelper = createColumnHelper();

export const initialBlog = {
    id: null,
    title: '',
    description: '',
    content: '',
    tags: [],
    categories: [],
    featured_images: [],
    meta_title: '',
    meta_description: '',
    og_graph_image: '',
    twitter_graph_image: ''
}

const stripHTML = (html) => {
    let modifiedText = html.replace(/!\[.*?\]\(.*?\)/g, '').trim();
    return modifiedText
};

export default () => {
    const toast = useToast();
    const queryClient = useQueryClient();

    const [sorting, setSorting] = useState([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const [openedPage, setOpenedPage] = useState(0);

    const [page, setPage] = useState(1);
    const [countPerPage, setCountPerPage] = useState(10);

    const { data: blogs = {} } = useQuery(['blogs', page, countPerPage], () => getBlogs({ page, countPerPage }), { staleTime: 30000 });

    const memorizedData = useMemo(() => {
        if (Array.isArray(blogs.data)) {
            return blogs.data; 
        }
        return [];
    }, [blogs.data]);


    const [blog, setBlog] = useState(initialBlog);
    const [blogId, setBlogId] = useState(null)

    const { data: _blog } = useQuery(
        ['blog', blogId],
        () => getBlog(blogId),
        {
            enabled: !!blogId
        }
    );

    useEffect(() => {
        if (_blog)
            setBlog({
                ..._blog,
                tags: _blog.tags.map(tag => tag.id),
                categories: _blog.categories.map(category => category.id),
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
        onError: (error) => {
            const errors = error.response.data.errors ? error.response.data.errors : { error: error.response.data.error };
            const key = errors[Object.keys(errors)[0]];
            toast({
                title: "Failed to Delete Blog",
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
                    {countPerPage * (page - 1) + info.row.index + 1}
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
        columnHelper.accessor('content', {
            id: 'content',
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
        data: memorizedData || [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        debugTable: false,
    });

    const paginationControls = useMemo(() => (
        <Flex justifyContent="space-between" m={4} alignItems="center">
            <Flex mr={2}>
                <Tooltip label="First Page">
                    <IconButton
                        onClick={() => setPage(1)}
                        isDisabled={blogs.current_page === 1}
                        icon={<MdArrowLeft h={3} w={3} />}
                        mr={4}
                    />
                </Tooltip>
                <Tooltip label="Previous Page">
                    <IconButton
                        onClick={() => { if (page > 1) setPage(page - 1) }}
                        isDisabled={blogs.current_page === 1}
                        icon={<MdChevronLeft h={6} w={6} />}
                    />
                </Tooltip>
            </Flex>

            <Flex alignItems="center">
                <Text flexShrink="0" mr={4}>
                    Page{" "}
                    <Text fontWeight="bold" as="span">
                        {blogs.current_page}
                    </Text>{" "}
                    of{" "}
                    <Text fontWeight="bold" as="span">
                        {blogs.last_page}
                    </Text>
                </Text>
                <Text flexShrink="0">Go to</Text>{" "}
                <NumberInput
                    ml={2}
                    mr={4}
                    w={20}
                    min={1}
                    max={blogs.last_page}
                    value={blogs.current_page}
                    onChange={(_, value) => {
                        if (value >= 1 && value <= blogs.last_page) {
                            setPage(value);
                        }
                    }}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <Select
                    w={32}
                    color={textColor}
                    value={countPerPage}
                    onChange={e => setCountPerPage(Number(e.target.value))}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </Select>
            </Flex>

            <Flex>
                <Tooltip label="Next Page">
                    <IconButton
                        onClick={() => { if (page < blogs.last_page) setPage(page + 1) }}
                        isDisabled={blogs.current_page === blogs.last_page}
                        icon={<MdChevronRight h={10} w={10} />}
                    />
                </Tooltip>
                <Tooltip label="Last Page">
                    <IconButton
                        onClick={() => setPage(blogs.last_page)}
                        isDisabled={blogs.current_page === blogs.last_page}
                        icon={<MdArrowRight h={10} w={10} />}
                        ml={4}
                    />
                </Tooltip>
            </Flex>
        </Flex>
    ), [blogs])

    return (
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
                        {(blogs.data && blogs.last_page > 1) && paginationControls}
                    </Box>
                </>
            )}
            {openedPage === 1 && <BlogForm blog={blog} setOpenedPage={() => { setOpenedPage(0); setBlogId(null) }} />}
        </Card>
    )
}