import React, { useState, useEffect, useRef } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Box,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'
import { useQueryClient, useMutation } from 'react-query';
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

export default function EncyclopediaForm({ encyclopedia, setOpenedPage }) {
    const queryClient = useQueryClient();
    const toast = useToast();
    const textColor = useColorModeValue("grey", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const editorBgColor = useColorModeValue('#f9f9f9', '#1a202c'); // light/dark background
    const {
        id,
        title,
        content
    } = encyclopedia;

    const editorRef = useRef();

    useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.editor?.destroy();
            }
        };
    }, []);

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22} fontWeight={600}>{title}</Text>
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
                data={content}
                onReady={editor => {
                    editorRef.current = editor;
                }}
            />
        </Box>
    )
}
