import React, { useState, useEffect } from 'react';

function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const newRecognition = new window.webkitSpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = 'en-US';

      newRecognition.onresult = (event) => {
        const speechResult = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        console.log('Transcript: ', speechResult);
        setTranscript(speechResult);
      };

      newRecognition.onend = () => {
        if (isRecording) {
          newRecognition.start();
        }
      };

      newRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      setRecognition(newRecognition);
    } else {
      console.warn('Web Speech API is not supported in this browser.');
    }
  }, [isRecording]);

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
          <div
            style={{
              ...styles.circle,
              backgroundColor: isRecording ? '#ff4d4d' : '#f0f0f0',
            }}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/microphone.png"
              alt="Microphone Icon"
            />
          </div>
        </button>
        <div style={styles.text}>{isRecording ? 'Listening...' : 'Click to Talk'}</div>

        {transcript && (
          <div style={styles.transcriptBox}>
            <p style={styles.transcriptText}>{transcript}</p>
          </div>
        )}

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
  },
  text: {
    fontSize: '18px',
    marginTop: '10px',
  },
  transcriptBox: {
    marginTop: '20px',
    width: '80%',
    maxWidth: '500px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  transcriptText: {
    fontSize: '16px',
    fontStyle: 'italic',
    margin: 0,
    color: '#333',
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
