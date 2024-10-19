import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Import the right component

const QRCodeInteraction = ({ onConnect }) => {
  const [qrCodeData, setQRCodeData] = useState('');
  const localIP = "172.20.10.13"; // Ensure this is the correct IP
  const url = `http://${localIP}:3000/connect`;

  useEffect(() => {
    setQRCodeData(url);
  }, [url]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Connect to iPad</h1>
      <p>Scan this QR code on your iPad to open the drawing app:</p>
      <QRCodeCanvas value={qrCodeData} size={256} />
      <p>Or manually open: {qrCodeData}</p>
      <button onClick={onConnect} style={{ marginTop: '20px' }}>
        Start Drawing
      </button>
    </div>
  );
};

export default QRCodeInteraction;
