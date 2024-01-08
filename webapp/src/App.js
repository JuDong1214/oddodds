// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import NBA from './NBA';
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
        </Routes> 
      </Router>
    </div>
  )
}

export default App;