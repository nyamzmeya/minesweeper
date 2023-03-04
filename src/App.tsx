import React, { useEffect } from "react";
import { Board } from "./components/Board";

function App() {
  useEffect(() => {
    document.title = "Minesweeper"
 }, []);
  return (
    <div className="App">
      <div className="header">Minesweeper online</div>
      <Board rowsSize={16} columnsSize={16} minesCount={40} />
    </div>
  );
}

export default App;
