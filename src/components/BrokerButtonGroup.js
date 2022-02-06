import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import QuestTradeIcon from '../images/questtrade.svg';
import InteractiveIcon from '../images/interactive.svg';
import TDAmeritradeIcon from '../images/td.svg';
import './BrokerButtonGroup.css';
import {
  QuestTrade,
  Interactive,
  TDAmeritrade,
} from '../constants/brokerConstants';

const BrokerButtonGroup = ({ onChangeCallback }) => {
  const [broker, setBroker] = useState(null);

  const handleChange = (event, newBroker) => {
    setBroker(newBroker);
    onChangeCallback(newBroker);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ToggleButtonGroup
        className="broker-group"
        value={broker}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value={QuestTrade} disableRipple>
          <img
            width="36px"
            height="36px"
            src={QuestTradeIcon}
            alt="QuestTrade Logo"
          />
          <span className="button-text">QuestTrade</span>
        </ToggleButton>
        <ToggleButton value={Interactive} disableRipple>
          <img
            width="36px"
            height="36px"
            src={InteractiveIcon}
            alt="Interactive Logo"
          />
          <span className="button-text">Interactive</span>
        </ToggleButton>
        <ToggleButton value={TDAmeritrade} disableRipple>
          <img
            width="36px"
            height="36px"
            src={TDAmeritradeIcon}
            alt="TDAmeritrade Logo"
          />
          <span className="button-text">TD Ameritrade</span>
        </ToggleButton>
      </ToggleButtonGroup>
    </StyledEngineProvider>
  );
};

export default BrokerButtonGroup;
