import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import Headerbar from './dashboard';

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Headerbar />} />
          <Route path="/forgot" element={<h1>Forgot Password Page</h1>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;