import React, { createContext, useState, useContext } from 'react';

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [aiResponse, setAIResponse] = useState('');

  return (
    <AIContext.Provider value={{ aiResponse, setAIResponse }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);