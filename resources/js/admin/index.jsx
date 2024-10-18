import './assets/css/App.css';
import 'react-notifications-component/dist/theme.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import {
  ChakraProvider,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
// Chakra imports

export function Main() {
  // eslint-disable-next-line
  const { setUser } = useContext(UserContext);
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  useEffect(() => {
    const user = window.localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user))
    }
  }, [])

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="/admin*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route
          path="rtl/*"
          element={
            <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ChakraProvider>
  );
}
