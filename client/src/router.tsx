import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateShopForm from './pages/CreateShopForm';
import ShopPage from './pages/ShopPage';
export const router = createBrowserRouter([
  {
    path: '/create-shop',
    element: <CreateShopForm />,
  },
    {
    path: '/shops/:slug',
    element: <ShopPage />,
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}