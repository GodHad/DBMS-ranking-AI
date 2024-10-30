import React, { useState } from "react";
import {
  Box,
  Flex,
  Stack,
  Button,
  Text,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";

import NavItems from "./NavItems";
import CollapseMenu from "./CollapseMenu";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const Header = () => {
  const [isOpen, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <React.Fragment>
      <Box
        position="fixed"
        top="0"
        zIndex="10"
        minW="100%"
        px={{ base: 20, lg: 20, md: 20, sm: 0, xs: 0 }}
      >
        <Flex
          backdropFilter="blur(4px)"
          border="none"
          minH="60px"
          py={{ base: 2, md: 3 }}
          px={{ base: 4, md: 7 }}
          alignSelf="center"
        >
          <Stack
            flex={{ base: 1, md: 1 }}
            justify="space-between"
            direction="row"
            align="center"
            cursor="pointer"
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <Flex
                justify="start"
                direction="row"
                alignItems="center"
                cursor="pointer"
                gap="2"
              >
                <logo />
                <Text
                  fontFamily={"heading"}
                  fontSize={{
                    base: "2xl",
                    lg: "2xl",
                    md: "2xl",
                    sm: "xl",
                    xs: "xl",
                  }}
                  fontWeight="extrabold"
                >
                  Spendify
                </Text>
              </Flex>
            </Link>
          </Stack>
          <NavItems />
          <Stack
            flex={{ base: 1, md: 1 }}
            justify="end"
            direction="row"
            align="center"
            spacing="3"
            mx={{
              base: 0,
            }}
          >
            <Box display={{ md: "none", lg: "none" }}>
              <IconButton
                variant="outline"
                icon={<FiMenu />}
                colorScheme="blue"
                onClick={handleToggle}
                border="2px"
                aria-label={"Hamburger Menu"}
                _focus={{ boxShadow: "outline" }}
              />
            </Box>
            <Box
              display={{
                base: "none",
                sm: "none",
                md: "flex",
              }}
            >
              <>
                <ButtonGroup>
                  <Button
                    as={Link}
                    href="/login"
                    passHref
                    border="2px"
                    variant="outline"
                    size="md"
                    colorScheme="blue"
                    _focus={{ boxShadow: "outline" }}
                  >
                    Log in
                  </Button>
                  <Button
                    colorScheme="blue"
                    as={Link}
                    href="/signup"
                    passHref
                    variant="solid"
                    size="md"
                    _focus={{ boxShadow: "outline" }}
                  >
                    Sign up
                  </Button>
                </ButtonGroup>
              </>
            </Box>
          </Stack>
        </Flex>
        <CollapseMenu isOpen={isOpen} setOpen={handleToggle} />
      </Box>
    </React.Fragment>
  );
};

export default Header;