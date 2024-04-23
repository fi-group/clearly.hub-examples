import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface CatalogLimitProps {
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

const CatalogLimit = ({
  limit,
  setLimit,
}: CatalogLimitProps) => {
  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const { target: { value } } = event;
    setLimit(value as number);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Limit</InputLabel>
      <Select
        value={limit}
        onChange={handleLimitChange}
        input={<OutlinedInput label="Limit" />}
      >
        {[1, 10, 50, 100].map((format) => (
          <MenuItem key={format} value={format}          >
            {format}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CatalogLimit;
