import React, { useState, useEffect, useRef } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Box,
    Icon,
    Image as ChakraImage,
    Spinner,
    Textarea,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'
import { MdUploadFile, MdClose } from 'react-icons/md';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { createBlog, getCategories, getTags, updateBlog } from '../requests/use-request';
import { CustomMultiSelect } from '../../../../../../../../components/form/CustomMultiSelect';
import { CustomInput } from '../../../../../../../../components/form/CustomInput';
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
import { APP_URL } from '../../../../../../../../variables/statics';

export default function BlogForm({ blog, setOpenedPage }) {
    const queryClient = useQueryClient();
    const toast = useToast();
    const textColor = useColorModeValue("grey", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const bgColor = useColorModeValue('white', 'navy.800')

    const { data: bCategories, isLoadingCategories } = useQuery('bcategories', getCategories);
    const { data: bTags, isLoadingTags } = useQuery('tags', getTags);

    const featuredImagesRef = useRef(null);

    const {
        id,
        title,
        description,
        content,
        tags,
        categories,
        featured_images,
        meta_title,
        meta_description,
        og_graph_image,
        twitter_graph_image
    } = blog;

    const [form, setForm] = useState({
        id,
        title,
        description,
        content,
        tags,
        categories,
        featured_files: [],
        featured_images: featured_images.map(image => (APP_URL + 'storage/' + image.url)),
        meta_title,
        meta_description,
        og_graph_image,
        twitter_graph_image,
        og_graph_file: null,
        twitter_graph_file: null,
    })

    const createBlogMutation = useMutation(createBlog, {
        onSuccess: () => {
            queryClient.invalidateQueries('blogs');
            setOpenedPage(0)
            toast({
                title: "Create new Blog successfully",
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        },
        onError: (error) => {
            const errors = error.response.data.errors ? error.response.data.errors : { error: error.response.data.error };
            const key = errors[Object.keys(errors)[0]]
            toast({
                title: "Failed to create Blog",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const updateBlogMutation = useMutation(updateBlog, {
        onSuccess: () => {
            queryClient.invalidateQueries('blogs');
            setOpenedPage(0)
            toast({
                title: "Update Blog successfully",
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
                title: "Failed to update Blog",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const handleBlog = () => {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('content', form.content);
        formData.append('categories', form.categories);
        formData.append('tags', form.tags);
        formData.append('meta_title', form.meta_title);
        formData.append('meta_description', form.meta_description);
        if (form.twitter_graph_image) formData.append('twitter_graph_image', form.twitter_graph_image);
        if (form.og_graph_image) formData.append('og_graph_image', form.og_graph_image);
        if (form.og_graph_file) formData.append('og_graph_file', form.og_graph_file);
        if (form.twitter_graph_file) formData.append('twitter_graph_file', form.twitter_graph_file);
        form.featured_files.forEach(file => {
            formData.append('featured_files[]', file); // Use [] to indicate multiple files
        });
        if (!form.id) {
            createBlogMutation.mutate({ blog: formData });
        }
        else {
            if (form.featured_images.length > 0)
                formData.append('featured_images[]', form.featured_images);
            if (removedImages.length > 0)
                formData.append('removed_images[]', removedImages);
            updateBlogMutation.mutate({ id: form.id, blog: formData });
        }
    }

    const handleChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            id,
            title,
            content,
            description,
            tags,
            categories,
            featured_files: [],
            featured_images: featured_images.map(image => (APP_URL + 'storage/' + image.url)),
            meta_title,
            meta_description,
            og_graph_image,
            twitter_graph_image
        }));
        setImagePreview(prev => ({
            ...prev,
            og_graph_file: APP_URL + 'storage/' + og_graph_image,
            twitter_graph_file: APP_URL + 'storage/' + twitter_graph_image
        }))
    }, [blog])

    const handleChangeMultiSelect = (name, value) => {
        setForm({ ...form, [name]: value })
    }

    const [imagePreview, setImagePreview] = useState({
        featured_file: [],
        og_graph_file: APP_URL + 'storage/' + og_graph_image,
        twitter_graph_file: APP_URL + 'storage/' + twitter_graph_image
    });

    const handleSingleFileChange = (event) => {
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

    const ogGraphFileRef = useRef(null);
    const twitterGraphFileRef = useRef(null);

    const [removedImages, setRemovedImages] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newPreviews = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === files.length) {
                    setImagePreview(prev => ({ ...prev, featured_file: [...prev.featured_file, ...newPreviews] }));
                }
            };
            reader.readAsDataURL(file);

        })
        setForm(prevState => ({
            ...prevState,
            [event.target.name]: [...(prevState[event.target.name] || []), ...files]
        }))
    };

    const handleRemoveNewImage = (index) => {
        setImagePreview(prev => ({ ...prev, featured_file: prev.featured_file.filter((_, i) => i !== index) }));
        setForm(prevState => ({
            ...prevState,
            featured_files: prevState.featured_images.filter((_, i) => i !== index)
        }))
    }

    const handleRemoveExistingImage = (index) => {
        setForm(prev => ({ ...prev, featured_images: prev.featured_images.filter((_, i) => i !== index) }));
        setRemovedImages(prev => [...prev, featured_images[index].id]);
    }

    if (isLoadingCategories || isLoadingTags || !bCategories || !bTags) {
        return <Spinner />
    }

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!blog.id ? "Create" : "Update"} Blog</Text>
            <FormControl>
                <CustomInput title="Title" name="title" value={form.title} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
            </FormControl>
            <FormControl mb={'24px'}>
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
                        setForm(prev => ({ ...prev, content: data }))
                    }}
                />
            </FormControl>
            <FormControl>
                <CustomMultiSelect title={"Categories"} name={"categories"} value={form.categories} handleChangeMultiSelect={handleChangeMultiSelect} brandStars={brandStars} options={isLoadingCategories || !bCategories ? [] : bCategories.map(category => ({ id: category.id, value: category.name, label: category.name }))} />
                <CustomMultiSelect title={"Tags"} name={"tags"} value={form.tags} handleChangeMultiSelect={handleChangeMultiSelect} brandStars={brandStars} options={isLoadingTags || !bTags ? [] : bTags.map(tag => ({ id: tag.id, value: tag.name, label: tag.name }))} />
            </FormControl>
            <FormControl mb={'24px'}>
                <FormLabel
                    display='flex'
                    ms='4px'
                    fontSize='sm'
                    fontWeight='500'
                    color={textColor}
                    mb='8px'
                >
                    Featured Images<Text color={brandStars}>*</Text>
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
                    _hover={{ borderColor: 'gray.400' }}
                >
                    <Box display="flex" alignItems="center">
                        <Icon as={MdUploadFile} mr={2} />
                        <Text cursor={'pointer'} onClick={() => featuredImagesRef.current.click()}>{form.featured_images && form.featured_images.length > 0 ? 'Choose more files' : 'Choose a file...'}</Text>
                    </Box>

                    <Box mt={4} display="flex" flexWrap="wrap">
                        {form.featured_images && form.featured_images.length > 0 && form.featured_images.map((image, index) => (
                            <Box key={index} position="relative" mr={2} mb={2}>
                                <ChakraImage src={image} alt={`Existing Image ${index}`} boxSize="100px" objectFit="cover" />
                                <Icon
                                    as={MdClose}
                                    position="absolute"
                                    top="0"
                                    right="0"
                                    cursor="pointer"
                                    color={"gray.100"}
                                    backgroundColor={"gray.800"}
                                    borderRadius={"50%"}
                                    onClick={() => handleRemoveExistingImage(index)}
                                />
                            </Box>
                        ))}
                        {imagePreview.featured_file && imagePreview.featured_file.length > 0 && imagePreview.featured_file.map((image, index) => (
                            <Box key={index} position="relative" mr={2} mb={2}>
                                <ChakraImage src={image} alt={`New Image Preview ${index}`} boxSize="100px" objectFit="cover" />
                                <Icon
                                    as={MdClose}
                                    position="absolute"
                                    top="0"
                                    right="0"
                                    cursor="pointer"
                                    backgroundColor={"gray.800"}
                                    color={'gray.100'}
                                    borderRadius={"50%"}
                                    onClick={() => handleRemoveNewImage(index)}
                                />
                            </Box>
                        ))}
                    </Box>

                    <Input
                        ref={featuredImagesRef}
                        type="file"
                        display="none"
                        multiple
                        accept='image/*'
                        name='featured_files'
                        onChange={handleFileChange}
                    />
                </Box>
            </FormControl>
            <CustomInput title="Meta title" name="meta_title" value={form.meta_title} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
            <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'
            >
                Meta description<Text color={brandStars}>*</Text>
            </FormLabel>
            <Textarea
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                placeholder=''
                mb='24px'
                fontWeight='500'
                size='lg'
                bgColor={bgColor}
                border={'1px'}
                borderColor={"grey"}
                borderRadius={'16px'}
                name="meta_description"
                value={form.meta_description}
                onChange={handleChangeForm}
            />
            <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'
            >
                Og Graph Image <Text color={brandStars}>*</Text>
            </FormLabel>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={4}
                border="2px dashed"
                borderColor="grey"
                borderRadius="md"
                cursor="pointer"
                _hover={{ borderColor: 'gray.400' }}
                mb='24px'
            >
                <Box display="flex" alignItems="center" onClick={() => ogGraphFileRef.current.click()}>
                    <Icon as={MdUploadFile} mr={2} />
                    <Text>{form.og_graph_file ? 'Choose other file' : 'Choose a file...'}</Text>
                </Box>
                {(form.og_graph_file || form.og_graph_image) && (
                    <Box mt={4}>
                        <ChakraImage src={imagePreview.og_graph_file} alt="Image Preview" boxSize="200px" objectFit="cover" />
                    </Box>
                )}
                <Input
                    ref={ogGraphFileRef}
                    type="file"
                    display="none"
                    accept='image/*'
                    name='og_graph_file'
                    onChange={handleSingleFileChange}
                />
            </Box>
            <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'
            >
                Twitter Graph Image<Text color={brandStars}>*</Text>
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
                <Box display="flex" alignItems="center" onClick={() => twitterGraphFileRef.current.click()}>
                    <Icon as={MdUploadFile} mr={2} />
                    <Text>{form.twitter_graph_file ? 'Choose other file' : 'Choose a file...'}</Text>
                </Box>
                {(form.twitter_graph_file || form.twitter_graph_image) && (
                    <Box mt={4}>
                        <ChakraImage src={imagePreview.twitter_graph_file} alt="Image Preview" boxSize="200px" objectFit="cover" />
                    </Box>
                )}
                <Input
                    ref={twitterGraphFileRef}
                    type="file"
                    display="none"
                    accept='image/*'
                    name='twitter_graph_file'
                    onChange={handleSingleFileChange}
                />
            </Box>
            <Button variant={"brand"} mt={3} mr={3} onClick={handleBlog}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}
