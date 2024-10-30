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
  MdStorage,
  MdFavorite,
  MdImage
} from 'react-icons/md';

import Banner from './views/admin/banner';
import DBMS from './views/admin/dbms';
import Encyclopedia from './views/admin/encyclopedia';
import Blog from './views/admin/blog';
import Sponsor from './views/admin/sponsors';
import User from './views/admin/users';
import FeaturedProduct from './views/admin/featured products'

import SignInCentered from './views/auth/signIn';
import SignUpCentered from './views/auth/signup';

const routes = [
  // {
  //   name: 'Dashboard',
  //   layout: '/admin',
  //   path: '/default',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: <MainDashboard />,
  // },
  {
    name: 'Banners',
    layout: '/admin',
    path: '/banner',
    icon: <Icon as={MdImage} width={'20px'} height={'20px'} color='inherit' />,
    component: () => import('./views/admin/banner')
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/user',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: () => import('./views/admin/users')
  },
  {
    name: 'DBMS',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdStorage} width={"20px"} height={"20px"} color="inherit" />,
    component: () => import('./views/admin/dbms')
  },
  {
    name: 'Encyclopedias',
    layout: '/admin',
    path: '/encyclopedia',
    icon: <Icon as={MdTranslate} width={"20px"} height={"20px"} color="inherit" />,
    component: () => import('./views/admin/encyclopedia')
  },
  {
    name: 'Blogs',
    layout: '/admin',
    path: '/blog',
    icon: <Icon as={MdCommentBank} width={"20px"} height={"20px"} color="inherit" />,
    component: () => import('./views/admin/blog')
  },
  {
    name: 'Sponsors',
    layout: '/admin',
    path: '/sponsor',
    icon: <Icon as={MdAttachMoney} width={"20px"} height={"20px"} color="inherit" />,
    component: () => import('./views/admin/sponsors')
  },
  {
    name: 'Featured Products',
    layout: '/admin',
    path: '/featured-products',
    icon: <Icon as={MdFavorite} width="20px" height="20px" color="inherit" />,
    component: () => import('./views/admin/featured products')
  },
  {
    name: 'Sign In',
    path: 'sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: () => import('./views/auth/signIn'),
  },
  // {
  //   name: 'Sign Up',
  //   layout: '/auth',
  //   path: '/sign-up',
  //   icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
  //   component: <SignUpCentered />,
  // },
];

export default routes;
