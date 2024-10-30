// Chakra imports
import { Portal, Box, useDisclosure, Image } from '@chakra-ui/react';
import Footer from './Footer/Footer';
import Navbar from '../../../components/navbar/NavbarUser';
import React, { useState, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import routes from '../routes';
import FeaturedProductsSidebar from '../../../components/featuredProductSidebar/Sidebar';
import { FeaturedProductSidebarContext } from '../../../contexts/FeaturedProductsContext';
import BlogPage from '../views/blogs/BlogPage';
import Page404 from '../../../components/404';
import { APP_URL } from '../../../variables/statics';
import { getBanners } from '../../admin/views/admin/banner/requests/use-request';
import { getFeaturedProducts } from '../../../components/featuredProductSidebar/requests/use-request';
import { useQuery } from 'react-query';
import { DBMSContext } from '../../../contexts/DBMSContext';
import CompareDBMS from '../views/dbms/components/CompareDBMS';
import DBMS from '../views/dbms/components/DBMS';
import ContactUs from '../views/contactus';
import Services from '../views/services'
import EncyclopediaPage from '../views/encyclopedia/Encyclopedia';

// Custom Chakra theme
export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const { data: featuredProducts, isLoading } = useQuery('featured_products', getFeaturedProducts, { staleTime: 300000 });
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const getActiveRoute = (routes) => {
    let activeRoute = 'DB Ranking AI';
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].secondary;
        }
      }
    }
    return activeNavbar;
  };
  const getActiveNavbarText = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].messageNavbar;
        }
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      return (
        <Route path={`${route.path}`} element={route.component} key={route.path} />
      );
    });
  };
  const { onOpen } = useDisclosure();

  const { data: banners, isLoadingBanner } = useQuery('banners', getBanners, { staleTime: 100000 });

  const bottomBanners = useMemo(() => {
    return banners ? banners.filter(banner => banner.type === 1) : [];
  }, [banners]);

  const location = useLocation();
  const [vendors, setVendors] = useState([])
  const [encyclopedias, setEncyclopedias] = useState([])

  return (
    <Box>
      <DBMSContext.Provider value={{ vendors, setVendors, encyclopedias, setEncyclopedias }}>
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="hidden"
          position="relative"
          maxHeight="100%"
          w={"100%"}
          maxWidth={"100%"}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <FeaturedProductSidebarContext.Provider
            value={{
              toggleSidebar,
              setToggleSidebar,
              featuredProducts
            }}
          >
            <Navbar
              onOpen={onOpen}
              logoText={'Horizon UI Dashboard PRO'}
              brandText={getActiveRoute(routes)}
              secondary={getActiveNavbar(routes)}
              message={getActiveNavbarText(routes)}
              fixed={fixed}
              {...rest}
            />
            <Box
              mx="auto"
              p={{ base: '20px', md: '30px' }}
              pe="20px"
              minH="100vh"
              w={{ base: '100%', lg: 'calc( 100% - 290px )' }}
              maxWidth={{ base: '100%', lg: 'calc( 100% - 290px )' }}
              float="left"
              position={'relative'}
              zIndex={1}
            >
              <Routes>
                {getRoutes(routes)}
                <Route path="/blog/:id/:slug" element={<BlogPage />} />
                <Route path="/dbms/:slug" element={<DBMS />} />
                <Route path="/dbms/compare/:slug" element={<CompareDBMS />} />
                <Route path="/encyclopedia/:slug" element={<EncyclopediaPage />} />
                <Route
                  path="/"
                  element={<Navigate to="/home" replace />}
                />
                <Route path='/contact-us' element={<ContactUs />} />
                <Route path='/services' element={<Services />} />
                <Route path='/*' element={<Page404 />} />
              </Routes>
            </Box>
            <FeaturedProductsSidebar display="none" {...rest} />
          </FeaturedProductSidebarContext.Provider>
        </Box>
      </DBMSContext.Provider>
      <Box width={'full'}>
        {location.pathname === '/home' && bottomBanners.map((image, index) => (
          <a key={image.id + image.url} href={image.link} target='_blank' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Image
              mb={5}
              h="90px"
              maxW="728px"
              w="100%"
              borderRadius="xl"
              objectFit="cover"
              objectPosition="center"
              src={`${APP_URL}storage/${image.url}?w=1400&auto=compression,format`}
              alt={image.url}
            />
          </a>
        ))}
      </Box>
      <Footer />
    </Box>
  );
}
