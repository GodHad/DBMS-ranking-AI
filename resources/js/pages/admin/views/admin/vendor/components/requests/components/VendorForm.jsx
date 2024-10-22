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
import { createVendor, updateVendor } from '../requests/use-request';
import { APP_URL } from '../../../../../../variables/statics';
import { CustomInput } from '../../../../../../../../components/form/CustomInput';

export default function VendorForm({ vendor, setOpenedPage }) {
    const queryClient = useQueryClient();
    const toast = useToast();
    const textColor = useColorModeValue("navy.400", "white");
    const bgColor = useColorModeValue('white', 'navy.800')
    const brandStars = useColorModeValue("brand.500", "brand.400");

    const {
        id,
        name,
        surname,
        email,
        phone_number,
        job_title,
        company,
    } = vendor;

    const [form, setForm] = useState({
        id,
        name,
        surname,
        email,
        phone_number,
        job_title,
        company,
        password: ''
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
        onError: ({ errors }) => {
            toast({
                title: "Failed to create vendor",
                description: errors,
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
        onError: ({ errors }) => {
            toast({
                title: "Failed to update vendor",
                description: errors,
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
            company
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

            </FormControl>
            <Button variant={"brand"} mt={3} mr={3} onClick={handleVendor}>
                Save
            </Button>
            <Button mt={3} onClick={() => setOpenedPage(0)}>Cancel</Button>
        </Box>
    )
}