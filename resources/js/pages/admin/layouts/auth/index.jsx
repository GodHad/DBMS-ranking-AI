import React, { useContext, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component'

import { Box, useColorModeValue } from '@chakra-ui/react';

import { SidebarContext } from '../../../../contexts/SidebarContext';
import { UserContext } from '../../../../contexts/UserContext';
import SignIn from '../../views/auth/signIn';

export default function Auth() {
  const navigate = useNavigate();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { user } = useContext(UserContext);

  if (user) navigate('/admin');

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
            <SignIn />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
