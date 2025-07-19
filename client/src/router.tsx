import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateShopForm from './pages/CreateShopForm';
import ShopPage from './pages/ShopPage';
import CreateCategoryPage from './pages/CreateCategoryPage';

export const router = createBrowserRouter([
  {
    path: '/create-shop',
    element: <CreateShopForm />,
  },
    {
    path: '/shops/:slug',
    element: <ShopPage />,
  },
    {
    path: '/create-category',
    element: <CreateCategoryPage />
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}