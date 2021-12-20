import { useState } from "react";

import { Button } from "@mui/material";

const AddStock = () => {
  const [stockSymbol, setStockSymbol] = useState("");

  const handleChange = (e) => {
    setStockSymbol(e.target.value);
  };

  return (
    <div>
      <input
        id="inputStockSymbol"
        type="text"
        value={stockSymbol}
        onChange={handleChange}
      />
      <Button onClick={() => alert(stockSymbol)}>Submit</Button>
    </div>
  );
};

export default AddStock;
