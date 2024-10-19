import React, { useRef, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const Interact = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [ws, setWs] = useState(null); // WebSocket connection

  // Set up WebSocket and canvas context
  useEffect(() => {
    const socket = new WebSocket(`ws://${process.env.REACT_APP_LOCAL_IP}:8080`);
    setWs(socket);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    setContext(ctx);

    // Listen for WebSocket messages
    socket.onmessage = (event) => {
      try {
        const { x, y, type } = JSON.parse(event.data);
        console.log('Received:', { x, y, type });

        if (type === 'start') {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else if (type === 'draw') {
          ctx.lineTo(x, y);
          ctx.stroke();
        } else if (type === 'stop') {
          ctx.closePath();
        } else if (type === 'clear') {
          clearCanvas(); // Call clearCanvas when 'clear' message is received
        }
      } catch (error) {
        console.error('Invalid JSON:', error);
      }
    };

    return () => socket.close();
  }, []);

  const getEventCoordinates = (event) => {
    if (event.touches && event.touches.length > 0) {
      const touch = event.touches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: event.clientX, y: event.clientY };
  };

  const sendDrawingData = (x, y, type) => {
    const data = JSON.stringify({ x, y, type });
    console.log('Sending:', data);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  };

  const startDrawing = (event) => {
    const { x, y } = getEventCoordinates(event);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    sendDrawingData(x, y, 'start');
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { x, y } = getEventCoordinates(event);
    context.lineTo(x, y);
    context.stroke();
    sendDrawingData(x, y, 'draw');
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    context.closePath();
    setIsDrawing(false);
    sendDrawingData(0, 0, 'stop');
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  };

  const handleClear = () => {
    clearCanvas(); // Clear the local canvas
    sendDrawingData(0, 0, 'clear'); // Send 'clear' event to other clients
  };

  const localIP = process.env.REACT_APP_LOCAL_IP || '172.20.10.13'; // Fallback to default if not set
  const url = `http://${localIP}:3000/connect`;

  return (
    <div>
      <h1>Drawing App</h1>
      <p>Scan the QR code below to open this app on your iPad:</p>
      <QRCodeCanvas value={url} size={256} />

      <div style={{ marginTop: '20px' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            border: '2px solid black',
            display: 'block',
            margin: '20px auto',
            touchAction: 'none',
          }}
        />
      </div>

      <button onClick={handleClear} style={{ marginTop: '20px' }}>
        Clear Whiteboard
      </button>
    </div>
  );
};

export default Interact;
