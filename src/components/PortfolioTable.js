import { DataGrid } from '@mui/x-data-grid';
import './PortfolioTable.css';
import { StyledEngineProvider } from '@mui/material/styles';

const columns = [
  {
    field: 'symbol',
    headerName: 'Symbol',
    width: 150,
  },
  {
    field: 'quantity',
    headerName: 'Shares',
    width: 130,
  },
  {
    field: 'averagePrice',
    headerName: 'Average Price',
    width: 150,
  },
  {
    field: 'marketPrice',
    headerName: 'Market Price',
    width: 150,
  },
  {
    field: 'totalCost',
    headerName: 'Total Cost',
    width: 150,
  },
  {
    field: 'marketValue',
    headerName: 'Market Value',
    width: 150,
  },
];

const PortfolioTable = ({ holdings }) => {
  const rows = Object.keys(holdings).map((key, i) => {
    return {
      id: i,
      symbol: key,
      quantity: holdings[key]['quantity'],
      averagePrice: holdings[key]['averagePrice'].toFixed(2),
      marketPrice: holdings[key]['marketPrice'],
      totalCost: (
        holdings[key]['averagePrice'] * holdings[key]['quantity']
      ).toFixed(2),
      marketValue: (
        holdings[key]['marketPrice'] * holdings[key]['quantity']
      ).toFixed(2),
    };
  });

  return (
    <StyledEngineProvider injectFirst>
      <DataGrid
        className="table-container"
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        hideFooter
      />
    </StyledEngineProvider>
  );
};

export default PortfolioTable;
