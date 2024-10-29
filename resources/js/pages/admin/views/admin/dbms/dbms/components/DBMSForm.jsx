import React, { useState } from 'react'
import {
    Button,
    FormControl,
    Text,
    Box,
    FormLabel,
    Textarea,
    useToast
} from '@chakra-ui/react'
import { useDisclosure, useColorModeValue } from '@chakra-ui/react'
import { useQueryClient, useMutation } from 'react-query';
import { createVendor, updateVendor } from '../requests/use-request';
import { CustomMultiSelect } from '../../../../../../../components/form/CustomMultiSelect';
import { CustomInput } from '../../../../../../../components/form/CustomInput';
import { CustomSelect } from '../../../../../../../components/form/CustomSelect';

export default function VendorForm({ vendor, categories, setOpenedPage }) {
    const toast = useToast();
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
    const bgColor = useColorModeValue('white', 'navy.800')
    const textColorSecondary = "gray.400";
    const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
    const textColorBrand = useColorModeValue("brand.500", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");

    const [form, setForm] = useState({
        id,
        company_name,
        description,
        primary_category: primary_category.map(category => category.id),
        secondary_category: secondary_category.map(category => category.id),
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
            primary_category: primary_category.map(category => category.id),
            secondary_category: secondary_category.map(category => category.id),
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
            queryClient.invalidateQueries('vendors');
            setOpenedPage(0)
            toast({
                title: "Create vendor successfully",
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
                title: "Failed to create vendor successfully",
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
        onSuccess: (data) => {
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
            const errors = error.response.data.errors ? error.response.data.errors : { error: error.response.data.error };
            const key = errors[Object.keys(errors)[0]];
            toast({
                title: "Failed to create vendor successfully",
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
        if (!form.id) createVendorMutation.mutate({ vendor: form })
        else updateVendorMutation.mutate({ vendor: form });
    }

    const handleChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleChangeMultiSelect = (name, value) => {
        console.log(name, value)
        setForm({ ...form, [name]: value })
    }

    return (
        <Box p={"20px"}>
            <Text mb={"32px"} fontSize={22}>{!vendor.id ? "Create" : "Update"} DBMS</Text>
            <FormControl>
                <CustomInput title="Company Name" name="company_name" value={form.company_name} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
                <CustomInput title="Database Name" name="db_name" value={form.db_name} handleChangeForm={handleChangeForm} textColor={textColor} brandStars={brandStars} />
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
