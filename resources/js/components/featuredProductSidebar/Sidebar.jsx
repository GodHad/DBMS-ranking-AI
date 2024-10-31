import React from "react";

// chakra imports
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
} from "@chakra-ui/react";
import Content from "./components/Content";
import {
  renderThumb,
  renderTrack,
  renderView,
} from "../scrollbar/Scrollbar";
import Card from '../card/Card';
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import { MdFavoriteBorder } from "react-icons/md";

function FeaturedProductsSidebar() {

  let variantChange = "0.2s linear";
  let shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  let sidebarMargins = "0px";

  return (
    <Box display={{ lg: "block", base: 'none' }} w="100%" position={"absolute"} top={`${268}px`} minH='100%'>
      <Card
        transition={variantChange}
        w='300px'
        m={sidebarMargins}
        overflowX='hidden'
        float={"right"}
        boxShadow={shadow}
      >
          <Content />
      </Card>
    </Box>
  );
}

export function FeaturedProductsSidebarResponsive() {
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  let menuColor = useColorModeValue("gray.400", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <Flex display={{ sm: "flex", lg: "none" }} alignItems='center'>
      <Flex ref={btnRef} w='max-content' h='max-content' onClick={onOpen}>
        <Icon
          as={MdFavoriteBorder}
          color={menuColor}
          my='auto'
          w='20px'
          h='20px'
          me='10px'
          _hover={{ cursor: "pointer" }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={"right"}
        finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent w='285px' maxW='285px' bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex='3'
            onClose={onClose}
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW='285px' px='0rem' pb='0'>
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}>
              <Content />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

FeaturedProductsSidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};

export default FeaturedProductsSidebar;
