import { Box, useDisclosure, Image, Spinner } from '@chakra-ui/react';
import Footer from './Footer/Footer';
import Navbar from '../../../components/navbar/NavbarUser';
import React, { useState, useMemo, Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import routes from '../routes';
import FeaturedProductsSidebar from '../../../components/featuredProductSidebar/Sidebar';
import { FeaturedProductSidebarContext } from '../../../contexts/FeaturedProductsContext';
import Page404 from '../../../components/404';
import { APP_URL } from '../../../variables/statics';
import { getBanners } from '../../admin/views/admin/banner/requests/use-request';
import { getFeaturedProducts } from '../../../components/featuredProductSidebar/requests/use-request';
import { useQuery } from 'react-query';
import { DBMSContext } from '../../../contexts/DBMSContext';
const BlogPage = lazy(() => import('../views/blogs/BlogPage'));
const CompareDBMS = lazy(() => import('../views/dbms/components/CompareDBMS'));
const DBMS = lazy(() => import('../views/dbms/components/DBMS'));
const ContactUs = lazy(() => import('../views/contactus'));
const Services = lazy(() => import('../views/services'));
const EncyclopediaPage = lazy(() => import('../views/encyclopedia/Encyclopedia'))
const ClaimDBMS = lazy(() => import('../views/claim-dbms'));
const CreateBlogPage = lazy(() => import('../views/blogs/CreateBlogPage'));

export default function Dashboard(props) {
  const { ...rest } = props;
  const { data: featuredProducts } = useQuery('featured_products', getFeaturedProducts, { staleTime: 300000 });
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
      const LazyComponent = lazy(route.component)
      return (
        <Route
          path={`${route.path}`}
          element={
            <Suspense fallback={<Spinner />}>
              <LazyComponent />
            </Suspense>
          }
          key={route.path} />
      );
    });
  };
  const { onOpen } = useDisclosure();

  const { data: banners } = useQuery('banners', getBanners, { staleTime: 100000 });

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
                <Route
                  path="/blog/:id/:slug"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <BlogPage />
                    </Suspense>
                  } />
                <Route
                  path='/blog/create-blog'
                  element={
                    <Suspense fallback={<Spinner />}>
                      <CreateBlogPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/dbms/:slug"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <DBMS />
                    </Suspense>
                  }
                />
                <Route
                  path="/dbms/compare/:slug"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <CompareDBMS />
                    </Suspense>
                  }
                />
                <Route
                  path="/encyclopedia/:slug"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <EncyclopediaPage />
                    </Suspense>
                  }
                />
                <Route path='/contact-us' element={
                  <Suspense fallback={<Spinner />}>
                    <ContactUs />
                  </Suspense>
                } />
                <Route path='/services' element={
                  <Suspense fallback={<Spinner />}>
                    <Services />
                  </Suspense>
                } />
                <Route
                  path='/claim-dbms/:slug'
                  element={
                    <Suspense fallback={<Spinner />}>
                      <ClaimDBMS />
                    </Suspense>
                  }
                />
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
