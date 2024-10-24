// Chakra Imports
import {
    Avatar,
    Button,
    Flex,
    Icon,
    Image,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
    useColorMode,
  } from '@chakra-ui/react';
  import { Link as ReactLink } from 'react-router-dom';
  // Custom Components
  import { ItemContent } from '../menu/ItemContent';
  import { SearchBar } from './searchBar/SearchBar';
  import { SidebarResponsive } from '../sidebar/Sidebar';
  import PropTypes from 'prop-types';
  import React, { useContext } from 'react';
  // Assets
  import navImage from '../../assets/img/layout/Navbar.png';
  import { MdNotificationsNone, MdInfoOutline } from 'react-icons/md';
  import { IoMdMoon, IoMdSunny } from 'react-icons/io';
  import { FaEthereum } from 'react-icons/fa';
  import routes from '../../pages/admin/routes';
  import { UserContext } from '../../contexts/UserContext';
  import axios from 'axios';
  export default function HeaderLinks(props) {
    const { user, setUser } = useContext(UserContext);
    const { secondary } = props;
    const { colorMode, toggleColorMode } = useColorMode();
    // Chakra Color Mode
    const navbarIcon = useColorModeValue('gray.400', 'white');
    let menuBg = useColorModeValue('white', 'navy.800');
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const textColorBrand = useColorModeValue('brand.700', 'brand.400');
    const ethColor = useColorModeValue('gray.700', 'white');
    const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
    const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
    const ethBox = useColorModeValue('white', 'navy.800');
    const shadow = useColorModeValue(
      '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
      '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
    );
    const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
  
    const handleLogout = async () => {
      await axios.get('/api/logout');
      window.localStorage.removeItem('user')
      setUser(null)
    }
  
    return (
      <Flex
        w={{ sm: '100%', md: 'auto' }}
        alignItems="center"
        flexDirection="row"
        bg={menuBg}
        flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
        p="10px"
        borderRadius="30px"
        boxShadow={shadow}
      >

        <Menu>
          <MenuButton p="0px">
            <Icon
              mt="6px"
              as={MdInfoOutline}
              color={navbarIcon}
              w="18px"
              h="18px"
              me="10px"
            />
          </MenuButton>
          <MenuList
            boxShadow={shadow}
            p="20px"
            me={{ base: '30px', md: 'unset' }}
            borderRadius="20px"
            bg={menuBg}
            border="none"
            mt="22px"
            minW={{ base: 'unset' }}
            maxW={{ base: '360px', md: 'unset' }}
          >
            <Image src={navImage} borderRadius="16px" mb="28px" />
            <Flex flexDirection="column">
              <Link w="100%" href="https://horizon-ui.com/pro">
                <Button w="100%" h="44px" mb="10px" variant="brand">
                  Buy Horizon UI PRO
                </Button>
              </Link>
              <Link
                w="100%"
                href="https://horizon-ui.com/documentation/docs/introduction"
              >
                <Button
                  w="100%"
                  h="44px"
                  mb="10px"
                  border="1px solid"
                  bg="transparent"
                  borderColor={borderButton}
                >
                  See Documentation
                </Button>
              </Link>
              <Link
                w="100%"
                href="https://github.com/horizon-ui/horizon-ui-chakra-ts"
              >
                <Button
                  w="100%"
                  h="44px"
                  variant="no-hover"
                  color={textColor}
                  bg="transparent"
                >
                  Try Horizon Free
                </Button>
              </Link>
            </Flex>
          </MenuList>
        </Menu>
  
        <Button
          variant="no-hover"
          bg="transparent"
          p="0px"
          minW="unset"
          minH="unset"
          h="18px"
          w="max-content"
          onClick={toggleColorMode}
        >
          <Icon
            me="10px"
            h="18px"
            w="18px"
            color={navbarIcon}
            as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
          />
        </Button>
      </Flex>
    );
  }
  
  HeaderLinks.propTypes = {
    variant: PropTypes.string,
    fixed: PropTypes.bool,
    secondary: PropTypes.bool,
    onOpen: PropTypes.func,
  };
  