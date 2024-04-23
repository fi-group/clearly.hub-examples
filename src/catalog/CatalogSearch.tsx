import {
  Box,
  InputBase,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

interface CatalogSearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogSearch = ({ search, setSearch }: CatalogSearchProps) => (
  <Box style={{ position: 'relative' }}>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ position: 'absolute', height: '100%' }}
    >
      <SearchIcon />
    </Box>
    <InputBase
      sx={{
        width: '100%',
        padding: 1,
        '& .MuiInputBase-input': {
          pl: 4,
          width: '20ch',
        }
      }}
      placeholder="Search…"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </Box>
);

export default CatalogSearch;
