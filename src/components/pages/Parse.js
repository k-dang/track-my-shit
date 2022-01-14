import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStock } from '../../context/StockContext';
import XLSX from 'xlsx';

// components
import { Grid, Button, Typography } from '@mui/material';
import BrokerButtonGroup from '../BrokerButtonGroup';
import './Parse.css';

import { QuestTrade, Interactive } from '../../constants/brokerConstants';

const Parse = () => {
  const [selectedBroker, setSelectedBroker] = useState(null);
  const navigate = useNavigate();
  const { getStockPortfolio } = useStock();

  const onButtonToggle = (value) => {
    setSelectedBroker(value);
  };

  const handleInputChange = async (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      switch (selectedBroker) {
        case QuestTrade:
          const workbook = XLSX.read(e.target.result);
          const first_sheet_name = workbook.SheetNames[0];
          const data = XLSX.utils.sheet_to_csv(
            workbook.Sheets[first_sheet_name]
          );

          // TODO pass in file contents to go function
          console.log(data);
          break;
        case Interactive:
          const bufferUint8Array = new Uint8Array(e.target.result);
          const csvString = new TextDecoder().decode(bufferUint8Array);

          console.log(csvString);
          break;
        default:
          console.log('default case?');
      }
    };

    reader.readAsArrayBuffer(file);

    await getStockPortfolio();
    navigate('/portfolio');
  };

  const devNavigation = async () => {
    if (process.env.NODE_ENV === 'development') {
      await getStockPortfolio();
      navigate('/portfolio');
    }
  };

  const isUploadDisabled = selectedBroker == null ? true : false;

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <Typography variant="h3" color="textPrimary">
          Parsing Page
        </Typography>
      </Grid>
      {process.env.NODE_ENV === 'development' ? (
        <Grid item xs={2}>
          <Button onClick={devNavigation} variant="outlined">
            Dev
          </Button>
        </Grid>
      ) : null}
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
