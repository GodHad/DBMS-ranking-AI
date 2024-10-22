import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Main } from './main';
import axios from './admin/variables/axiosConfig';

import { UserContext } from '../contexts/UserContext';

const queryClient = new QueryClient();

function App() {
  const getUser = async () => {
    const response = await axios.get('/api/user');
    setUser(response.data.user)
  };
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Routes>
            <Route path="/*" element={<Main />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
