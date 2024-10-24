import React, { useEffect, useState } from "react";

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

// Assets
import { IoMenuOutline } from "react-icons/io5";

function FeaturedProductsSidebar(props) {
  const { routes } = props;

  let variantChange = "0.2s linear";
  let shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarMargins = "0px";

  const [top, setTop] = useState(115);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setTop(offset > 115 ? 0 : 115 - offset);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // SIDEBAR
  return (
    <Box display={{ sm: "none", xl: "block" }} w="100%" position={"fixed"} top={`${top}px`}minH='100%' zIndex={'-1'}>
      <Card
        // bg={sidebarBg}
        transition={variantChange}
        w='300px'
        h='100vh'
        m={sidebarMargins}
        minH='100%'
        overflowX='hidden'
        float={"right"}
        boxShadow={shadow}
      >
        <Scrollbars
          autoHide
          // renderTrackVertical={renderTrack}
          // renderThumbVertical={renderThumb}
          // renderView={renderView}
          >
          <Content routes={routes} />
        </Scrollbars>
      </Card>
    </Box>
  );
}

// FUNCTIONS
export function FeaturedProductsSidebarResponsive() {
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  let menuColor = useColorModeValue("gray.400", "white");
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

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
// PROPS

FeaturedProductsSidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};

export default FeaturedProductsSidebar;
