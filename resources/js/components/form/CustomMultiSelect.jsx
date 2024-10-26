import React, { useState, useEffect } from 'react';
import { FormControl, FormLabel, Text } from '@chakra-ui/react';
import { Select as MultiSelect } from 'chakra-react-select';

export const CustomMultiSelect = ({ title, name, value, handleChangeMultiSelect, textColor, brandStars, options }) => {
    const handleChange = (selected) => {
        handleChangeMultiSelect(name, selected.map(category => category.id));
        setSelectedOptions(selected)
    }
    const [selectedOptions, setSelectedOptions] = useState([])

    useEffect(() => {
        const selected = value.map(id => options.find(option => option.id == id)).filter(option => option)
        setSelectedOptions(selected)
    }, [value, options])

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
                isSearchable
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