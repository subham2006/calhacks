import React from 'react';
import { exportToBlob, Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';

const ExportCanvasButton = () => {
  const editor = useEditor();
  return (
    <button
      style={{ pointerEvents: 'all', fontSize: 18, backgroundColor: 'thistle' }}
      onClick={async () => {
        const shapeIds = editor.getCurrentPageShapeIds();
        if (shapeIds.size === 0) return alert('No shapes on the canvas');
        const blob = await exportToBlob({
          editor,
          ids: [...shapeIds],
          format: 'png',
          opts: { background: false },
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'every-shape-on-the-canvas.jpg';
        link.click();
      }}
    >
      Export canvas as image
    </button>
  );
};

const Whiteboard = () => {
  const components = {
    SharePanel: ExportCanvasButton,
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Tldraw components={components} />
    </div>
  );
};

export default Whiteboard;