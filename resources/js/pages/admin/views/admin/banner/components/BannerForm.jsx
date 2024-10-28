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
    Select,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'
import { MdUploadFile } from 'react-icons/md';
import { useQueryClient, useMutation } from 'react-query';
import { createBanner, updateBanner } from '../requests/use-request';
import { APP_URL } from '../../../../../../variables/statics';
import { CustomInput } from '../../../../../../components/form/CustomInput';

export default function BannerForm({ banner, setOpenedPage }) {
    const queryClient = useQueryClient();
    const toast = useToast();
    const textColor = useColorModeValue("navy.400", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");

    const {
        id,
        link,
        url,
        type
    } = banner;

    const [form, setForm] = useState({
        id,
        link,
        url,
        file: null,
        type
    })

    const createBannerMutation = useMutation(createBanner, {
        onSuccess: () => {
            queryClient.invalidateQueries('banners');
            setOpenedPage(0)
            toast({
                title: "Create new banner successfully",
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
                title: "Failed to create banner",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const updateBannerMutation = useMutation(updateBanner, {
        onSuccess: () => {
            queryClient.invalidateQueries('banners');
            setOpenedPage(0)
            toast({
                title: "Update banner successfully",
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
                title: "Failed to update banner successfully",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const handleBanner = () => {
        const formData = new FormData();
        formData.append('id', form.id);
        formData.append('link', form.link);
        formData.append('url', form.url);
        formData.append('type', form.type);
        if (form.file) formData.append('file', form.file);
        if (!form.id) createBannerMutation.mutate({ banner: formData });
        else updateBannerMutation.mutate({ id: banner.id, banner: formData });
    }

    const handleChangeForm = (e) => {
        setForm(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    useEffect(() => {
        setForm(prevState => ({
            ...prevState,
            id,
            link,
            url,
            type
        }));
    }, [banner])

    const [imagePreview, setImagePreview] = useState({
        file: APP_URL + 'storage/' + url,
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

    const fileRef = useRef(null);

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!banner.id ? "Create" : "Update"} Banner</Text>
            <FormControl>
                <CustomInput title="Banner Link" name="link" value={form.link} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <FormLabel
                    display='flex'
                    ms='4px'
                    fontSize='sm'
                    fontWeight='500'
                    color={textColor}
                    mb='8px'
                >
                    Image<Text color={brandStars}>*</Text>
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
                    <Box display="flex" alignItems="center" onClick={() => fileRef.current.click()}>
                        <Icon as={MdUploadFile} mr={2} />
                        <Text>{form.file ? 'Choose other file' : 'Choose a file...'}</Text>
                    </Box>
                    {(form.url || form.file) && (
                        <Box mt={4} width={'80%'} display="flex" justifyContent={'right'}>
                            <Image src={imagePreview.file} alt="Image Preview" width={'80%'} height="100px" objectFit="cover" />
                        </Box>
                    )}
                    <Input
                        ref={fileRef}
                        type="file"
                        display="none"
                        accept='image/*'
                        name='file'
                        onChange={handleFileChange}
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
                    Type<Text color={brandStars}>*</Text>
                </FormLabel>
                <Select
                    placeholder='Select option'
                    variant='auth'
                    fontSize='sm'
                    ms={{ base: "0px", md: "0px" }}
                    type='text'
                    mb='24px'
                    fontWeight='500'
                    size='lg'
                    borderColor={"gray"}
                    value={form.type}
                    name={'type'}
                    onChange={handleChangeForm}
                >
                    <option value={0}>Top</option>
                    <option value={1}>Bottom</option>
                </Select>

            </FormControl>
            <Button variant={"brand"} mt={3} mr={3} onClick={handleBanner}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}