import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStock } from '../context/StockContext';

// components
import { Grid, Button, Typography } from '@mui/material';
import BrokerButtonGroup from './BrokerButtonGroup';
import './Parse.css';

const Parse = () => {
  const [selectedBroker, setSelectedBroker] = useState(null);
  const navigate = useNavigate();
  const { getStockPortfolio } = useStock();

  const onButtonToggle = (value) => {
    setSelectedBroker(value);
  };

  const handleInputChange = async (event) => {
    var file = event.target.files[0];
    // TODO pass in file contents to go function
    console.log(file);

    await getStockPortfolio();
    navigate('/portfolio');
  };

  const isUploadDisabled = selectedBroker == null ? true : false;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" color="textPrimary">
          Parsing Page
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <BrokerButtonGroup onChangeCallback={onButtonToggle} />
      </Grid>
      <Grid item xs={4}>
        <label htmlFor="contained-button-file">
          <input
            type="file"
            accept=".csv,.xlsx"
            className="upload-input"
            id="contained-button-file"
            onChange={handleInputChange}
            disabled={isUploadDisabled}
          />
          <Button
            variant="contained"
            component="span"
            disabled={isUploadDisabled}
          >
            Upload
          </Button>
        </label>
        {isUploadDisabled ? (
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
            className="help-text"
          >
            Please select a broker
          </Typography>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default Parse;
