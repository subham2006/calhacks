import React from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

const Whiteboard = () => {
  return (
    <div className="w-full h-screen flex justify-start items-center">
      <div className="ml-10 w-3/4 h-5/6 border border-gray-300 rounded-lg overflow-hidden">
        <Tldraw />
      </div>
    </div>
  );
};

export default Whiteboard;