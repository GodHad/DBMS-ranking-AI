import React from 'react';

import Home from './views/home';
import DBMSRanking from './views/dbms';
// import NFTMarketplace from './views/admin/marketplace';
// import Profile from './views/admin/profile';
// import DataTables from './views/admin/dataTables';
// Auth Imports
import SignInCentered from '../admin/views/auth/signIn';
import SignUpCentered from '../admin/views/auth/signup';

const routes = [
    {
        name: 'Home',
        path: '/home',
        component: <Home />,
    },
    {
      name: 'DBMS Ranking',
      path: '/ranking',
      component: <DBMSRanking />,
      secondary: true,
    },
    // {
    //   name: 'Data Tables',
    //   layout: '/admin',
    //   icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    //   path: '/data-tables',
    //   component: <DataTables />,
    // },
    // {
    //   name: 'Profile',
    //   layout: '/admin',
    //   path: '/profile',
    //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    //   component: <Profile />,
    // },
    // {
    //     name: 'Sign In',
    //     layout: '/auth',
    //     path: '/sign-in',
    //     icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    //     component: <SignInCentered />,
    // },
    // {
    //     name: 'Sign Up',
    //     layout: '/auth',
    //     path: '/sign-up',
    //     icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    //     component: <SignUpCentered />,
    // },
];

export default routes;
