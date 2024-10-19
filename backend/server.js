const WebSocket = require('ws');

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

console.log('WebSocket server running on ws://0.0.0.0:8080');
