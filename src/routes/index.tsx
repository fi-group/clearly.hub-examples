import Home from '../Home.tsx'
import { AuthHostedUiExample } from '../auth/index.ts';
import { CatalogExample } from '../catalog/index.ts';
import { DigitalTwinExample } from '../digital-twins/index';
import { HubExample } from '../hubs/index.ts';

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
}, {
  path: '/digital-twins',
  name: 'Digital Twins',
  element: <DigitalTwinExample />,
}, {
  path: '/hubs',
  name: 'Hubs',
  element: <HubExample />,
}];
