require('dotenv').config();
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { createWorker } = require('tesseract.js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (data) => {
    try {
      const parsedData = JSON.parse(data); // Parse the incoming JSON
      console.log('Received:', parsedData); // Debug log

      // Broadcast the message to all connected clients except the sender
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedData)); // Send JSON string
        }
      });
    } catch (error) {
      console.error('Invalid JSON received:', error); // Log JSON errors
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// HTTP endpoint for analysis
app.post('/analyze', async (req, res) => {
  const { imageData } = req.body;

  try {
    // Send image data to OpenAI's vision endpoint
    const response = await axios.post('https://api.openai.com/v1/vision/analyze', {
      image: imageData,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ analysis: response.data });
  } catch (error) {
    console.error('Error during analysis:', error.response.data);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.listen(3001, () => {
  console.log('HTTP server running on http://localhost:3001');
});

console.log('WebSocket server running on ws://0.0.0.0:8080');
