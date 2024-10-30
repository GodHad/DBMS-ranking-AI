import React from "react";
import { Text, Stack, useColorModeValue } from "@chakra-ui/react";
import {
  Skeleton,
} from "@chakra-ui/skeleton";

export function SidebarLinks(props) {
  let activeColor = useColorModeValue("gray.700", "white");
  let textColor = useColorModeValue("secondaryGray.500", "gray.400");

  const { categories, showingCategory, setShowingCategory } = props;

  const createLinks = (categories) => {
    return categories.map((category, index) => (
      <Text
        fontSize={"md"}
        color={index === showingCategory ? activeColor : textColor}
        fontWeight='bold'
        mx='auto'
        pt='10px'
        pb='10px'
        _hover={{
          color: activeColor
        }}
        cursor={"pointer"}
        key={index}
        onClick={() => setShowingCategory(index)}
      >
        {category.label}
      </Text>
    ));
  };
  if (categories) return createLinks(categories);
  return (
    <Stack gap="3">
      <Skeleton height={"30px"} borderRadius={"12px"} />
      <Skeleton height={"30px"} borderRadius={"12px"} />
      <Skeleton height={"30px"} borderRadius={"12px"} />
      <Skeleton height={"30px"} borderRadius={"12px"} />
      <Skeleton height={"30px"} borderRadius={"12px"} />
    </Stack>
  )
}

export default SidebarLinks;
