import React from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import { Amplify } from 'aws-amplify';
import {
  AuthSession,
  fetchAuthSession,
  getCurrentUser,
  signInWithRedirect,
  signOut,
} from 'aws-amplify/auth';
import config from '../config';

Amplify.configure({ Auth: { Cognito: config.cognito } });

const Auth = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [currentSession, setCurrentSession] = React.useState<AuthSession>();

  React.useEffect(() => {
    void (async () => {
      try {
        await getCurrentUser();
        setAuthenticated(true);
      }
      catch {
        setAuthenticated(false);
      }
    })();

  }, []);

  React.useEffect(() => {
    void (async () => {
      const session = await fetchAuthSession();
      setCurrentSession(session);
    })();
  }, [authenticated]);


  const handleClick = () => {
    if (authenticated) {
      signOut();
    } else {
      signInWithRedirect();
    }
  }

  const getGreeting = () => {
    const payload = currentSession?.tokens?.idToken?.payload;
    return authenticated
      ? `${payload?.name} <${payload?.email}`
      : '';
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <List>
        <ListItem
          secondaryAction={
            <IconButton onClick={handleClick} edge="end">
              {authenticated ? <LogoutIcon /> : <LoginIcon />}
            </IconButton>
          }>
          <ListItemText
            primary={`You are currently: ${authenticated ? 'signed in' : 'signed out'}`}
            secondary={getGreeting()}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Auth;
