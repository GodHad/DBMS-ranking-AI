import { Box, Flex, Stack } from "@chakra-ui/react";
import Links from "./Links";
import React from "react";


function SidebarContent(props) {
  const { categories, showingCategory, setShowingCategory } = props;
  return (
    <Flex direction='column' height='100%' pt='25px' px="16px" borderRadius='30px'>
      <Stack direction='column' mb='auto' mt='8px'>
        <Box ps='20px' pe={{ md: "16px", "2xl": "1px" }}>
          <Links categories={categories} showingCategory={showingCategory} setShowingCategory={setShowingCategory} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
