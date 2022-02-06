import { useNavigate } from 'react-router-dom';
import { useStock } from '../context/StockContext';

const useParsePortfolio = () => {
  const navigate = useNavigate();
  const { parseStockPortfolio } = useStock();

  const parsePortfolio = async () => {
    await parseStockPortfolio();
    navigate('/');
  };

  return [parsePortfolio];
};

export default useParsePortfolio;
