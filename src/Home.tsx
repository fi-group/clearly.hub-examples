import React from 'react';
import { routes } from './routes';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
} from '@mui/material';
import { AuthSession, fetchAuthSession } from 'aws-amplify/auth';

const Home = () => {
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
    <Paper elevation={3}>
      <List>
        {session && (
          <ListSubheader>{getHeader()}</ListSubheader>
        )}
        {routes.map(({ path, name }) => (
          <ListItem key={path}>
            <ListItemButton component="a" href={path}>
              <ListItemText primary={name} secondary={path} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Home
