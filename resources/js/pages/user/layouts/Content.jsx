// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from './Footer/Footer';
import Navbar from '../../../components/navbar/NavbarUser';
import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from '../routes';
import FeaturedProductsSidebar from '../../../components/featuredProductSidebar/Sidebar';
import { FeaturedProductSidebarContext } from '../../../contexts/FeaturedProductsContext';

// Custom Chakra theme
export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps';
  };
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
        <Route path={`${route.path}`} element={route.component} key={key} />
      );
    });
  };
  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();
  document.documentElement.dir = 'ltr';
  return (
    <Box>
      <Box>
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={"100%"}
          maxWidth={"100%"}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
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
          <FeaturedProductSidebarContext.Provider
            value={{
              toggleSidebar,
              setToggleSidebar,
            }}
          >
            <Box
              mx="auto"
              p={{ base: '20px', md: '30px' }}
              pe="20px"
              minH="100vh"
              w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
              maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
              float="left"
            >
              <Routes>
                {getRoutes(routes)}
                {/* <Route path="/home" element={<MainDashboard />} /> */}
                <Route
                  path="/"
                  element={<Navigate to="/home" replace />}
                />
              </Routes>
            </Box>
            <FeaturedProductsSidebar routes={routes} display="none" {...rest} />
          </FeaturedProductSidebarContext.Provider>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
