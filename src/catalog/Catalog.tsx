import React from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
} from '@mui/material';
import { fetchAuthSession } from 'aws-amplify/auth';

import {
  CatalogFormatFilter,
  CatalogLimit,
  CatalogSearch,
  CatalogSort
} from ".";

import config from '../config';

interface CatalogSearchResult {
  _id: string;
  title: string;
  resources: {
    name: string;
    format: string;
    url: string;
  }[]
}

interface CatalogSearchResults {
  totalCount: number;
  results: CatalogSearchResult[]
}

const Catalog = () => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const [search, setSearch] = React.useState<string>('');
  const [formats, setFormats] = React.useState<string[]>([]);
  const [limit, setLimit] = React.useState<number>(10);
  const [sort, setSort] = React.useState<string>('title');

  const [searchResults, setSearchResults] = React.useState<CatalogSearchResults>({
    totalCount: 0,
    results: [],
  });

  React.useEffect(() => {
    void (async () => {
      setLoading(true);
      const query = { formats };

      const url = new URL(config.api.endpoints.openApi + '/datasets');
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('search', search);
      url.searchParams.append('sort', sort);
      url.searchParams.append('query', JSON.stringify(query));

      const session = await fetchAuthSession();
      const headers = {
        Authorization: session.tokens?.accessToken?.toString() ?? '',
      };

      const response = await fetch(url.toString(), {
        headers,
      });
      const json = await response.json();
      setSearchResults(json.results ? json : { totalCount: 0, results: [] });
      setLoading(false);
    })()
  }, [formats, limit, search, sort]);

  return (
    <Paper elevation={3} sx={{ width: '80%', maxHeight: '100%' }}>
      <Box display="flex" flexDirection="row" sx={{ height: '80vh' }}>
        <Box flex={0} sx={{ width: 300 }}>
          <List>
            <ListItem>
              <ListItemText primary={<CatalogSearch search={search} setSearch={setSearch} />} />
            </ListItem>
            <ListItem>
              <ListItemText primary={<CatalogFormatFilter formats={formats} setFormats={setFormats} />} />
            </ListItem>
            <ListItem>
              <ListItemText primary={<CatalogLimit limit={limit} setLimit={setLimit} />} />
            </ListItem>
            <ListItem>
              <ListItemText primary={<CatalogSort setSort={setSort} />} />
            </ListItem>
          </List>
        </Box>
        <Box><Divider orientation="vertical" /></Box>
        <Box display="flex" flex={1} sx={{ p: 1 }}>
          {loading
            ? (<Box flex={1} display="flex" justifyContent="center" alignItems="center" >
              <CircularProgress variant="indeterminate" size={50} />
            </Box>)
            : (<Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
              <ListSubheader>
                Total of {searchResults.totalCount} results.&nbsp;
                {limit < searchResults.totalCount ? `Now showing the first ${limit}.` : ''}
              </ListSubheader>
              <Divider />
              <List sx={{ overflowY: 'scroll' }}>
                {searchResults.results.map((result: CatalogSearchResult) => (
                  <ListItem key={result._id}>
                    <ListItemText
                      primary={result.title}
                      secondary={`${result.resources.length} resources.`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>)}
        </Box>
      </Box>
    </Paper>
  );
};

export default Catalog;
