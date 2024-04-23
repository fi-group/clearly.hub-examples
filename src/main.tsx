import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Home from './Home.tsx'
import { AuthHostedUiExample } from './auth/index.ts';
import { CatalogExample } from './catalog/index.ts';

import './main.css';

export const routes = [{
  path: '/',
  name: 'Home',
  element: <Home />,
}, {
  path: '/auth-hosted-ui',
  name: 'Authentication (Hosted UI)',
  element: <AuthHostedUiExample />
}, {
  path: '/catalog',
  name: 'Catalog',
  element: <CatalogExample />,
}];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
