import React from "react";

// Chakra imports
import { Flex, Box, Text } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "../../icons/Icons";
import { HSeparator } from "../../separator/Separator";
import logo from '../../../assets/img/auth/logo.png';
import logo_black_text from '../../../assets/img/auth/logo_black_letter.png';
import { useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function Logo() {
  const { colorMode } = useColorMode();
  //   Chakra color mode
  return (
    <Flex align='center' direction='column'>
      <Link to={"/"}>
        <Box
          bg={`url(${colorMode === 'light' ? logo_black_text : logo})`}
          bgSize='cover'
          borderRadius='16px'
          h='100px'
          w='100px'
        />
      </Link>
    </Flex>
  );
}

export default Logo;