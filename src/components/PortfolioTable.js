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
    field: 'marketPrice',
    headerName: 'Market Price',
    width: 150,
  },
  {
    field: 'averagePrice',
    headerName: 'Average Price',
    width: 150,
  },
  {
    field: 'marketValue',
    headerName: 'Market Value',
    width: 150,
  },
];

const PortfolioTable = ({ portfolio }) => {
  const rows = Object.keys(portfolio).map((key, i) => {
    return {
      id: i,
      symbol: key,
      quantity: portfolio[key]['quantity'],
      marketPrice: portfolio[key]['marketPrice'],
      averagePrice: portfolio[key]['averagePrice'].toFixed(2),
      marketValue: (
        portfolio[key]['marketPrice'] * portfolio[key]['quantity']
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
