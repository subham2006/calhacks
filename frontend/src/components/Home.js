import React, { useState, useEffect } from 'react';

function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize the Web Speech API
    if ('webkitSpeechRecognition' in window) {
      const newRecognition = new window.webkitSpeechRecognition();
      newRecognition.continuous = false; // Set to true if you want continuous listening
      newRecognition.interimResults = false;
      newRecognition.lang = 'en-US';

      // Handle speech results
      newRecognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        console.log('Transcript: ', speechResult);
        setTranscript(speechResult);
        setIsRecording(false);
      };

      newRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      setRecognition(newRecognition);
    } else {
      console.warn('Web Speech API is not supported in this browser.');
    }
  }, []);

  const handleMicrophoneClick = () => {
    if (recognition) {
      if (isRecording) {
        recognition.stop();
        setIsRecording(false);
      } else {
        recognition.start();
        setIsRecording(true);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to My App</h1>
      <button onClick={handleMicrophoneClick} style={styles.button}>
        <div style={styles.circle}>
          <img 
            src="https://img.icons8.com/ios-filled/50/microphone.png" 
            alt="Microphone Icon" 
          />
        </div>
      </button>
      <div style={styles.text}>{isRecording ? 'Listening...' : 'Click to Talk'}</div>
      {transcript && <div style={styles.transcript}>You said: {transcript}</div>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  header: {
    marginBottom: '20px',
  },
  button: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    marginBottom: '10px',
    padding: 0,
  },
  circle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: '18px',
  },
  transcript: {
    marginTop: '20px',
    fontSize: '16px',
    fontStyle: 'italic',
  },
};

export default Home;
