import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import Headerbar from './dashboard';
import SponsorPage from './Sponsor_page/index'

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Headerbar />} />
          <Route path="/forgot" element={<h1>Forgot Password Page</h1>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sponsor_page" element={<SponsorPage />}/>
        </Routes>
      </Router>
    );
}

export default App;
