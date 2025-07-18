import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateShopForm from './pages/CreateShopForm';

export const router = createBrowserRouter([
  {
    path: '/create-shop',
    element: <CreateShopForm />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}