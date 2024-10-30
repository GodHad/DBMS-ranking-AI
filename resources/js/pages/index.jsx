import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Main } from './main';

import { UserContext } from '../contexts/UserContext';

const queryClient = new QueryClient();

function App() {
  
  const [user, setUser] = useState(undefined);

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
