import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import {
    Text,
    Box,
    useColorModeValue,
    Stack,
    Breadcrumb,
    BreadcrumbItem
} from '@chakra-ui/react'
import { useQuery } from 'react-query';
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
import { useNavigate, useParams, Link as ReactLink } from 'react-router-dom';
import { DBMSContext } from '../../../../contexts/DBMSContext';
import { getEncyclopedias } from '../../../admin/views/admin/encyclopedia/requests/use-request';
import { generateSlug } from '../../../../variables/statics';
import { Skeleton, SkeletonText } from '@chakra-ui/skeleton';
import Card from "../../../../components/card/Card";

export default function EncyclopediaForm() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { encyclopedias, setEncyclopedias } = useContext(DBMSContext)

    const textColor = useColorModeValue("grey", "white");
    let secondaryText = useColorModeValue('gray.700', 'white');
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const editorBgColor = useColorModeValue('#f9f9f9', '#1a202c'); // light/dark background

    const { data: _encyclopedias, isLoading } = useQuery(
        'encyclopedias',
        getEncyclopedias,
        {
            staleTime: 300000,
            enabled: encyclopedias.length === 0,
            onSuccess: (data) => {
                setEncyclopedias(data);
            }
        }
    )

    const encyclopedia = useMemo(() => encyclopedias.find(encyclopedia => generateSlug(encyclopedia.title) === slug), [encyclopedias, slug]);

    useEffect(() => {
        if (!encyclopedia && encyclopedias.length !== 0 && _encyclopedias) navigate('/not-found');
    }, [encyclopedia, navigate])

    const editorRef = useRef();

    useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.editor?.destroy();
            }
        };
    }, []);

    return (
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
                        <ReactLink to='/encyclopedia'>
                            Encyclopedia
                        </ReactLink>
                    </BreadcrumbItem>
                    {encyclopedia && (
                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <Text>{encyclopedia.title}</Text>
                        </BreadcrumbItem>
                    )}
                </Breadcrumb>
                {encyclopedia ?
                    <>
                        <Text mb={"32px"} fontSize={22} fontWeight={600}>{encyclopedia.title}</Text>
                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                plugins: [
                                    Autoformat,
                                    BlockQuote,
                                    Bold,
                                    CloudServices,
                                    Code,
                                    CodeBlock,
                                    Essentials,
                                    Heading,
                                    HorizontalLine,
                                    Image,
                                    ImageCaption,
                                    ImageInsert,
                                    ImageResize,
                                    ImageStyle,
                                    ImageToolbar,
                                    ImageUpload,
                                    MediaEmbed,
                                    Base64UploadAdapter,
                                    Italic,
                                    Link,
                                    List,
                                    Markdown,
                                    Mention,
                                    Paragraph,
                                    SourceEditing,
                                    Strikethrough,
                                    Table,
                                    TableToolbar,
                                    TextTransformation,
                                    TodoList,
                                ],
                                uiColor: editorBgColor,
                                toolbar: [],
                                isReadOnly: true,
                                editorConfig: {
                                    language: 'en',
                                    styles: {
                                        body: {
                                            'background-color': editorBgColor,
                                            color: textColor,
                                        },
                                    },
                                },
                            }}
                            disabled={true}
                            data={encyclopedia.content}
                            onReady={editor => {
                                editorRef.current = editor;
                            }}
                        />
                    </>
                    :
                    <Stack spacing={5} gap={5}>
                        <Skeleton height={'30px'} width={'full'} borderRadius={'30px'} />
                        <SkeletonText height={'30px'} width={'full'} />
                        <SkeletonText height={'30px'} width={'full'} />
                        <SkeletonText height={'30px'} width={'full'} />
                        <SkeletonText height={'30px'} width={'full'} />
                        <SkeletonText height={'30px'} width={'full'} />
                        <SkeletonText height={'30px'} width={'full'} />
                        <SkeletonText height={'30px'} width={'full'} />
                    </Stack>
                }
            </Box>
        </Card>
    )
}
