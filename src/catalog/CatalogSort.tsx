import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface CatalogFormatFilterProps {
  setSort: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogSort = ({
  setSort,
}: CatalogFormatFilterProps) => {
  const [order, setOrder] = React.useState<string>('asc');
  const [sortField, setSortField] = React.useState<string>('title');

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const { target: { value } } = event;

    setSortField(value as string);
    setSort(`${order === 'asc' ? '' : '-'}${value}`);
  };


  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    const { target: { value } } = event;

    setOrder(value as string);
    setSort(`${value === 'asc' ? '' : '-'}${sortField}`);
  };

  return (
    <Box display="flex">
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>SortField</InputLabel>
        <Select
          value={sortField}
          onChange={handleSortChange}
          input={<OutlinedInput label="SortField" />}
        >
          {['title', 'dateCreated', 'dateModified'].map((field) => (
            <MenuItem key={field} value={field}          >
              {field}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ ml: 2, width: 100 }}>
        <InputLabel>SortOrder</InputLabel>
        <Select
          value={order}
          onChange={handleOrderChange}
          input={<OutlinedInput label="SortOrder" />}
        >
          {['asc', 'desc'].map((field) => (
            <MenuItem key={field} value={field}          >
              {field}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CatalogSort;
