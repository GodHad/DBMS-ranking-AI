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
        component: () => import('./views/home')
    },
    {
        name: 'DBMS Ranking',
        path: '/ranking',
        component: () => import('./views/ranking'),
    },
    {
        name: 'DBMS',
        path: '/dbms',
        component: () => import('./views/dbms'),
    },
    {
        name: 'Encyclopedia',
        path: '/encyclopedia',
        component: () => import('./views/encyclopedia')
    },
    {
        name: 'Blog',
        path: '/blog',
        component: () => import('./views/blogs')
    },
    {
        name: 'Sponsors',
        path: '/sponsors',
        component: () => import('./views/sponsor')
    }
];

export default routes;
