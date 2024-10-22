import React, { useState, useEffect, useRef } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Box,
    Icon,
    Image,
    Spinner,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'
import { MdUploadFile, MdClose } from 'react-icons/md';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { createBlog, getCategories, getTags, updateBlog } from '../requests/use-request';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromHTML, convertToRaw, EditorState, Modifier, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { CustomMultiSelect } from '../../../../../../../../components/form/CustomMultiSelect';
import { CustomInput } from '../../../../../../../../components/form/CustomInput';

export default function BlogForm({ blog, setOpenedPage }) {
    const queryClient = useQueryClient();
    const toast = useToast();
    const textColor = useColorModeValue("grey", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");

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
        featured_images
    } = blog;

    const [form, setForm] = useState({
        id,
        title,
        description,
        content,
        tags,
        categories,
        featured_files: [],
        featured_images,
    })

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onEditorStateChange = function (editorState) {
        setEditorState(editorState);
        setForm((prevState) => (
            { ...prevState, content: draftToHtml(convertToRaw(editorState.getCurrentContent())) }
        ))
    };

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
            toast({
                title: "Failed to create Blog",
                description: error,
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
            const errors = error.response.data.errors ? error.response.data.errors : {error: error.response.data.error};
            const key = errors[Object.keys(errors)[0]];
            toast({
                title: "Failed to update Blog successfully",
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
        form.featured_files.forEach(file => {
            formData.append('featured_files[]', file); // Use [] to indicate multiple files
        });
        if (!form.id) {
            createBlogMutation.mutate({ blog: formData });
        }
        else {
            if (imageUrls.length > 0)
                formData.append('featured_images[]', form.featured_images);
            if (removedImages.length > 0)
                formData.append('removed_images[]', removedImages);
            updateBlogMutation.mutate({ id: form.id, blog: formData });
        }
    }

    const handleChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
        setForm({
            id,
            title,
            content,
            description,
            tags,
            categories,
            featured_files: [],
            featured_images,
        });
    }, [blog])

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

    const customContentStateConverter = (contentState) => {
        const newBlockMap = contentState.getBlockMap().map((block) => {
            const entityKey = block.getEntityAt(0);
            if (entityKey !== null) {
                const entityBlock = contentState.getEntity(entityKey);
                const entityType = entityBlock.getType();
                switch (entityType) {
                    case 'IMAGE': {
                        const newBlock = block.merge({
                            type: 'atomic',
                            text: 'img',
                        });
                        return newBlock;
                    }
                    default:
                        return block;
                }
            }
            return block;
        });
        const newContentState = contentState.set('blockMap', newBlockMap);
        return newContentState;
    }

    useEffect(() => {
        if (blog.content) {
            const blocksFromHTML = convertFromHTML(blog.content);
            const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
            setEditorState(EditorState.createWithContent(customContentStateConverter(contentState)));
        }
    }, [blog])

    const handleChangeMultiSelect = (name, value) => {
        setForm({ ...form, [name]: value })
    }

    const [imagePreview, setImagePreview] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [imageUrls, setImageUrls] = useState(form.featured_images || []);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newPreviews = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === files.length) {
                    setImagePreview(prev => [...prev, ...newPreviews]);
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
        setImagePreview(prev => prev.filter((_, i) => i !== index));
        setForm(prevState => ({
            ...prevState,
            featured_files: prevState.featured_images.filter((_, i) => i !== index)
        }))
    }

    const handleRemoveExistingImage = (index) => {
        setForm(prev => ({...prev, featured_images: prev.featured_images.filter((_, i) => i !== index)}));
        setRemovedImages(prev => [...prev, featured_images[index].id]);
    }

    const uploadImageCallback = async (file) => {
        return new Promise(async (resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('File is not an image'));
            }
            const formData = new FormData();
            formData.append('image', file);
            try {
                const response = await axios.post('/api/blog/upload-image', formData);

                resolve({
                    data: {
                        link: response.data.imageUrl
                    }
                })
            } catch (error) {
                reject(new Error('Upload failed: ' + (error.response?.data?.message || error.message)))
            }
        })
    }

    if (isLoadingCategories || isLoadingTags || !bCategories || !bTags) {
        return <Spinner />
    }

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!blog.id ? "Create" : "Update"} Blog</Text>
            <FormControl>
                <CustomInput title="Title" name="title" value={form.title} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Description" name="description" value={form.description} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
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
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    toolbarStyle={{ backgroundColor: 'white', color: 'black' }}
                    editorStyle={{ color: textColor, minHeight: 300 }}
                    onEditorStateChange={onEditorStateChange}
                    handlePastedText={handlePastedText}
                    toolbar={{
                        image: {
                            uploadCallback: uploadImageCallback,
                            previewImage: true,
                            alt: { present: true, mandatory: false },
                            uploadEnabled: false,
                            urlEnabled: true
                        }
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
                                <Image src={image} alt={`Existing Image ${index}`} boxSize="100px" objectFit="cover" />
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
                        {imagePreview && imagePreview.length > 0 && imagePreview.map((image, index) => (
                            <Box key={index} position="relative" mr={2} mb={2}>
                                <Image src={image} alt={`New Image Preview ${index}`} boxSize="100px" objectFit="cover" />
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
            <Button variant={"brand"} mt={3} mr={3} onClick={handleBlog}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}
