import React from 'react';
import Logo from './components/Logo'
import PromotionsTable from "./components/PromotionsTable";
import './App.css';

const App = () => {
  return (
      <div className="App">
          <Logo />
          <PromotionsTable />
      </div>
  );
}

export default App;
