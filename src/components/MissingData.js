import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const MissingData = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/parse');
  };

  return (
    <Container>
      <Typography variant="body1" color="textPrimary">
        Please parse your portfolio data first
      </Typography>
      <Button onClick={handleButtonClick} variant="outlined">
        Go to Parse
      </Button>
    </Container>
  );
};

export default MissingData;
