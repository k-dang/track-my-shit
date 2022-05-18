import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StockProvider } from './context/StockContext';

// components
import CenteredProgress from './components/CenteredProgress';
import Header from './components/Header';
import './App.css';

// pages
import Portfolio from './components/pages/Portfolio';
import AddStock from './components/pages/AddStock';
import Parse from './components/pages/Parse';

// Header names and routes for router
const headerData = [
  {
    label: 'Portfolio',
    href: '/',
  },
  {
    label: 'Parse',
    href: '/parse',
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
      fetch('lib.wasm'),
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
              <Route index element={<Portfolio />} />
              <Route path="parse" element={<Parse />} />
              <Route path="add" element={<AddStock />} />
            </Route>
          </Routes>
        </StockProvider>
      ) : (
        <CenteredProgress />
      )}
    </div>
  );
};

export default App;
