import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import HomePage from './home';
import SponsorPage from './Sponsor_page/index'
import VendorPage from './components/Vendor'
import Vsponsor from '../pages/Sponsor_page/logged/index'
import VendorsPage from './vendor_page';

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forgot" element={<h1>Forgot Password Page</h1>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/vendors" element={<VendorsPage/>}/>
        </Routes>
      </Router>
    );
}

export default App;
