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
import { createSponsor, updateSponsor } from '../requests/use-request';
import { APP_URL } from '../../../../variables/statics';

export default function SponsorForm({ sponsor, setOpenedPage }) {
    const queryClient = useQueryClient();
    const toast = useToast();
    const textColor = useColorModeValue("navy.400", "white");
    const bgColor = useColorModeValue('white', 'navy.800')
    const brandStars = useColorModeValue("brand.500", "brand.400");

    const {
        id,
        name,
        description,
        link,
        logo_url,
        banner,
        featured
    } = sponsor;

    const [form, setForm] = useState({
        id,
        name,
        description,
        link,
        logo_url,
        banner,
        logo_file: null,
        banner_file: null,
        featured
    })

    const createSponsorMutation = useMutation(createSponsor, {
        onSuccess: () => {
            queryClient.invalidateQueries('sponsors');
            setOpenedPage(0)
            toast({
                title: "Create new sponsor successfully",
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        },
        onError: ({ errors }) => {
            toast({
                title: "Failed to create sponsor",
                description: errors,
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const updateSponsorMutation = useMutation(updateSponsor, {
        onSuccess: () => {
            queryClient.invalidateQueries('sponsors');
            setOpenedPage(0)
            toast({
                title: "Update sponsor successfully",
                position: 'top-right',
                status: "success",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        },
        onError: ({ errors }) => {
            toast({
                title: "Failed to update sponsor successfully",
                description: errors,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const handleSponsor = () => {
        const formData = new FormData();
        formData.append('id', form.id);
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('link', form.link);
        formData.append('featured', form.featured);
        if (form.logo_file) formData.append('logo_file', form.logo_file);
        if (form.banner_file) formData.append('banner_file', form.banner_file);
        if (!form.id) createSponsorMutation.mutate({ sponsor: formData });
        else updateSponsorMutation.mutate({ id: sponsor.id, sponsor: formData });
    }

    const handleChangeForm = (e) => {
        setForm(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    useEffect(() => {
        setForm(prevState => ({
            ...prevState, id,
            name,
            description,
            logo_url,
            banner,
            featured
        }));
    }, [sponsor])

    const [imagePreview, setImagePreview] = useState({
        logo_file: APP_URL + 'storage/' + logo_url,
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

    const logoFileRef = useRef(null);
    const bannerFileRef = useRef(null);

    useEffect(() => {

    }, [])

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!sponsor.id ? "Create" : "Update"} Sponsor</Text>
            <FormControl>
                <CustomInput title="Sponsor name" name="name" value={form.name} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <FormLabel
                    display='flex'
                    ms='4px'
                    fontSize='sm'
                    fontWeight='500'
                    color={textColor}
                    mb='8px'
                >
                    Description<Text color={brandStars}>*</Text>
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
                    name="description"
                    value={form.description}
                    onChange={handleChangeForm}
                />
                <CustomInput title="Website Link" name="link" value={form.link} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <FormLabel
                    display='flex'
                    ms='4px'
                    fontSize='sm'
                    fontWeight='500'
                    color={textColor}
                    mb='8px'
                >
                    Logo File<Text color={brandStars}>*</Text>
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
                    as="label"
                    mb='24px'
                >
                    <Box display="flex" alignItems="center" onClick={() => logoFileRef.current.click()}>
                        <Icon as={MdUploadFile} mr={2} />
                        <Text>{form.logo_file ? 'Choose other file' : 'Choose a file...'}</Text>
                    </Box>
                    {imagePreview.logo_file && (
                        <Box mt={4}>
                            <Image src={imagePreview.logo_file} alt="Image Preview" boxSize="200px" objectFit="cover" />
                        </Box>
                    )}
                    <Input
                        ref={logoFileRef}
                        type="file"
                        display="none"
                        accept='image/*'
                        name='logo_file'
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
                    as="label"
                >
                    <Box display="flex" alignItems="center" onClick={() => bannerFileRef.current.click()}>
                        <Icon as={MdUploadFile} mr={2} />
                        <Text>{form.banner_file ? 'Choose other file' : 'Choose a file...'}</Text>
                    </Box>
                    {imagePreview.banner_file && (
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
                        fontSize='sm'
                        fontWeight='500'
                        color={textColor}
                    >
                        Featured
                    </FormLabel>
                    <Switch
                        size={'lg'}
                        colorScheme={"brand"}
                        isChecked={form.featured === 1}
                        onChange={() => {
                            setForm(prevState => ({
                                ...prevState,
                                featured: 1 - form.featured
                            }))
                        }}
                    />
                </FormControl>

            </FormControl>
            <Button variant={"brand"} mt={3} mr={3} onClick={handleSponsor}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}

const CustomInput = ({ type = 'text', title, name, value, handleChangeForm, textColor, brandStars }) => {
    return (
        <>
            <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'
            >
                {title}<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type={type}
                placeholder=''
                mb='24px'
                fontWeight='500'
                size='lg'
                borderColor={"gray"}
                name={name}
                value={value}
                onChange={handleChangeForm}
            />
        </>
    )
}