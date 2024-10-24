'use client'

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import Logo from './components/Logo'
import NavbarLinks from './NavbarLinksUser'
import routes from '../../pages/user/routes';
import { Link, useLocation } from 'react-router-dom'

const NavLink = ({ route }) => {
  const location = useLocation();
  const bg = useColorModeValue('gray.200', 'gray.700');
  return (
    <Box
      px={5}
      py={3}
      rounded={'md'}
      bg={location.pathname === route.path ? bg : 'transparent'}
      _hover={{
        textDecoration: 'none',
        bg: bg
      }}
    >
      <Link to={route.path}>{route.name}</Link>
    </Box>
  )
}

export default function Navbar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
  return (
    <>
      <Box bg={navbarBg} px={4} mt={"20px"}>
        <Flex w="100%" h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'} fontWeight={700}>
            <Box><Logo /></Box>
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              {routes.map((route) => (
                <NavLink key={route.path} route={route} />
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Box ms='auto' w={{ sm: '100%', md: 'unset' }}>
              <NavbarLinks
                onOpen={props.onOpen}
                logoText={props.logoText}
                secondary={props.secondary}
                fixed={props.fixed}
              />
            </Box>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

    </>
  )
}