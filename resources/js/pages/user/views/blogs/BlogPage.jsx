import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Box,
    Avatar,
    Text as ChakraText,
    Flex,
    Breadcrumb,
    BreadcrumbItem,
    Image as ChakraImage,
    Tag,
    IconButton,
    useColorModeValue
} from '@chakra-ui/react';
import Card from "../../../../components/card/Card";
import { getBlog } from '../../../admin/views/admin/blog/components/blogs/requests/use-request';
import { useQuery } from 'react-query';
import { Link as ReactLink, useParams } from 'react-router-dom';
import moment from 'moment';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Autoformat,
    BlockQuote,
    Bold,
    CloudServices,
    Code,
    CodeBlock,
    Heading,
    HorizontalLine,
    Image,
    ImageToolbar,
    ImageUpload,
    Base64UploadAdapter,
    Italic,
    Link,
    List,
    Markdown,
    Mention,
    Paragraph,
    MediaEmbed,
    SourceEditing,
    Strikethrough,
    Table,
    TableToolbar,
    TextTransformation,
    TodoList,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css';
import { Helmet } from 'react-helmet';
import { APP_URL } from '../../../../variables/statics';
import { UserContext } from '../../../../contexts/UserContext';
import { MdEdit } from 'react-icons/md';
import BlogForm from '../../../admin/views/admin/blog/components/blogs/components/BlogForm';

export default () => {
    const { id } = useParams();
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'white');
    const editorBgColor = useColorModeValue('#f9f9f9', '#1a202c');

    const { user } = useContext(UserContext);

    const [editing, setEditing] = useState(false)
    const { data: blog, isLoadingBlog } = useQuery(['blog', id, editing], () => getBlog(id), {
        enabled: !!id,
        staleTime: 300000
    });

    const editorRef = useRef();

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setData(blog?.content || '');
        }
    }, [blog, id]);

    return (
        <>
            {blog && (
                <Helmet>
                    <title>DBMS Ranking AI | Blog | {blog.title}</title>
                    <meta name="description" content={blog.meta_description} />

                    <meta property="og:title" content={blog.meta_title} />
                    <meta property="og:description" content={blog.meta_description} />
                    <meta property="og:image" content={`${APP_URL}storage/${blog.og_graph_image}`} />
                    <meta property="og:url" content={window.location.href} />

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={blog.meta_title} />
                    <meta name="twitter:description" content={blog.meta_description} />
                    <meta name="twitter:image" content={`${APP_URL}storage/${blog.twitter_graph_image}`} />
                </Helmet>
            )}
            <Card
                w="100%"
                px="0px"
                minH="calc(100vh - 150px)"
            >
                <Box width={'100%'} px="25px">
                    <Breadcrumb>
                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <ReactLink to='/'>
                                Home
                            </ReactLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <ReactLink to='/blog'>
                                Blog
                            </ReactLink>
                        </BreadcrumbItem>
                        {blog && (
                            <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                                <ChakraText>{blog.title}</ChakraText>
                            </BreadcrumbItem>
                        )}
                    </Breadcrumb>
                    {blog ?
                        editing ? <BlogForm blog={{ ...blog, tags: blog.tags.map(tag => tag.id), categories: blog.categories.map(category => category.id) }} setOpenedPage={setEditing} /> :
                            <Box p={"20px"}>
                                <ChakraImage
                                    mb={5}
                                    w="100%"
                                    h={'300px'}
                                    borderRadius="xl"
                                    objectFit="cover"
                                    objectPosition="center"
                                    src={`../../storage/${blog.featured_images[0].url}?w=1400&auto=compression,format`}
                                    alt={blog.title}
                                />
                                <ChakraText mb={"32px"} fontSize={30} fontWeight={700}>
                                    {blog.title}
                                    {(user && user.author && user.id === blog.user_id && !editing) ? (
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            colorScheme="blue"
                                            variant="outline"
                                            isRound
                                            size="md"
                                            ml={2}
                                            onClick={() => setEditing(true)}
                                        />
                                    ) : <></>}
                                </ChakraText>
                                <Box>
                                    <Flex direction={{ base: "column", md: "row" }} justify="space-between" alignItems={'center'} mb={4} gap={2}>
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
                                            By <ChakraText color="blue.500" _dark={{ color: "green.200" }}>{` ${blog.user.name} ${blog.user.surname ? blog.user.surname : ''}`}</ChakraText> on {moment(blog.created_at).format('MMM D, YYYY')}
                                        </Flex>
                                        <Flex
                                            justify={'start'}
                                            gap={1}
                                        >
                                            {blog.tags &&
                                                blog.tags.slice(0, 2).map((category) => (
                                                    <Tag key={category.name} color="white" bgColor="blue.500" _dark={{ bgColor: "green.500" }}>{category.name}</Tag>
                                                ))}
                                            {blog.tags.length > 2 && <ChakraText>{`+${blog.tags.length - 2}`} more</ChakraText>}
                                        </Flex>
                                    </Flex>
                                </Box>
                                <CKEditor
                                    editor={ClassicEditor}
                                    config={{
                                        plugins: [
                                            ClassicEditor,
                                            Essentials,
                                            Autoformat,
                                            BlockQuote,
                                            Bold,
                                            CloudServices,
                                            Code,
                                            CodeBlock,
                                            Heading,
                                            HorizontalLine,
                                            Image,
                                            ImageToolbar,
                                            ImageUpload,
                                            Base64UploadAdapter,
                                            Italic,
                                            Link,
                                            List,
                                            Markdown,
                                            Mention,
                                            Paragraph,
                                            MediaEmbed,
                                            SourceEditing,
                                            Strikethrough,
                                            Table,
                                            TableToolbar,
                                            TextTransformation,
                                            TodoList,
                                            ImageCaption,
                                            ImageInsert,
                                            ImageResize,
                                            ImageStyle,
                                        ],
                                        uiColor: editorBgColor,
                                        toolbar: [],
                                        editorConfig: {
                                            language: 'en',
                                            styles: {
                                                body: {
                                                    'background-color': editorBgColor,
                                                    color: textColor,
                                                },
                                            },
                                        },
                                        isReadOnly: true,
                                        initialData: blog.content
                                    }}
                                    disabled={true}
                                    onReady={editor => {
                                        editorRef.current = editor;
                                    }}
                                />
                            </Box> : <></>
                    }
                </Box>
            </Card >
        </>
    )
};
