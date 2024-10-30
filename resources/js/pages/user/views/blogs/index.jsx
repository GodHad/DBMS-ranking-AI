import React, { useState, useEffect } from 'react';
import { Box, Heading, Avatar, Text, Flex, Breadcrumb, BreadcrumbItem, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Stack, Tag, Image, Tooltip, IconButton, useColorModeValue } from '@chakra-ui/react';
import Card from "../../../../components/card/Card";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { MdArrowLeft, MdArrowRight, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { getBlogs, getCategories, getTags } from '../../../admin/views/admin/blog/components/blogs/requests/use-request';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
    Skeleton,
    SkeletonCircle,
    SkeletonText,
} from "@chakra-ui/skeleton";
import Sidebar from './Sidebar/Sidebar';
import { SidebarResponsive } from './Sidebar/Sidebar';
import { generateSlug } from '../../../../variables/statics';
import { Helmet } from 'react-helmet';

export default () => {

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'white');
    const blogCardBg = useColorModeValue("gray.200", "navy.900");

    const [page, setPage] = useState(1);
    const [countPerPage, setCountPerPage] = useState(10);
    const [showingCategories, setShowingCategories] = useState([]);
    const [showingTags, setShowingTags] = useState([]);

    const { data: blogs, isLoadingBlogs } = useQuery(['blogs', showingCategories, showingTags, page, countPerPage], () => getBlogs({ categories: showingCategories, tags: showingTags.map(tag => tag.id), page, countPerPage }), { staleTime: 300000 });
    const { data: categories, isLoadingCategory } = useQuery('bcategories', getCategories, { staleTime: 300000 });
    const { data: tags, isLoadingTag } = useQuery('tags', getTags, { staleTime: 300000 });

    const [options, setOptions] = useState(null);

    useEffect(() => {
        if (!isLoadingTag && tags) setOptions(tags.map(tag => ({ id: tag.id, label: tag.name, value: tag.name })))
    }, [tags, isLoadingTag]);

    return (
        <>
            <Helmet>
                <title>DB Rank AI | Blog</title>
            </Helmet>
            <Card
                w="100%"
                px="0px"
                minH="calc(100vh - 150px)"
            >
                {
                    (categories && tags) ?
                        <Sidebar categories={categories} showingCategories={showingCategories} setShowingCategories={setShowingCategories} tags={options} showingTags={showingTags} setShowingTags={setShowingTags} />
                        : (
                            <>
                                <Card h={'100%'} display="flex" flexDir={"column"} justifyContent={"space-between"} mb={"10px"} bg={blogCardBg}>
                                    <Stack gap="1">
                                        <Skeleton height={"300px"} borderRadius={"12px"} />
                                        <Skeleton height={"20px"} borderRadius={"12px"} />
                                        <SkeletonCircle size={10} />
                                        <Skeleton height={"12px"} borderRadius={"12px"} />
                                    </Stack>
                                </Card>
                                <Card h={'100%'} display="flex" flexDir={"column"} justifyContent={"space-between"} mb={"10px"} bg={blogCardBg}>
                                    <Stack gap="1">
                                        <Skeleton height={"300px"} borderRadius={"12px"} />
                                        <Skeleton height={"20px"} borderRadius={"12px"} />
                                        <SkeletonCircle size={10} />
                                        <Skeleton height={"12px"} borderRadius={"12px"} />
                                    </Stack>
                                </Card>
                                <Card h={'100%'} display="flex" flexDir={"column"} justifyContent={"space-between"} mb={"10px"} bg={blogCardBg}>
                                    <Stack gap="1">
                                        <Skeleton height={"300px"} borderRadius={"12px"} />
                                        <Skeleton height={"20px"} borderRadius={"12px"} />
                                        <SkeletonCircle size={10} />
                                        <Skeleton height={"12px"} borderRadius={"12px"} />
                                    </Stack>
                                </Card>
                            </>
                        )
                }
                <Flex justifyContent={"flex-end"}>
                    <Box width={{ xl: 'calc(100% - 290px)', base: '100%' }} float={"right"} px="25px">
                        <Breadcrumb>
                            <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                                <Link to='/'>
                                    Home
                                </Link>
                            </BreadcrumbItem>

                            <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                                <Link to='/blog'>
                                    Blog
                                </Link>
                            </BreadcrumbItem>
                        </Breadcrumb>
                        <Flex justify={'space-between'} alignItems={'center'}>
                            <Text
                                color={textColor}
                                fontSize="22px"
                                mb="30px"
                                fontWeight="700"
                                lineHeight="100%"
                            >
                                Blog
                            </Text>
                            {(categories && tags) && <SidebarResponsive categories={categories} showingCategories={showingCategories} setShowingCategories={setShowingCategories} tags={options} showingTags={showingTags} setShowingTags={setShowingTags} />}
                        </Flex>
                        <Box>
                            {
                                (blogs && blogs.data) ? blogs.data.length > 0 ? blogs.data.map((blog, index) => (
                                    !blog ? <></> :
                                        <Card h={'100%'} display="flex" flexDir={"column"} justifyContent={"space-between"} mb={"10px"} bg={blogCardBg} key={index}>
                                            <Box>
                                                <Image
                                                    mb={5}
                                                    h="250px"
                                                    w="100%"
                                                    borderRadius="xl"
                                                    objectFit="cover"
                                                    objectPosition="center"
                                                    transition="transform 0.2s ease-out"
                                                    _hover={{ transform: "scale(1.02)" }}
                                                    src={`storage/${blog.featured_images[0].url}?w=1400&auto=compression,format`}
                                                    alt={blog.title}
                                                />
                                                <Heading
                                                    as="h2"
                                                    pb={3}
                                                    fontSize="25px"
                                                    fontWeight="700"
                                                    color="gray.800"
                                                    _dark={{ color: "gray.200" }}
                                                >
                                                    {blog.title}
                                                </Heading>
                                            </Box>

                                            <Box>
                                                <Flex direction={"column"} justify="space-between" mb={4} gap={2}>
                                                    <Flex align="center" color="gray.500" _dark={{ color: "gray.400" }} gap={2}>
                                                        <Avatar
                                                            _hover={{ cursor: 'pointer' }}
                                                            color="white"
                                                            name={blog.user.name + ' ' + blog.user.surname}
                                                            bg="#11047A"
                                                            size="sm"
                                                            w="40px"
                                                            h="40px"
                                                        />
                                                        By <Text color="blue.500" _dark={{ color: "green.200" }}>{` ${blog.user.name} ${blog.user.surname ? blog.user.surname : ''}`}</Text> on {moment(blog.created_at).format('MMM D, YYYY')}
                                                    </Flex>
                                                    <Flex
                                                        justify={'start'}
                                                        gap={1}
                                                    >
                                                        {blog.tags &&
                                                            blog.tags.slice(0, 2).map((category) => (
                                                                <Tag key={category.name} color="white" bgColor="blue.500" _dark={{ bgColor: "green.500" }}>{category.name}</Tag>
                                                            ))}
                                                        {blog.tags.length > 2 && <Text>{`+${blog.tags.length - 2}`} more</Text>}
                                                    </Flex>
                                                </Flex>

                                                <Flex justify="space-between" fontWeight="medium" color="blue.500" _dark={{ color: "green.200" }}>
                                                    <Link to={`/blog/${blog.id}/${generateSlug(blog.title)}`}>
                                                        <Flex align="center">
                                                            <Text>Read article</Text>
                                                            <ArrowRightIcon w={4} h={4} mx={2} />
                                                        </Flex>
                                                    </Link>
                                                </Flex>
                                            </Box>
                                        </Card>
                                )) : (
                                    <Text
                                        color={textColor}
                                        mb="4px"
                                        align={"center"}
                                        fontWeight="700"
                                        lineHeight="100%"
                                    >
                                        No blogs
                                    </Text>
                                ) : (
                                    <>
                                        <Card h={'100%'} display="flex" flexDir={"column"} justifyContent={"space-between"} mb={"10px"} bg={blogCardBg}>
                                            <Stack gap="1">
                                                <Skeleton height={"300px"} borderRadius={"12px"} />
                                                <Skeleton height={"20px"} borderRadius={"12px"} />
                                                <SkeletonCircle size={10} />
                                                <Skeleton height={"12px"} borderRadius={"12px"} />
                                            </Stack>
                                        </Card>
                                        <Card h={'100%'} display="flex" flexDir={"column"} justifyContent={"space-between"} mb={"10px"} bg={blogCardBg}>
                                            <Stack gap="1">
                                                <Skeleton height={"300px"} borderRadius={"12px"} />
                                                <Skeleton height={"20px"} borderRadius={"12px"} />
                                                <SkeletonCircle size={10} />
                                                <Skeleton height={"12px"} borderRadius={"12px"} />
                                            </Stack>
                                        </Card>
                                        <Card h={'100%'} display="flex" flexDir={"column"} justifyContent={"space-between"} mb={"10px"} bg={blogCardBg}>
                                            <Stack gap="1">
                                                <Skeleton height={"300px"} borderRadius={"12px"} />
                                                <Skeleton height={"20px"} borderRadius={"12px"} />
                                                <SkeletonCircle size={10} />
                                                <Skeleton height={"12px"} borderRadius={"12px"} />
                                            </Stack>
                                        </Card>
                                    </>
                                )
                            }

                        </Box>
                        {(blogs && blogs.last_page > 1) &&
                            <Flex justifyContent="space-between" m={4} alignItems="center" >
                                <Flex mr={2}>
                                    {/* <Tooltip label="First Page" >
                                    <IconButton
                                        onClick={() => setPage(1)}
                                        isDisabled={page === 1}
                                        icon={<MdArrowLeft h={3} w={3} />}
                                        mr={4}
                                    />
                                </Tooltip> */}
                                    <Tooltip label="Previous Page" >
                                        <IconButton
                                            onClick={() => setPage(prev => prev - 1)}
                                            isDisabled={page === 1}
                                            icon={<MdChevronLeft h={6} w={6} />}
                                        />
                                    </Tooltip>
                                </Flex>

                                <Flex alignItems="center" >
                                    <Text flexShrink="0" mr={4} >
                                        Page{" "}
                                        <Text fontWeight="bold" as="span" >
                                            {page}
                                        </Text>{" "}
                                        of{" "}
                                        <Text fontWeight="bold" as="span" >
                                            {Math.ceil(blogs.total / countPerPage)}
                                        </Text>
                                    </Text>
                                    <Text flexShrink="0" > Go to </Text>{" "}
                                    <NumberInput
                                        ml={2}
                                        mr={4}
                                        w={20}
                                        min={1}
                                        max={Math.ceil(blogs.total / countPerPage)}
                                        onChange={value => {
                                            if (value <= Math.ceil(blogs.total / countPerPage)) setPage(Number(value))
                                        }}
                                        defaultValue={page}
                                        value={page}
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
                                        value={Math.ceil(blogs.total / countPerPage)}
                                        onChange={e => {
                                            setCountPerPage(e.target.value)
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
                                            onClick={() => setPage(prev => prev + 1)}
                                            isDisabled={page === Math.ceil(blogs.total / countPerPage)}
                                            icon={<MdChevronRight h={10} w={10} />}
                                        />
                                    </Tooltip>
                                    {/* <Tooltip label="Last Page" >
                                    <IconButton
                                        onClick={() => setPage(Math.ceil(blogs.total / countPerPage))}
                                        isDisabled={page === Math.ceil(blogs.total / countPerPage)}
                                        icon={<MdArrowRight h={10} w={10} />}
                                        ml={4}
                                    />
                                </Tooltip> */}
                                </Flex>
                            </Flex>
                        }
                    </Box>
                </Flex>
            </Card >
        </>
    )
};
