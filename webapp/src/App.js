// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import NBA from './NBA';
import NBAspread from './NBAspread';
import NBAtot from './NBAtot';
import Home from './Home';
import './App.css'; // Import the main CSS file

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/'  element={<Home />} />
          <Route path='/NBA'  element={<NBA />} />
          <Route path='/NBAspread'  element={<NBAspread />} />
          <Route path='/NBAtotal'  element={<NBAtot />} />
        </Routes> 
      </Router>
    </div>
  )
}

export default App;