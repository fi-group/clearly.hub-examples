/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import config from "../config";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

interface DigitalTwinResult {
  _id: string;
  title: string;
  description: string;
  previewImage: string;
}
interface DigitalTwinResults {
  totalCount: number;
  results: DigitalTwinResult[];
}

const titleSorter = (a: DigitalTwinResult, b: DigitalTwinResult) =>
  a.title.localeCompare(b.title);

const DigitalTwinList = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchResults, setSearchResults] = React.useState<DigitalTwinResults>({
    totalCount: 0,
    results: [],
  });

  React.useEffect(() => {
    void (async () => {
      setLoading(true);

      const url = new URL(config.api.endpoints.openApi + '/digital-twins');

      const session = await fetchAuthSession();
      const headers = {
        Authorization: session.tokens?.accessToken?.toString() ?? '',
      };

      const response = await fetch(url.toString(), {
        headers,
      });
      const json = await response.json();
      console.log(json);

      setSearchResults(json.results ? json : { totalCount: 0, results: [] });
      setLoading(false);
    })()
  }, []);

  return (
    <Box display="flex" flex={1} sx={{ height: '100%' }}>
      {loading
        ? (
          <Box flex={1} display="flex" justifyContent="center" alignItems="center" >
            <CircularProgress variant="indeterminate" size={50} />
          </Box>
        )
        : (
          <Box display="flex" flexDirection="row" sx={{ maxWidth: '100%' }}>
            <Grid container spacing={2}>
              {searchResults.results.sort(titleSorter).map((result: DigitalTwinResult, idx: number) => (
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                  <Card sx={{ minWidth: 275, flex: 1 }} key={idx}>
                    <CardContent>
                      <Box display={'flex'} flexDirection="row" justifyContent="space-between">
                        <Box flex={1}>
                          <Typography variant="body1">
                            {result.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              maxHeight: 76,
                              overflow: 'hidden',
                            }}>
                            {result.description}
                          </Typography>
                        </Box>
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: 5,
                            height: 100,
                            width: 100,
                            backgroundImage: `url(${result.previewImage})`,
                            backgroundSize: 'cover',
                            '& .no-preview': {
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                              width: '100%',
                            },
                          }}>
                          {!result.previewImage && <Typography variant="body2" className="no-preview">No Preview</Typography>}
                        </Paper>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        href={`https://hub.clearly.app/digital-twins/${result._id}`}
                        target="_blank"
                      >
                        Open Digital Twin
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      }
    </Box>
  );
};

export default DigitalTwinList;
