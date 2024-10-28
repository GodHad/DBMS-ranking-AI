import React from 'react';

import Home from './views/home';
import DBMSRanking from './views/dbms';
import Encyclopedia from './views/encyclopedia';
import Blogs from './views/blogs';
import Sponsor from './views/sponsor';

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
    },
    {
        name: 'Encyclopedia',
        path: '/encyclopedia',
        component: <Encyclopedia />
    },
    {
        name: 'Blog',
        path: '/blog',
        component: <Blogs />
    },
    {
        name: 'Sponsors',
        path: '/sponsors',
        component: <Sponsor />
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
