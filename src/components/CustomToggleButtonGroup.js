import { styled } from '@mui/material/styles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const CustomToggleButtonGroup = styled(ToggleButtonGroup)({
  '.MuiToggleButtonGroup-grouped': {
    // margin: '0 10px',
  },
  '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
    borderRadius: 4,
  },
  '.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
    borderRadius: 4,
    border: 'none',
  },
});

export default CustomToggleButtonGroup;
