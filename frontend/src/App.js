import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Interact from './components/Interact'; // Drawing component
import QRCodeInteraction from './components/QRCodeInteraction'; // QR code component
import Whiteboard from './components/Whiteboard.tsx';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => setConnected(true);

  return (
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/about" element={<About />} />
            <Route path="/whiteboard" element={<Whiteboard />} />
            <Route
              path="/connect"
              element={
                !connected ? (
                  <QRCodeInteraction onConnect={handleConnect} />
                ) : (
                  <Interact />
                )
              }
            />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
