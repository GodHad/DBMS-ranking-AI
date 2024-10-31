import React, { useContext, useState, Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component'

import { Box, Spinner, useColorModeValue } from '@chakra-ui/react';

import { SidebarContext } from '../../../../contexts/SidebarContext';
import { UserContext } from '../../../../contexts/UserContext';
const SignIn = lazy(() => import('../../views/auth/signIn'));

export default function Auth() {
  const navigate = useNavigate();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user.admin) navigate('/admin');
    if (user) navigate('/')
  }, [user])

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
          <Box mx="auto" minH="100vh">
            <Suspense fallback={<Spinner />}>
              <SignIn />
            </Suspense>
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
