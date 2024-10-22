import '../assets/css/App.css';
import 'react-notifications-component/dist/theme.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './admin/layouts/auth';
import AdminLayout from './admin/layouts/admin';
import UserLayout from './user/layouts/Content';
import {
  ChakraProvider,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './admin/theme/theme'; //  { themeGreen }
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
          path="/admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route path="/" element={
          <UserLayout theme={currentTheme} setTheme={setCurrentTheme} />
        } />
      </Routes>
    </ChakraProvider>
  );
}
