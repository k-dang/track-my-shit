import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';

const CustomToggleButton = styled(ToggleButton)({
  color: 'white',
  borderRadius: 4,
  border: 'none',
  padding: '7px 14px',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '&.Mui-selected': {
    color: 'white',
    backgroundColor: '#42a5f5',
  },
  '&.Mui-selected:hover': {
    backgroundColor: '#42a5f5',
  },
});

export default CustomToggleButton;
