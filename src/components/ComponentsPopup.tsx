import { Paper, List, ListItemText, ListItemButton, Snackbar, Divider } from "@mui/material";
import config from "../config";
import React from "react";

// param name that will be passed back from the component to the popup
// defaults to 'data'::
const resultParam = 'componentresult';

const ComponentsExample = () => {
  // broadcast channel to communicate between popup and main window::
  const [bc] = React.useState(() => new BroadcastChannel('clearly-hub-components'));

  // result from the component popup
  const [result, setResult] = React.useState<any>();

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payload = urlParams.get('payload');
    const result = urlParams.get(resultParam);
    
    // if we have a payload, we're in the popup version of this page.
    // we need to forward to the components page:
    if (!!payload) {
      window.open(`${config.components.url}/${payload}`, '_self');
    }
    
    // if we have a result, we're in the popup returning from the component.
    // we need to send the result back to the main window:
    else if (!!result) {
      const data = JSON.parse(atob(result));
      bc.postMessage(data);
      window.close();
    }

    // else, we're in the main window. we're just going to listen for
    // messages from the popup:
    else {
      bc.onmessage = (event) => {
        const { data } = event;
        setResult(data);
      }
    }
  }, []);

  const openPopup = (payload: any): void => {
    // open "ourselves" in a popup, but with a payload param
    // which will be handled in the useEffect above:
    const payloadStr = btoa(JSON.stringify(payload));
    window.open(
      `?payload=${payloadStr}`,
      'hub-components',
      'width=400,height=600',
    );
  }

  const handleSelectSubscription = () => {
    openPopup({
      actions: ['SELECT_SUBSCRIPTION'],
      origin: location.href,
      param: resultParam,
      client_id: config.cognito.userPoolClientId,
    });
  };

  const handleRegisterData = () => {
    openPopup({
      actions: ['REGISTER_RESOURCE'],
      origin: location.href,
      client_id: config.cognito.userPoolClientId,
      param: resultParam,
      data: {
        url: 'https://some.link.to/3d-tiles/tileset.json',
        format: '3dtiles'
      }
    });
  };

  const handleSignOut = () => {
    openPopup({
      actions: ['LOGOUT'],
      origin: location.href,
      client_id: config.cognito.userPoolClientId,
      param: resultParam,
    });
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
        autoHideDuration={10000}
        onClose={() => setResult(undefined)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
}
export default ComponentsExample;
