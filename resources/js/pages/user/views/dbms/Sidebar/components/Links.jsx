import React from "react";
import { useLocation } from "react-router-dom";
import { Text, useColorModeValue } from "@chakra-ui/react";

export function SidebarLinks(props) {
  //   Chakra color mode
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "gray.400");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { categories, showingCategory, setShowingCategory } = props;

  const createLinks = (categories) => {
    return categories.map((category, index) => (
      <Text
        fontSize={"md"}
        color={index === showingCategory ? activeColor: textColor}
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
}

export default SidebarLinks;
