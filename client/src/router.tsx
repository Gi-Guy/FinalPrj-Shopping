import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UserProfile from './components/UserProfile';
import CreateShopForm from './pages/CreateShopForm';
import ShopPage from './pages/ShopPage';
import CreateCategoryPage from './pages/CreateCategoryPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPageT'; 
import StorePage from './pages/StorePage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'create-shop', element: <CreateShopForm /> },
      { path: 'shops/:slug', element: <ShopPage /> },
      { path: 'create-category', element: <CreateCategoryPage /> },
      { path: 'chat', element: <ChatPage /> }, 
      { path: 'login', element: <LoginPage /> }, 
      { path: 'register', element: <RegisterPage /> }, 
      { path: '*', element: <NotFoundPage /> },
      {path: 'register', element: <RegisterPage /> },
      {path: 'login', element: <LoginPage /> },
      {path: 'store/:slug', element: <StorePage /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
