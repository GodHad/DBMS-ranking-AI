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
import { createVendor, updateVendor } from '../requests/use-request';
import { CustomInput } from '../../../../../../../components/form/CustomInput';

export default function VendorForm({ vendor, setOpenedPage }) {
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
    } = vendor;

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

    const createVendorMutation = useMutation(createVendor, {
        onSuccess: () => {
            queryClient.invalidateQueries('vendors');
            setOpenedPage(0)
            toast({
                title: "Create new vendor successfully",
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
                title: "Failed to create vendor",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const updateVendorMutation = useMutation(updateVendor, {
        onSuccess: () => {
            queryClient.invalidateQueries('vendors');
            setOpenedPage(0)
            toast({
                title: "Update vendor successfully",
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
                title: "Failed to update vendor",
                description: key,
                position: 'top-right',
                status: "error",
                insert: "top",
                duration: 5000,
                isClosable: true
            })
        }
    })

    const handleVendor = () => {
        if (!form.id) createVendorMutation.mutate({ vendor: form });
        else updateVendorMutation.mutate({ vendor: form });
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
    }, [vendor])

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!vendor.id ? "Create" : "Update"} Vendor</Text>
            <FormControl>
                <CustomInput title="Name" name="name" value={form.name} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Surname" name="surname" value={form.surname} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Email" name="email" type="email" value={form.email} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Phone Number" name="phone_number" value={form.phone_number} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Job Title" name="job_title" value={form.job_title} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Company" name="company" value={form.company} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                {!vendor.id && <CustomInput title="Password" name="password" type="password" value={form.password} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />}
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
            <Button variant={"brand"} mt={3} mr={3} onClick={handleVendor}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}