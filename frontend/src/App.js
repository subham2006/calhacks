// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AIProvider } from './components/AIContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Interact from './components/Interact';
import QRCodeInteraction from './components/QRCodeInteraction';
import Whiteboard from './components/Whiteboard.tsx';
import './App.css';
import 'katex/dist/katex.min.css';

function App() {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => setConnected(true);

  return (
    <AIProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
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
    </AIProvider>
  );
}

export default App;