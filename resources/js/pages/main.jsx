import '../assets/css/App.css';
import 'react-notifications-component/dist/theme.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './admin/layouts/auth';
import AdminLayout from './admin/layouts/admin';
import UserLayout from './user/layouts/Content';
import {
  ChakraProvider,
  Spinner
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './admin/theme/theme'; //  { themeGreen }
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useQuery } from 'react-query';
import axios from 'axios';
// Chakra imports

export function Main() {
  // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const { user, setUser } = useContext(UserContext);
  // const [isLoading, setIsLoading] = useState(true)
  const getUser = async () => {
    const response = await axios.get('/api/user');
    // setIsLoading(false)
    return response.data.user;
  };

  const { data: resUser, isLoading } = useQuery('getUser', getUser);

  useEffect(() => {
    setUser(resUser);
  }, [resUser])

  if (user === undefined) return <Spinner size={"lg"} />;

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
