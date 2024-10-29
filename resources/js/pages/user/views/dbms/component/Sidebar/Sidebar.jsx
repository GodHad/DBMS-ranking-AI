import React from "react";

import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverBody,
  Button
} from "@chakra-ui/react";
import Content from "./components/Content";
import PropTypes from "prop-types";

// Assets
import { IoMenuOutline } from "react-icons/io5";

function Sidebar(props) {
  const { categories, showingCategory, setShowingCategory } = props;

  let variantChange = "0.2s linear";
  let shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarMargins = "0px";

  // SIDEBAR
  return (
    <Box display={{ sm: "none", xl: "block" }} w="100%" position='absolute'>
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w='300px'
        m={sidebarMargins}
        minH='100%'
        overflowX='hidden'
        boxShadow={shadow}>
        <Content categories={categories} showingCategory={showingCategory} setShowingCategory={setShowingCategory} />
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive(props) {
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  let menuColor = useColorModeValue("gray.400", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { categories, showingCategory, setShowingCategory } = props;

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
        {/* <DrawerOverlay /> */}
        <PopoverContent w='285px' maxW='285px' bg={sidebarBackgroundColor} top={'100px'}>
          <PopoverBody maxW='285px' px='0rem' pb='0'>
            {/* <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}> */}
              <Content categories={categories} showingCategory={showingCategory} setShowingCategory={setShowingCategory} />
            {/* </Scrollbars> */}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
}
// PROPS

Sidebar.propTypes = {
  logoText: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};

export default Sidebar;
