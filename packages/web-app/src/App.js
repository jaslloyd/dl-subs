import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Routes from './router/Routes';

const App = () => (
  <React.Fragment>
    <Navbar />
    <Routes />
  </React.Fragment>
);

export default App;
