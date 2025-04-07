import React from 'react';
import {
  Badge,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';

import LabelIcon from '@mui/icons-material/Label';

import config from '../config';
import { fetchAuthSession } from 'aws-amplify/auth';

interface HubResult {
  _id: string;
  name: string;
  findability: 'PUBLIC' | 'LIMITED';
  parent: HubResult | null;
  ancestorIds: string[];
  type: 'PROFESSIONAL' | 'COMMUNITY' | 'PERSONAL';
}

interface HubResults {
  results: HubResult[];
}

const nameSorter = (a: HubResult, b: HubResult) => a.name.localeCompare(b.name);

const HubList = () => {
  const [rootHubs, setRootHubs] = React.useState<HubResults>({
    results: [],
  });

  React.useEffect(() => {
    void (async () => {
      const url = new URL(config.api.endpoints.graphql);
      const session = await fetchAuthSession();
      const headers = {
        "Authorization": session.tokens?.accessToken?.toString() ?? '',
        "Content-Type": "application/json",
        "Accept": "application/json",
      };


      const query = `
      query Hubs($rootHubsOnly: Boolean) {
        hubs(rootHubsOnly: $rootHubsOnly) {
          results {
            ... on Hub {
              _id
              name
              findability
              parent {
                _id
                name
              }
              ancestorIds
              type
            }
            ... on PublicHub {
              _id
              name
              findability
              parent {
                _id
                name
              }
              ancestorIds
              type
            }
          }
        }
      }`;

      const variables = {
        rootHubsOnly: false
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({
          query,
          variables,
        }),
        headers,
      })
      const { data: { hubs } } = await response.json();
      setRootHubs(hubs.results ? hubs : { results: [] });
    })()
  }, []);

  const getChildCount = (hub: HubResult) => rootHubs.results.filter((h) => h.parent?._id === hub._id).length;

  return (
    <Paper elevation={3} sx={{ width: '75%', maxHeight: '100%' }}>
      <Box display="flex" flexDirection="row" sx={{ height: '80vh' }}>
        <List sx={{ flex: 1, overflowY: 'auto', maxWidth: '25%', border: '1px solid #ccc' }}>
          {rootHubs.results.sort(nameSorter).map((hub) => (
            <ListItemButton key={hub._id} onClick={() => alert('todo')}>
              <ListItemText primary={hub.name} />
              {getChildCount(hub) > 0 && (
                <Badge badgeContent={getChildCount(hub)} color="secondary">
                  <LabelIcon color="action" />
                </Badge>
              )}
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Paper >
  )
};

export default HubList;
