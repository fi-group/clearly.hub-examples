import { Container, AppBar, IconButton, Typography, Toolbar } from "@mui/material";
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

import { routes } from './routes';
import { AuthSession, fetchAuthSession } from "aws-amplify/auth";
import React from "react";

const router = createBrowserRouter(routes);

const App = () => {
  const [session, setSesssion] = React.useState<AuthSession>();

  React.useEffect(() => {
    void (async () => {
      const session = await fetchAuthSession();
      const payload = session?.tokens?.idToken?.payload;
      if (payload) setSesssion(session);
    })();
  }, []);

  const getHeader = () => {
    if (!session) return null;

    const payload = session?.tokens?.idToken?.payload;
    return `${payload?.name} <${payload?.email}>`;
  };


  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
      }}
      disableGutters>
      <AppBar position="static">
        <Toolbar>
          <IconButton href="/" edge="start" color="inherit" sx={{ mr: 2 }}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Clearly.HUB - Examples
          </Typography>
          {session && (
            <Typography variant="body2">{getHeader()}</Typography>
          )}
        </Toolbar>
      </AppBar>

      <RouterProvider router={router} />
    </Container>
  );
};

export default App;
