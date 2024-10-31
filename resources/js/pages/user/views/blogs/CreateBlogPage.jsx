import React from 'react';
import { Box, Flex, Breadcrumb, BreadcrumbItem, useColorModeValue, BreadcrumbLink } from '@chakra-ui/react';
import Card from "../../../../components/card/Card";
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { initialBlog } from '../../../admin/views/admin/blog/components/blogs';
import BlogForm from '../../../admin/views/admin/blog/components/blogs/components/BlogForm';

export default () => {

    const navigate = useNavigate();
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'white');

    return (
        <>
            <Helmet>
                <title>DB Rank AI | Create Blog</title>
            </Helmet>
            <Card
                w="100%"
                px="0px"
                minH="calc(100vh - 150px)"
            >
                <Flex justifyContent={"flex-end"}>
                    <Box width={{ base: '100%' }} px="25px">
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

                            <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                                <BreadcrumbLink to='/create-blog'>
                                    Blog
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                        <BlogForm blog={initialBlog} setOpenedPage={() => navigate('/blog')} /> 
                    </Box>
                </Flex>
            </Card >
        </>
    )
};
