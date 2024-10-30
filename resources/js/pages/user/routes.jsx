import React from 'react';

import Home from './views/home';
import DBMSRanking from './views/ranking';
import DBMS from './views/dbms';
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
        name: 'DBMS',
        path: '/dbms',
        component: <DBMS />,
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
];

export default routes;
