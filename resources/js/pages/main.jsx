import '../assets/css/App.css';
import 'react-notifications-component/dist/theme.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './admin/layouts/auth';
import AdminLayout from './admin/layouts/admin';
import UserLayout from './user/layouts/Content';
import {
  ChakraProvider,
  Spinner
} from '@chakra-ui/react';
import initialTheme from './admin/theme/theme';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useQuery } from 'react-query';
import axios from 'axios';

export function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const { user, setUser } = useContext(UserContext);
  const getUser = async () => {
    const response = await axios.get('/api/user');
    return response.data.user;
  };

  const { data: resUser } = useQuery('getUser', getUser, {staleTime: 300000});

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
        <Route path="/*" element={
          <UserLayout theme={currentTheme} setTheme={setCurrentTheme} />
        } />
      </Routes>
    </ChakraProvider>
  );
}
