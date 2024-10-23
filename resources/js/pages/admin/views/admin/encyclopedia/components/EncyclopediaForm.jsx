import React, { useState, useEffect } from 'react'
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
import { createEncyclopedia, updateEncyclopedia } from '../requests/use-request';;
import { CustomInput } from '../../../../../../components/form/CustomInput';
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

    const {
        id,
        title,
        content
    } = encyclopedia;

    const [form, setForm] = useState({
        id,
        title,
        content
    })

    const createEncyclopediaMutation = useMutation(createEncyclopedia, {
        onSuccess: () => {
            queryClient.invalidateQueries('encyclopedias');
            setOpenedPage(0)
            toast({
                title: "Create new Encyclopedia successfully",
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
                title: "Failed to create Encyclopedia",
                description: key,
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const updateEncyclopediaMutation = useMutation(updateEncyclopedia, {
        onSuccess: () => {
            queryClient.invalidateQueries('encyclopedias');
            setOpenedPage(0)
            toast({
                title: "Update Encyclopedia successfully",
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
                title: "Failed to update Encyclopedia successfully",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const handleEncyclopedia = () => {
        if (!form.id) createEncyclopediaMutation.mutate({ encyclopedia: form });
        else updateEncyclopediaMutation.mutate({ encyclopedia: form });
    }

    const handleChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        setForm({
            id,
            title,
            content
        });
    }, [encyclopedia])

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!encyclopedia.id ? "Create" : "Update"} Encyclopedia</Text>
            <FormControl>
                <CustomInput title="Encyclopedia Title" name="title" value={form.title} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
            </FormControl>
            <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'
            >
                Content<Text color={brandStars}>*</Text>
            </FormLabel>
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
                    toolbar: [
                        'undo',
                        'redo',
                        '|',
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'strikethrough',
                        'code',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'todoList',
                        '|',
                        'link',
                        'uploadImage',
                        'mediaEmbed',
                        'insertTable',
                        'blockQuote',
                        'codeBlock',
                        'horizontalLine',
                    ],
                    image: {
                        resizeOptions: [
                            {
                                name: 'resizeImage:original',
                                label: 'Default image width',
                                value: null,
                            },
                            {
                                name: 'resizeImage:50',
                                label: '50% page width',
                                value: '50',
                            },
                            {
                                name: 'resizeImage:75',
                                label: '75% page width',
                                value: '75',
                            },
                        ],
                        toolbar: [
                            'imageTextAlternative',
                            'toggleImageCaption',
                            '|',
                            'imageStyle:inline',
                            'imageStyle:wrapText',
                            'imageStyle:breakText',
                            '|',
                            'resizeImage',
                        ],
                        insert: {
                            integrations: ['url'],
                        },
                    },
                }}
                data={form.content}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setForm(prev => ({...prev, content: data}))
                }}
            />
            
            <Button variant={"brand"} mt={3} mr={3} onClick={handleEncyclopedia}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}
