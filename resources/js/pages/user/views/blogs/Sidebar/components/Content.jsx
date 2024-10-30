import React from "react";
import { CheckboxGroup, VStack, Checkbox, useColorModeValue, Text, Box } from "@chakra-ui/react";
import { Select as MultiSelect } from 'chakra-react-select';

function SidebarContent(props) {
  const { categories, showingCategories, setShowingCategories, tags, showingTags, setShowingTags } = props;
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const handleCategoryChange = (values) => {
    setShowingCategories(values.map(Number));
  };

  return (
    <>
      <Box mb="20px">
        <Text
          color={textColor}
          fontSize="18px"
          mb="20px"
          fontWeight="600"
          lineHeight="100%"
        >
          Categories
        </Text>
        <CheckboxGroup value={showingCategories} onChange={handleCategoryChange}>
          <VStack align="start">
            {categories.map((category) => (
              <Checkbox key={category.id} value={category.id}>
                {category.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </Box>
      <Box w={"90%"} minH="500px">
        <Text
          color={textColor}
          fontSize="18px"
          mb="20px"
          fontWeight="600"
          lineHeight="100%"
        >
          Tags
        </Text>
        <MultiSelect
          isMulti
          isSearchable
          placeholder='Select categories'
          variant='auth'
          fontSize='sm'
          defaultValue={showingTags}
          ms={{ base: "0px", md: "0px" }}
          type='text'
          fontWeight='500'
          size='lg'
          options={tags}
          onChange={setShowingTags}
        />
      </Box>
    </>
  );
}

export default SidebarContent;