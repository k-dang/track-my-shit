import { useState, useEffect } from 'react';

import './App.css';
import { Routes, Route } from 'react-router-dom';
import Portfolio from './components/Portfolio';
import AddStock from './components/AddStock';
import Header from './components/Header';

// Header names and routes for router
const headerData = [
  {
    label: 'Portfolio',
    href: '/',
  },
  {
    label: 'Add Stock',
    href: '/add',
  },
];

const App = () => {
  const [isGoLoaded, setIsGoLoaded] = useState(false);

  useEffect(() => {
    WebAssembly.instantiateStreaming(
      fetch('alphaVantageApi.wasm'),
      window.go.importObject
    ).then((result) => {
      window.go.run(result.instance);
      setIsGoLoaded(true);
    });
  }, []);

  return (
    <div className="container">
      {isGoLoaded ? (
        <Routes>
          <Route path="/" element={<Header headerData={headerData} />}>
            <Route index element={<Portfolio />} />
            <Route path="add" element={<AddStock />} />
          </Route>
        </Routes>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
};

export default App;
