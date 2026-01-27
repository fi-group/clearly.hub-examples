import { Paper, List, ListItemText, ListItemButton, Snackbar, Divider } from "@mui/material";
import config from "../config";
import { useSearchParams } from "react-router-dom";
import React from "react";

const ComponentsExample = () => {
  const [result, setResult] = React.useState<any>();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (searchParams.has('data')) {
      const data = JSON.parse(atob(searchParams.get('data')!));
      setResult(data);

      const url = new URL(window.location.href);
      url.searchParams.delete('data');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const clearResult = () => {
    setResult(undefined);
  }
  const handleSelectSubscription = () => {
    const payload = btoa(JSON.stringify({
      actions: ['SELECT_SUBSCRIPTION'],
      origin: 'http://localhost:5173/components',
      client_id: config.cognito.userPoolClientId,
    }));
    window.open(`${config.components.url}/${payload}`, '_self')
  };

  const handleRegisterData = () => {
    const payload = btoa(JSON.stringify({
      actions: ['REGISTER_RESOURCE'],
      origin: 'http://localhost:5173/components',
      client_id: config.cognito.userPoolClientId,
      data: {
        url: 'https://some.link.to/3d-tiles/tileset.json',
        format: '3dtiles'
      }
    }));
    window.open(`${config.components.url}/${payload}`, '_self')
  };


  const handleSignOut = () => {
    const payload = btoa(JSON.stringify({
      actions: ['LOGOUT'],
      origin: 'http://localhost:5173/components',
      client_id: config.cognito.userPoolClientId,
    }));
    window.open(`${config.components.url}/${payload}`, '_self')
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <List>
        <ListItemButton onClick={handleSelectSubscription}>
          <ListItemText
            primary="Select subscription"
            secondary="Select a subscription from Clearly.HUB for this application"
          />
        </ListItemButton>
        <ListItemButton onClick={handleRegisterData}>
          <ListItemText
            primary="Register data"
            secondary="Register a resource in Clearly.HUB"
          />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={handleSignOut}>
          <ListItemText
            primary="Sign out from components"
            secondary="Sign out from Clearly.HUB components (not this application)"
          />
        </ListItemButton>
      </List>

      <Snackbar
        open={result}
        message={JSON.stringify(result, null, 2)}
        autoHideDuration={3000}
        onClose={clearResult}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
}
export default ComponentsExample;
