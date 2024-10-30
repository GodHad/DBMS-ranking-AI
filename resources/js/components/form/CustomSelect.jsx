import { FormLabel, Text, Select, Box } from "@chakra-ui/react"

export const CustomSelect = ({ title, name, value, handleChangeForm, textColor, brandStars }) => {
    return (
        <Box w={'full'}>
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
        </Box>
    )
}