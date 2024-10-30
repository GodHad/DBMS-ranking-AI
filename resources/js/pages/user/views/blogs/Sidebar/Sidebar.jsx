import React from "react";

import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  useDisclosure,
  Popover,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import Content from "./components/Content";
import PropTypes from "prop-types";
import { IoMenuOutline } from "react-icons/io5";

function Sidebar(props) {
  const { categories, showingCategories, setShowingCategories, tags, showingTags, setShowingTags } = props;

  let variantChange = "0.2s linear";
  let shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  let sidebarMargins = "0px";

  return (
    <Box display={{ sm: "none", xl: "block" }} w="100%" position='absolute' px={'25px'}>
      <Box
        transition={variantChange}
        w='300px'
        m={sidebarMargins}
        minH='100%'
        overflowX='hidden'
        mb="30px"
        boxShadow={shadow}>
        <Content categories={categories} showingCategories={showingCategories} setShowingCategories={setShowingCategories} tags={tags} showingTags={showingTags} setShowingTags={setShowingTags} />
      </Box>
    </Box>
  );
}

export function SidebarResponsive(props) {
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  let menuColor = useColorModeValue("gray.400", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { categories, showingCategories, setShowingCategories, tags, showingTags, setShowingTags } = props;

  return (
    <Flex display={{ sm: "flex", xl: "none" }} alignItems='center'>
      <Flex ref={btnRef} w='max-content' h='max-content' onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my='auto'
          w='20px'
          h='20px'
          me='10px'
          _hover={{ cursor: "pointer" }}
        />
      </Flex>
      <Popover
        isOpen={isOpen}
        onClose={onClose}
      >
        <PopoverContent w='285px' maxW='285px' bg={sidebarBackgroundColor} top={'100px'}>
          <PopoverBody maxW='285px' px='0rem' pb='0' p='5'>
            <Content categories={categories} showingCategories={showingCategories} setShowingCategories={setShowingCategories} tags={tags} showingTags={showingTags} setShowingTags={setShowingTags} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
}

Sidebar.propTypes = {
  logoText: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};

export default Sidebar;
