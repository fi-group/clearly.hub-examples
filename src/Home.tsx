import { routes } from './routes';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';

const Home = () => (
  <Paper elevation={3} sx={{ flex: 1 }}>
    <List>
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

export default Home
