import { useState } from 'react';

import { ToggleButtonGroup, ToggleButton } from '@mui/material';

import { StyledEngineProvider } from '@mui/material/styles';
import QuestTradeIcon from '../images/questtrade.svg';
import InteractiveIcon from '../images/interactive.svg'
import './BrokerButtonGroup.css';

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
        <ToggleButton value="qt" disableRipple>
          <img
            width="36px"
            height="36px"
            src={QuestTradeIcon}
            alt="QuestTrade Logo"
          />
          <span className="button-text">QuestTrade</span>
        </ToggleButton>
        <ToggleButton value="ibkr" disableRipple>
          <img
            width="36px"
            height="36px"
            src={InteractiveIcon}
            alt="Interactive Logo"
          />
          <span className="button-text">Interactive</span>
        </ToggleButton>
      </ToggleButtonGroup>
    </StyledEngineProvider>
  );
};

export default BrokerButtonGroup;
