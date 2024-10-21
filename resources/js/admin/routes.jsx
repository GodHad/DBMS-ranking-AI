import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdList,
  MdHandshake,
  MdAutoGraph,
  MdTranslate,
  MdCommentBank,
  MdAttachMoney,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from './views/admin/default';
import Categories from './views/admin/Categories';
import NFTMarketplace from './views/admin/marketplace';
import Profile from './views/admin/profile';
import DataTables from './views/admin/dataTables';
import Vendor from './views/admin/vendor';
import RankChart from './views/admin/RankCharts';
import Encyclopedia from './views/admin/encyclopedia';
import Blog from './views/admin/blog';
import Sponsor from './views/admin/sponsors';
// Auth Imports
import SignInCentered from './views/auth/signIn';
import SignUpCentered from './views/auth/signup';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Categories',
    layout: '/admin',
    path: '/category',
    icon: <Icon as={MdList} width={"20px"} height={"20px"} color={"inherit"} />,
    component: <Categories />
  },
  {
    name: 'DBMS',
    layout: '/admin',
    path: '/dbms',
    icon: <Icon as={MdHandshake} width={"20px"} height={"20px"} color="inherit" />,
    component: <Vendor />
  },
  {
    name: 'Chart',
    layout: '/admin',
    path: '/chart',
    icon: <Icon as={MdAutoGraph} width={"20px"} height={"20px"} color="inherit" />,
    component: <RankChart />
  },
  {
    name: 'Encylopedias',
    layout: '/admin',
    path: '/encyclopedia',
    icon: <Icon as={MdTranslate} width={"20px"} height={"20px"} color="inherit" />,
    component: <Encyclopedia />
  },
  {
    name: 'Blogs',
    layout: '/admin',
    path: '/blog',
    icon: <Icon as={MdCommentBank} width={"20px"} height={"20px"} color="inherit" />,
    component: <Blog />
  },
  {
    name: 'Sponsors',
    layout: '/admin',
    path: '/sponsor',
    icon: <Icon as={MdAttachMoney} width={"20px"} height={"20px"} color="inherit" />,
    component: <Sponsor />
  },
  {
    name: 'NFT Marketplace',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: <DataTables />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignUpCentered />,
  },
];

export default routes;
