import { styled } from '@mui/material/styles';
import { ToggleButtonGroup } from '@mui/material';

const CustomToggleButtonGroup = styled(ToggleButtonGroup)({
  margin: '10px 0',
  '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
    borderRadius: 4,
  },
  '.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
    borderRadius: 4,
    border: 'none',
  },
});

export default CustomToggleButtonGroup;
