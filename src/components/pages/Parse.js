import { useState } from 'react';
import useParsePortfolio from '../../hooks/useParsePortfolio';
import XLSX from 'xlsx';

// components
import { Grid, Button, Typography } from '@mui/material';
import BrokerButtonGroup from '../BrokerButtonGroup';
import './Parse.css';

import {
  QuestTrade,
  Interactive,
  TDAmeritrade,
} from '../../constants/brokerConstants';

const Parse = () => {
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [parsePortfolio] = useParsePortfolio();

  const onButtonToggle = (value) => {
    setSelectedBroker(value);
  };

  const handleInputChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file === undefined) {
      return;
    }

    switch (selectedBroker) {
      case QuestTrade:
        reader.onload = (e) => {
          const workbook = XLSX.read(e.target.result);
          const first_sheet_name = workbook.SheetNames[0];
          const data = XLSX.utils.sheet_to_csv(
            workbook.Sheets[first_sheet_name]
          );

          // TODO pass in file contents to go function
          console.log(data);
        };
        reader.readAsArrayBuffer(file);
        break;
      case Interactive:
        reader.onload = (e) => {
          console.log(e.target.result);
        };
        reader.readAsText(file);
        break;
      case TDAmeritrade:
        reader.onload = (e) => {
          console.log(e.target.result);
        };
        reader.readAsText(file);
        break;
      default:
        console.log('default case?');
    }

    await parsePortfolio();
  };

  const devNavigation = async () => {
    if (process.env.NODE_ENV === 'development') {
      await parsePortfolio();
    }
  };

  const isUploadDisabled = selectedBroker == null ? true : false;

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <Typography variant="h4" color="textPrimary">
          Parse
        </Typography>
      </Grid>
      {process.env.NODE_ENV === 'development' ? (
        <Grid item xs={2}>
          <Button onClick={devNavigation} variant="outlined">
            Load Dev data
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
