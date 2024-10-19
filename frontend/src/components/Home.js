import React, { useState, useEffect } from 'react';

function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const newRecognition = new window.webkitSpeechRecognition();
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      newRecognition.lang = 'en-US';

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Welcome to EduPal.ai</header>
      <div style={styles.content}>
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

        <div style={styles.uploadContainer}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={styles.uploadButton} 
          />
          {image && <img src={image} alt="Uploaded" style={styles.previewImage} />}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100vh',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '20px 0',
    position: 'absolute',
    top: '20px',
    textAlign: 'center',
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
  uploadContainer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  uploadButton: {
    marginBottom: '15px',
    cursor: 'pointer',
  },
  previewImage: {
    maxWidth: '300px',
    maxHeight: '300px',
    objectFit: 'contain',
    marginTop: '10px',
  },
};

export default Home;
