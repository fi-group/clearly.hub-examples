import { Paper, List, ListItemText, ListItemButton, Snackbar } from "@mui/material";
import config, { isClientIdConfigured } from "../config";
import { useSearchParams } from "react-router-dom";
import React from "react";
import {
  ComponentAction,
  checkComponentResult,
  createComponentRequest,
  encodeComponentRequest,
  readComponentResult,
  summarizeComponentResult,
} from "./componentsHelper";

const ComponentsExample = () => {
  const [summary, setSummary] = React.useState<string>();
  const [searchParams] = useSearchParams();
  // the result may only be checked once, because its state can only be used once::
  const handledResult = React.useRef(false);

  React.useEffect(() => {
    // if we have a result, we're returning from the component.
    // check the result and show it::
    const componentResult = readComponentResult(searchParams);
    if (componentResult && !handledResult.current) {
      handledResult.current = true;

      // cleanup::
      window.history.replaceState({}, '', window.location.pathname);

      void checkComponentResult(componentResult).then((checked) => {
        console.log('Component result:', checked);
        setSummary(summarizeComponentResult(checked));
      });
    }
  }, [searchParams]);

  const openComponent = (action: ComponentAction, extra?: Record<string, unknown>) => {
    if (!isClientIdConfigured()) {
      setSummary('No Client Id configured: fill in userPoolClientId in src/config/config.json (see README.md).');
      return;
    }
    const request = createComponentRequest(action, extra);
    window.open(`${config.components.url}/${encodeComponentRequest(request)}`, '_self');
  };

  const handleSelectSubscription = () => {
    openComponent('SELECT_SUBSCRIPTION');
  };

  const handleSelectHub = () => {
    openComponent('SELECT_HUB');
  };

  const handleRegisterData = () => {
    openComponent('REGISTER_RESOURCE', {
      data: {
        url: 'https://some.link.to/3d-tiles/tileset.json',
        format: '3dtiles',
      },
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
