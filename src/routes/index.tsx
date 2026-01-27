import Home from '../Home.tsx'
import { AuthHostedUiExample } from '../auth/index.ts';
import { CatalogExample } from '../catalog/index.ts';
import ComponentsExample from '../components/Components.tsx';
import ComponentsPopupExample from '../components/ComponentsPopup.tsx';
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
  path: '/components',
  name: 'Components',
  element: <ComponentsExample />,
}, {
  path: '/componentspopup',
  name: 'Components in Popup',
  element: <ComponentsPopupExample />,
},
{
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
