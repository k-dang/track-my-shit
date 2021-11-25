import Number from './Number';
import Divider from './Divider';
import './PortfolioDetails.css';

import { Stack, Typography } from '@mui/material';

const PortfolioDetails = ({ lastBalance, totalInvested, realizedGains }) => {
  const openPL = (lastBalance - totalInvested).toFixed(2);
  const overallPL = (lastBalance - totalInvested + realizedGains).toFixed(2);

  return (
    <Stack
      direction="row"
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            border: 'none',
            borderLeft: '2px solid hsla(200, 10%, 30%, 100);',
          }}
        />
      }
      spacing={2}
    >
      <Typography variant="string" color="textPrimary" className="row-item">
        <span>Portfolio Value</span>
        <Number number={lastBalance.toFixed(2)}></Number>
      </Typography>
      <Typography variant="string" color="textPrimary" className="row-item">
        <span>Open P&L</span>
        <Number number={openPL} neutral={false}></Number>
        <Number
          number={((openPL / totalInvested) * 100).toFixed(2)}
          neutral={false}
          isPercent={true}
          isSmall={true}
        ></Number>
      </Typography>
      <Typography variant="string" color="textPrimary" className="row-item">
        <span>Overall P&L</span>
        <Number number={overallPL} neutral={false}></Number>
        <Number
          number={((overallPL / totalInvested) * 100).toFixed(2)}
          neutral={false}
          isPercent={true}
          isSmall={true}
        ></Number>
      </Typography>
    </Stack>
  );
};

export default PortfolioDetails;
