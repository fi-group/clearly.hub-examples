import { Paper, List, ListItemText, ListItemButton, Snackbar } from "@mui/material";
import config, { isClientIdConfigured } from "../config";
import React from "react";
import {
  ComponentAction,
  RawComponentResult,
  checkComponentResult,
  createComponentRequest,
  encodeComponentRequest,
  readComponentResult,
  summarizeComponentResult,
} from "./componentsHelper";

// param name that will be passed back from the component to the popup
// defaults to 'data'::
const resultParam = 'componentresult';

const ComponentsExample = () => {
  // broadcast channel to communicate between popup and main window::
  const [bc] = React.useState(() => new BroadcastChannel('clearly-hub-components'));

  // summary of the checked result from the component popup
  const [summary, setSummary] = React.useState<string>();

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payload = urlParams.get('payload');
    const componentResult = readComponentResult(urlParams, resultParam);

    // if we have a payload, we're in the popup version of this page.
    // we need to forward to the components page:
    if (payload) {
      window.open(`${config.components.url}/${payload}`, '_self');
    }

    // if we have a result, we're in the popup returning from the component.
    // we need to send the result back to the main window, which checks it:
    else if (componentResult) {
      bc.postMessage(componentResult);
      window.close();
    }

    // else, we're in the main window. we're just going to listen for
    // messages from the popup:
    else {
      bc.onmessage = (event: MessageEvent<RawComponentResult>) => {
        void checkComponentResult(event.data).then((checked) => {
          console.log('Component result:', checked);
          setSummary(summarizeComponentResult(checked));
        });
      }
    }
  }, [bc]);

  const openPopup = (action: ComponentAction, extra?: Record<string, unknown>): void => {
    if (!isClientIdConfigured()) {
      setSummary('No Client Id configured: fill in userPoolClientId in src/config/config.json (see README.md).');
      return;
    }
    // the request (and its state) is created in the main window,
    // so the main window can check the result later::
    const request = createComponentRequest(action, { param: resultParam, ...extra });

    // open "ourselves" in a popup, but with a payload param
    // which will be handled in the useEffect above:
    window.open(
      `?payload=${encodeURIComponent(encodeComponentRequest(request))}`,
      'hub-components',
      'width=400,height=600',
    );
  }

  const handleSelectSubscription = () => {
    openPopup('SELECT_SUBSCRIPTION');
  };

  const handleSelectHub = () => {
    openPopup('SELECT_HUB');
  };

  const handleRegisterData = () => {
    openPopup('REGISTER_RESOURCE', {
      data: {
        url: 'https://some.link.to/3d-tiles/tileset.json',
        format: '3dtiles'
      }
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <List>
        <ListItemButton onClick={handleSelectSubscription}>
          <ListItemText
            primary="Select subscription"
            secondary="Select which of your subscriptions to this application to use"
          />
        </ListItemButton>
        <ListItemButton onClick={handleSelectHub}>
          <ListItemText
            primary="Select hub"
            secondary="Select one of your hubs to use in this application"
          />
        </ListItemButton>
        <ListItemButton onClick={handleRegisterData}>
          <ListItemText
            primary="Register data"
            secondary="Register a resource in Clearly.HUB"
          />
        </ListItemButton>
      </List>

      <Snackbar
        open={!!summary}
        message={summary}
        autoHideDuration={10000}
        onClose={() => setSummary(undefined)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{ sx: { whiteSpace: 'pre-wrap' } }}
      />
    </Paper>
  );
}
export default ComponentsExample;
