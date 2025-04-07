import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import config from '../config';

interface ResourceFormat {
  title: string;
}

interface CatalogFormatFilterProps {
  formats: string[];
  setFormats: React.Dispatch<React.SetStateAction<string[]>>;
}

const CatalogFormatFilter = ({
  formats,
  setFormats,
}: CatalogFormatFilterProps) => {
  const [availableFormats, setAvailableFormats] = React.useState<string[]>([]);

  React.useEffect(() => {
    void (async () => {
      const response = await fetch(`${config.api.endpoints.openApi}/dataset-resource-formats`);
      const json = await response.json();
      const resourceFormats = json.results
        .map((result: ResourceFormat) => result.title)
        .sort();
      setAvailableFormats(resourceFormats);
    })();
  }, []);

  const handleFormatChange = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setFormats(value as string[]);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Formats</InputLabel>
      <Select
        multiple
        value={formats}
        onChange={handleFormatChange}
        input={<OutlinedInput label="Formats" />}
      >
        {availableFormats.map((format) => (
          <MenuItem key={format} value={format}          >
            {format}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CatalogFormatFilter;
