import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Image,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import Logo from './components/Logo'
import NavbarLinks from './NavbarLinksUser'
import routes from '../../pages/user/routes';
import { Link, useLocation } from 'react-router-dom'
import { useContext, useMemo, useState } from 'react'
import { FeaturedProductSidebarContext } from '../../contexts/FeaturedProductsContext'
import { Skeleton } from '@chakra-ui/skeleton'
import { getBanners } from '../../pages/admin/views/admin/banner/requests/use-request';
import { useQuery } from 'react-query';
import Slider from 'react-slick';
import { APP_URL } from '../../variables/statics';
import { MdChildCare } from 'react-icons/md';

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 3000,
  slidesToShow: 1,
  slidesToScroll: 1,
}

const NavLink = ({ route }) => {
  const location = useLocation();
  const bg = useColorModeValue('gray.200', 'gray.700');
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  return (
    route.name !== 'Data Explorer' ?
      <Box
        px={3}
        py={3}
        rounded={'md'}
        bg={location.pathname.startsWith(route.path) ? bg : 'transparent'}
        _hover={{
          textDecoration: 'none',
          bg: bg
        }}
      >
        <Link to={route.path}>{route.name}</Link>
      </Box> :
      <Flex
        alignItems='center'
        justifyContent='center'
        bg={location.pathname.startsWith(route.path) ? bg : 'transparent'}
        _hover={{
          textDecoration: 'none',
          bg: bg,
          color: 'white'
        }}
        rounded={'md'}
        px={3}
        py={3}
        bgClip="text"
        bgGradient={"linear(to-r, #2ac349, #018cc1)"}
      >
        <Box
          color={
            location.pathname.includes('explorer')
              ? activeIcon
              : textColor
          }
          me='8px'
        >
          <MdChildCare />
        </Box>
        <Box>
          <Link to={route.path}>{route.name}</Link>
        </Box>
      </Flex>
  )
}

export default function Navbar(props) {
  const [slider, setSlider] = useState(null);
  const top = useBreakpointValue({ base: '90%', md: '50%' })
  const side = useBreakpointValue({ base: '30%', md: '10px' })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { featuredProducts } = useContext(FeaturedProductSidebarContext);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const { data: banners, isLoadingBanner } = useQuery('banners', getBanners, { staleTime: 100000 });

  const topBanners = useMemo(() => {
    return banners ? banners.filter(banner => banner.type === 0) : [];
  }, [banners]);

  let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
  return (
    <>
      <Box bg={navbarBg} px={4} my={"10px"}>
        <Flex w="100%" display={'flex'} flexDir={{ base: 'column', sm: 'column', lg: 'row' }} alignItems={'center'} justifyContent={'center'}>
          <Box position={{ base: 'block', lg: 'absolute' }} left={'4'}>
            <Logo />
          </Box>
          <Box position={'relative'} height={'90px'} maxW={'728px'} width={{ base: '90%', lg: '80%' }} overflow={'hidden'}>
            <link
              rel="stylesheet"
              type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
            <link
              rel="stylesheet"
              type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
            />
            {topBanners &&
              <Slider {...settings} ref={(slider) => setSlider(slider)}>
                {topBanners.map((image, index) => (
                  <a href={image.link} target='_blank' key={image.id + image.url}>
                    <Image
                      mb={5}
                      h="90px"
                      maxW="100%"
                      w="auto"
                      borderRadius="xl"
                      objectFit="cover"
                      objectPosition="center"
                      src={`${APP_URL}storage/${image.url}?w=1400&auto=compression,format`}
                      alt={image.url}
                    />
                  </a>
                ))}
              </Slider>
            }
          </Box>
        </Flex>

      </Box>
      <Box bg={navbarBg} px={4}>
        <Flex w="100%" h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack alignItems={'center'} fontWeight={700}>
            <HStack display={{ base: 'none', md: 'flex' }}>
              {routes.map((route, index) => (
                <NavLink key={route.path + index} route={route} />
              ))}
              <NavLink route={{ path: '/sign-in', name: 'Login' }} />
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
              {routes.map((route, index) => (
                <NavLink key={route.path + index} route={route} />
              ))}
              <NavLink route={{ path: '/sign-in', name: 'Login' }} />
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Box bg={navbarBg} px={4}>
        <Flex w="100%" h={16} alignItems={'center'} justifyContent={'center'}>
          <HStack alignItems={'center'} fontWeight={700}>
            <Text color={textColor} fontSize='lg' fontWeight='extrabold' mr={{ base: 2, md: 4 }}>
              Featured Products:
            </Text>
            <HStack>
              {featuredProducts ? featuredProducts.map((product, index) => (
                <a key={product.title + index} href={product.link} target='_blank'>
                  <Text
                    mr={{ base: 2, md: 4 }}
                    color={'blue.500'}
                    textDecor={'underline'}
                  >
                    {product.title}
                  </Text>
                </a>
              )) : <Skeleton height={'20px'} maxW={'md'} w={'120px'} />}
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </>
  )
}