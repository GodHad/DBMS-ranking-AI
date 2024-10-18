import React, { useState } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Flex,
    Icon,
    Text,
    Select,
    Box
} from '@chakra-ui/react'
import { useDisclosure, useColorModeValue } from '@chakra-ui/react'
import { Store } from 'react-notifications-component';
import { Select as MultiSelect } from 'chakra-react-select';
import { useQueryClient, useMutation } from 'react-query';
import { createVendor, updateVendor } from '../requests/use-request';

export default function VendorForm({ vendor, categories, setOpenedPage }) {
    const queryClient = useQueryClient();

    const {
        id,
        company_name,
        description,
        primary_category,
        secondary_category,
        contact_info,
        website_url,
        technical_doc,
        developer,
        initial_release,
        current_release,
        license,
        cloud_based_only,
        dbaas_offerings,
        implementation_lang,
        server_os,
        data_scheme,
        typing,
        xml_support,
        secondary_indexes,
        sql,
        apis_access_method,
        supported_programming_lang,
        server_side_scripts,
        triggers,
        partitioning_methods,
        replication_methods,
        mapreduce,
        consistency_concepts,
        foreign_keys,
        trasaction_concepts,
        concurrency,
        durability,
        in_memory_capabilities,
        user_concepts,
        db_name,
    } = vendor;

    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = "gray.400";
    const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
    const textColorBrand = useColorModeValue("brand.500", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");

    const [form, setForm] = useState({
        id,
        company_name,
        description,
        primary_category,
        secondary_category,
        contact_info,
        website_url,
        technical_doc,
        developer,
        initial_release,
        current_release,
        license,
        cloud_based_only,
        dbaas_offerings,
        implementation_lang,
        server_os,
        data_scheme,
        typing,
        xml_support,
        secondary_indexes,
        sql,
        apis_access_method,
        supported_programming_lang,
        server_side_scripts,
        triggers,
        partitioning_methods,
        replication_methods,
        mapreduce,
        consistency_concepts,
        foreign_keys,
        trasaction_concepts,
        concurrency,
        durability,
        in_memory_capabilities,
        user_concepts,
        db_name,
    })

    React.useEffect(() => {
        setForm({
            id,
            company_name,
            description,
            primary_category,
            secondary_category,
            contact_info,
            website_url,
            technical_doc,
            developer,
            initial_release,
            current_release,
            license,
            cloud_based_only,
            dbaas_offerings,
            implementation_lang,
            server_os,
            data_scheme,
            typing,
            xml_support,
            secondary_indexes,
            sql,
            apis_access_method,
            supported_programming_lang,
            server_side_scripts,
            triggers,
            partitioning_methods,
            replication_methods,
            mapreduce,
            consistency_concepts,
            foreign_keys,
            trasaction_concepts,
            concurrency,
            durability,
            in_memory_capabilities,
            user_concepts,
            db_name,
        });
    }, [vendor])

    const createVendorMutation = useMutation(createVendor, {
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries('vendors');
                setOpenedPage(0)
                Store.addNotification({
                    title: "Create Vendor Successfully",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                })
            }
            else {
                Store.addNotification({
                    title: "Failed to create Vendor",
                    message: data.error,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                })
            }
        }
    })

    const updateVendorMutation = useMutation(updateVendor, {
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries('vendors');
                setOpenedPage(0)
                Store.addNotification({
                    title: "Update Vendor Successfully",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                })
            }
            else {
                Store.addNotification({
                    title: "Failed to update Vendor",
                    message: data.error,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                })
            }

        }
    })

    const handleVendor = () => {
        if (!form.id) createVendorMutation.mutate({ vendor: { ...form, primary_category: form.primary_category.join(','), secondary_category: form.secondary_category.join(',') } })
        else updateVendorMutation.mutate({ vendor: { ...form, primary_category: form.primary_category.join(','), secondary_category: form.secondary_category.join(',') } });
    }

    const handleChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleChangeMultiSelect = (name, value) => {
        setForm({ ...form, [name]: value })
    }

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!vendor.id ? "Create" : "Update"} Vendor</Text>
            <FormControl>
                <CustomInput title="Vendor Name" name="company_name" value={form.company_name} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Database Name" name="db_name" value={form.db_name} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Description" name="description" value={form.description} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomMultiSelect title="Primary Categories" name="primary_category" value={form.primary_category} handleChangeMultiSelect={handleChangeMultiSelect} options={categories.map(category => ({ id: category.id, value: category.title, label: category.title }))} />
                <CustomMultiSelect title="Secondary Categories" name="secondary_category" value={form.secondary_category} handleChangeMultiSelect={handleChangeMultiSelect} options={categories.map(category => ({ id: category.id, value: category.title, label: category.title }))} />
                {/* <CustomInput title="Contact Info" name="contact_info" value={form.contact_info} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} /> */}
                <CustomInput type="url" title="Website URL" name="website_url" value={form.website_url} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput type="url" title="Technical Documentation" name="technical_doc" value={form.technical_doc} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Developer" name="developer" value={form.developer} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Initial Release" name="initial_release" value={form.initial_release} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Current Release" name="current_release" value={form.current_release} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="License" name="license" value={form.license} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="Cloud-based only" name="cloud_based_only" value={form.cloud_based_only} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="DBaaS offerings" name="dbaas_offerings" value={form.dbaas_offerings} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Implementation Language" name="implementation_lang" value={form.implementation_lang} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Server Operating System" name="server_os" value={form.server_os} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="Data Scheme" name="data_scheme" value={form.data_scheme} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="Typing" name="typing" value={form.typing} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="XML Support" name="xml_support" value={form.xml_support} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="Secondary Indexes" name="secondary_indexes" value={form.secondary_indexes} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="SQL" name="sql" value={form.sql} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="APIs Access Method" name="apis_access_method" value={form.apis_access_method} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Supported Programming Languages" name="supported_programming_lang" value={form.supported_programming_lang} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Server Side Scripts" name="server_side_scripts" value={form.server_side_scripts} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="Triggers" name="triggers" value={form.triggers} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Partitioning Methods" name="partitioning_methods" value={form.partitioning_methods} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Replication Methods" name="replication_methods" value={form.replication_methods} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="MapReduce" name="mapreduce" value={form.mapreduce} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Consistency Concepts" name="consistency_concepts" value={form.consistency_concepts} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="Foreign Keys" name="foreign_keys" value={form.foreign_keys} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="Transaction Concepts" name="trasaction_concepts" value={form.trasaction_concepts} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="Concurrency" name="concurrency" value={form.concurrency} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="Durability" name="durability" value={form.durability} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomSelect title="In Memory Capabilities" name="in_memory_capabilities" value={form.in_memory_capabilities} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="User Concepts" name="user_concepts" value={form.user_concepts} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
            </FormControl>

            <Button variant={"brand"} mr={3} onClick={handleVendor}>
                Save
            </Button>
            <Button onClick={() => setOpenedPage(0)}>Cancel</Button>
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

const CustomSelect = ({ title, name, value, handleChangeForm, textColor, brandStars }) => {
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
                value={value}
                name={name}
                onChange={handleChangeForm}
            >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
            </Select>
        </>
    )
}

const CustomMultiSelect = ({ title, name, value, handleChangeMultiSelect, textColor, brandStars, options }) => {
    const handleChange = (selected) => {
        handleChangeMultiSelect(name, selected.map(category => category.id));
        setSelectedOptions(selected)
    }
    const [selectedOptions, setSelectedOptions] = useState([])

    React.useEffect(() => {
        const selected = value.map(id => options.find(option => option.id == id)).filter(option => option)
        setSelectedOptions(selected)
    }, [])
    return (
        <FormControl mb={"24px"}>
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
            <MultiSelect
                isMulti
                value={selectedOptions}
                placeholder='Select categories'
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='text'
                fontWeight='500'
                size='lg'
                options={options}
                onChange={handleChange}
            />
        </FormControl>
    )
}
