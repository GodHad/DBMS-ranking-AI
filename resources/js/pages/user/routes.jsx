import DataExplorer from './views/data-explorer'

const routes = [
    {
        name: 'Data Explorer',
        path: '/explorer',
        component: <DataExplorer />
    },
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
