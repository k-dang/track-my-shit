import { Container, CircularProgress } from '@mui/material';
import './CenteredProgress.css';

const CenteredProgress = () => {
  return (
    <Container className="center-container">
      <CircularProgress />
    </Container>
  )
}

export default CenteredProgress