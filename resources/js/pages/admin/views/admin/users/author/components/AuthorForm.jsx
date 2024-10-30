import React, { useState, useEffect } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Text,
    Box,
    Switch,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'
import { useQueryClient, useMutation } from 'react-query';
import { createAuthor, updateAuthor } from '../requests/use-request';
import { CustomInput } from '../../../../../../../components/form/CustomInput';

export default function AuthorForm({ author, setOpenedPage }) {
    const queryClient = useQueryClient();
    const toast = useToast();
    const textColor = useColorModeValue("navy.400", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");

    const {
        id,
        name,
        surname,
        email,
        phone_number,
        job_title,
        company,
        approved,
        userRoleId
    } = author;

    const [form, setForm] = useState({
        id,
        name,
        surname,
        email,
        phone_number,
        job_title,
        company,
        password: '',
        approved,
        userRoleId
    })

    const createAuthorMutation = useMutation(createAuthor, {
        onSuccess: () => {
            queryClient.invalidateQueries('authors');
            setOpenedPage(0)
            toast({
                title: "Create new author successfully",
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
                title: "Failed to create author",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const updateAuthorMutation = useMutation(updateAuthor, {
        onSuccess: () => {
            queryClient.invalidateQueries('authors');
            setOpenedPage(0)
            toast({
                title: "Update author successfully",
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
                title: "Failed to update author",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const handleAuthor = () => {
        if (!form.id) createAuthorMutation.mutate({ author: form });
        else updateAuthorMutation.mutate({ author: form });
    }

    const handleChangeForm = (e) => {
        setForm(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    useEffect(() => {
        setForm(prevState => ({
            ...prevState,
            id,
            name,
            surname,
            email,
            phone_number,
            job_title,
            company,
            approved,
            userRoleId
        }));
    }, [author])

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!author.id ? "Create" : "Update"} Author</Text>
            <FormControl>
                <CustomInput title="Name" name="name" value={form.name} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Surname" name="surname" value={form.surname} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Email" name="email" type="email" value={form.email} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Phone Number" name="phone_number" value={form.phone_number} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Job Title" name="job_title" value={form.job_title} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Company" name="company" value={form.company} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                {!author.id && <CustomInput title="Password" name="password" type="password" value={form.password} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />}
                <FormControl display='flex' alignItems='center' mb={'24px'}>
                    <FormLabel
                        display='flex'
                        ms='4px'
                        mb={0}
                        fontSize='sm'
                        fontWeight='500'
                        color={textColor}
                    >
                        Approved
                    </FormLabel>
                    <Switch
                        size={'lg'}
                        colorScheme={"brand"}
                        isChecked={form.approved === 1}
                        onChange={() => {
                            setForm(prevState => ({
                                ...prevState,
                                approved: 1 - form.approved
                            }))
                        }}
                    />
                </FormControl>
            </FormControl>
            <Button variant={"brand"} mt={3} mr={3} onClick={handleAuthor}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}