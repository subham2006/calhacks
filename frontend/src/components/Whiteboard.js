import React, { useState } from 'react';
import { exportToBlob, Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';

const AnalyzeCanvasButton = ({ onAnalysisComplete }) => {
  const editor = useEditor();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const shapeIds = editor.getCurrentPageShapeIds();
    if (shapeIds.size === 0) {
      alert('No shapes on the canvas');
      setIsAnalyzing(false);
      return;
    }

    try {
      const blob = await exportToBlob({
        editor,
        ids: [...shapeIds],
        format: 'png',
        opts: { background: false },
      });

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        // Send to API
        const response = await fetch('your-api-endpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64data }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        onAnalysisComplete(data.explanation);
      };
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <button
      style={{
        pointerEvents: 'all',
        fontSize: 18,
        backgroundColor: isAnalyzing ? 'gray' : 'thistle',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: isAnalyzing ? 'not-allowed' : 'pointer',
      }}
      onClick={handleAnalyze}
      disabled={isAnalyzing}
    >
      {isAnalyzing ? 'Analyzing...' : 'Analyze canvas with ChatGPT'}
    </button>
  );
};

const Whiteboard = ({ onAnalysisComplete }) => {
  const components = {
    SharePanel: () => <AnalyzeCanvasButton onAnalysisComplete={onAnalysisComplete} />,
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Tldraw components={components} />
    </div>
  );
};

export default Whiteboard;