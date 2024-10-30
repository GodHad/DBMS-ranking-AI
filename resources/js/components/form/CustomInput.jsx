import { FormLabel, Text, Input, Box } from "@chakra-ui/react"

export const CustomInput = ({ type = 'text', title, name, value, handleChangeForm, textColor, brandStars }) => {
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
        </Box>
    )
}