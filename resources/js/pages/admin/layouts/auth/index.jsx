import React, { useContext, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import routes from '../../routes';
import { ReactNotifications } from 'react-notifications-component'

import { Box, useColorModeValue } from '@chakra-ui/react';

import { SidebarContext } from '../../../../contexts/SidebarContext';
import { UserContext } from '../../../../contexts/UserContext';

export default function Auth() {
  const navigate = useNavigate();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { user } = useContext(UserContext);

  if (user) navigate('/admin');

  const getRoute = () => {
    return window.location.pathname !== '/auth/full-screen-maps';
  };
  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      if (route.layout === '/auth') {
        return (
          <Route path={route.path} element={route.component} key={key} />
        );
      }
      if (route.collapse) {
        return getRoutes(route.items);
      } else {
        return null;
      }
    });
  };
  const authBg = useColorModeValue('white', 'navy.900');
  document.documentElement.dir = 'ltr';
  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <ReactNotifications />
        <Box
          bg={authBg}
          float="right"
          minHeight="100vh"
          height="100%"
          position="relative"
          w="100%"
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          {getRoute() ? (
            <Box mx="auto" minH="100vh">
              <Routes>
                <Route path="/auth" element={user ? <Navigate to="/admin" replace /> : <Navigate to="/auth/sign-in" replace />} />
                {getRoutes(routes)}
              </Routes>
            </Box>
          ) : null}
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
