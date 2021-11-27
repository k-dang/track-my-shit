import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StockProvider } from './context/StockContext';

// components
import { Container, CircularProgress } from '@mui/material';
import Header from './components/Header';
import './App.css';

// pages
import Portfolio from './components/Portfolio';
import AddStock from './components/AddStock';
import Parse from './components/Parse';

// Header names and routes for router
const headerData = [
  {
    label: 'Portfolio',
    href: '/portfolio',
  },
  {
    label: 'Add Stock',
    href: '/add',
  },
];

const App = () => {
  const [isGoLoaded, setIsGoLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    WebAssembly.instantiateStreaming(
      fetch('alphaVantageApi.wasm'),
      window.go.importObject
    )
      .then((result) => {
        window.go.run(result.instance);
        setIsGoLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  }, []);

  if (!isGoLoaded && error) {
    <div className="container">
      <div>some kinda error page</div>
    </div>;
  }

  return (
    <div className="container">
      {isGoLoaded ? (
        <StockProvider>
          <Routes>
            <Route path="/" element={<Header headerData={headerData} />}>
              <Route index element={<Parse />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="add" element={<AddStock />} />
            </Route>
          </Routes>
        </StockProvider>
      ) : (
        <Container>
          <CircularProgress />
        </Container>
      )}
    </div>
  );
};

export default App;
