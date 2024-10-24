import React, { useState, useEffect, useRef } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Box,
    Textarea,
    Icon,
    Image,
    Switch,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'
import { MdUploadFile } from 'react-icons/md';
import { useQueryClient, useMutation } from 'react-query';
import { createFeaturedProduct, updateFeaturedProduct } from '../requests/use-request';
import { APP_URL } from '../../../../../../variables/statics';
import { CustomInput } from '../../../../../../components/form/CustomInput';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromHTML, convertToRaw, EditorState, Modifier, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

export default function FeaturedProductForm({ featuredProduct, setOpenedPage }) {
    const queryClient = useQueryClient();
    const toast = useToast();
    const textColor = useColorModeValue("navy.400", "white");
    const bgColor = useColorModeValue('white', 'navy.800')
    const brandStars = useColorModeValue("brand.500", "brand.400");

    const {
        id,
        title,
        content,
        link,
        banner,
        published,
    } = featuredProduct;

    const [form, setForm] = useState({
        id,
        title,
        content,
        link,
        banner,
        published,
        banner_file: null,
    })

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onEditorStateChange = function (editorState) {
        setEditorState(editorState);
        setForm((prevState) => (
            { ...prevState, content: draftToHtml(convertToRaw(editorState.getCurrentContent())) }
        ))
    };

    const createFeaturedProductMutation = useMutation(createFeaturedProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('featured_products');
            setOpenedPage(0)
            toast({
                title: "Create new featured product successfully",
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
                title: "Failed to create featured product",
                description: key,
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const updateFeaturedProductMutation = useMutation(updateFeaturedProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('featured_products');
            setOpenedPage(0)
            toast({
                title: "Update featured product successfully",
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
                title: "Failed to update featured product successfully",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const handleFeaturedProduct = () => {
        const formData = new FormData();
        formData.append('id', form.id);
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('link', form.link);
        formData.append('banner', banner);
        formData.append('published', form.published);
        if (form.banner_file) formData.append('banner_file', form.banner_file);
        if (!form.id) createFeaturedProductMutation.mutate({ featuredProduct: formData });
        else updateFeaturedProductMutation.mutate({ id: featuredProduct.id, featuredProduct: formData });
    }

    const handleChangeForm = (e) => {
        setForm(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    const handlePastedText = (text, html, editorState) => {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        const newContentState = Modifier.insertText(contentState, selection, text);

        const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
        setEditorState(newEditorState);

        return true;
    };

    useEffect(() => {
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        const contentWithColor = Modifier.applyInlineStyle(
            currentContent,
            selection,
            'COLOR_' + textColor
        );
        const newEditorState = EditorState.push(editorState, contentWithColor, 'change-inline-style');
        setEditorState(newEditorState);

    }, [textColor, editorState]);

    useEffect(() => {
        setForm(prevState => ({
            ...prevState,
            id,
            title,
            content,
            link,
            banner,
            published
        }));
    }, [featuredProduct])

    useEffect(() => {
        if (content) {
            const blocksFromHTML = convertFromHTML(content);
            const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [content])

    const [imagePreview, setImagePreview] = useState({
        banner_file: APP_URL + 'storage/' + banner
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setForm(prevState => ({
            ...prevState,
            [event.target.name]: file
        }))
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(prevState => ({ ...prevState, [event.target.name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const bannerFileRef = useRef(null);

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!featuredProduct.id ? "Create" : "Update"} Featured Product</Text>
            <FormControl>
                <CustomInput title="Title" name="title" value={form.title} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <FormControl mb={"24px"}>
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
                    <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        editorStyle={{ color: textColor, minHeight: 300 }}
                        toolbarStyle={{ backgroundColor: 'white', color: 'black' }}
                        onEditorStateChange={onEditorStateChange}
                        handlePastedText={handlePastedText}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'history'],
                            inline: { inDropdown: false },
                            blockType: { inDropdown: true },
                            fontSize: { inDropdown: true },
                            list: { inDropdown: false },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: false },
                            history: { inDropdown: false },
                            // Remove image and embed
                            image: { visible: false },
                            embed: { visible: false }
                        }}
                    />
                </FormControl>
                <CustomInput title="Website Link" name="link" value={form.link} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <FormLabel
                    display='flex'
                    ms='4px'
                    fontSize='sm'
                    fontWeight='500'
                    color={textColor}
                    mb='8px'
                >
                    Banner File<Text color={brandStars}>*</Text>
                </FormLabel>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={4}
                    mb={"24px"}
                    border="2px dashed"
                    borderColor="grey"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ borderColor: 'gray.400' }}
                >
                    <Box display="flex" alignItems="center" onClick={() => bannerFileRef.current.click()}>
                        <Icon as={MdUploadFile} mr={2} />
                        <Text>{form.banner_file ? 'Choose other file' : 'Choose a file...'}</Text>
                    </Box>
                    {(form.banner || form.banner_file) && (
                        <Box mt={4}>
                            <Image src={imagePreview.banner_file} alt="Image Preview" boxSize="200px" objectFit="cover" />
                        </Box>
                    )}
                    <Input
                        ref={bannerFileRef}
                        type="file"
                        display="none"
                        accept='image/*'
                        name='banner_file'
                        onChange={handleFileChange}
                    />
                </Box>
                <FormControl display='flex' alignItems='center' mb={'24px'}>
                    <FormLabel
                        display='flex'
                        ms='4px'
                        mb={0}
                        fontSize='sm'
                        fontWeight='500'
                        color={textColor}
                    >
                        Published
                    </FormLabel>
                    <Switch
                        size={'lg'}
                        colorScheme={"brand"}
                        isChecked={form.published === 1}
                        onChange={() => {
                            setForm(prevState => ({
                                ...prevState,
                                published: 1 - form.published
                            }))
                        }}
                    />
                </FormControl>

            </FormControl>
            <Button variant={"brand"} mt={3} mr={3} onClick={handleFeaturedProduct}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}