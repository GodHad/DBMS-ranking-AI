import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import HomePage from './home';
import SponsorPage from './Sponsor_page/index'
import VendorPage from './components/Vendor'
import VendorsPage from './vendor_page';
import { Main } from '../admin';

import { UserContext } from '../contexts/UserContext';

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(null);
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forgot" element={<h1>Forgot Password Page</h1>} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/*" element={<Main />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
