import React, { useState, useRef } from "react";
import ang from "../assets/characters/ang.png";
import hiro from "../assets/characters/hiro.png";
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

const characters = [
  { name: "Ang", src: ang },
  { name: "Hiro", src: hiro },
];

function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [showModal, setShowModal] = useState(false);

  const recognitionRef = useRef(null);

  const createRecognitionInstance = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let speechResult = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        speechResult += transcriptPart;
      }
      setTranscript(speechResult);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopRecognition();
    };

    recognition.onend = () => {
      if (isRecording) recognition.start();
    };

    return recognition;
  };

  const startRecognition = () => {
    recognitionRef.current = createRecognitionInstance();
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleMicrophoneClick = () => {
    isRecording ? stopRecognition() : startRecognition();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const selectCharacter = (character) => {
    setSelectedCharacter(character);
    closeModal();
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.leftPanel}>
          <div style={styles.whiteboard}>
            <Tldraw />
          </div>
        </div>
        <div style={styles.rightPanel}>
          <header style={styles.header}>Welcome to EduPal.ai</header>
          <div style={styles.interactionArea}>
            <button onClick={handleMicrophoneClick} style={styles.microphoneButton}>
              <div
                style={{
                  ...styles.microphoneCircle,
                  backgroundColor: isRecording ? "#ff4d4d" : "#f0f0f0",
                }}
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/microphone.png"
                  alt="Microphone Icon"
                  style={styles.microphoneIcon}
                />
              </div>
            </button>
            <div style={styles.microphoneText}>
              {isRecording ? "Listening..." : "Click to Talk"}
            </div>

            {transcript && (
              <div style={styles.transcriptBox}>
                <p>{transcript}</p>
              </div>
            )}

            <div style={styles.uploadContainer}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={styles.uploadButton}
              />
              {image && (
                <img src={image} alt="Uploaded" style={styles.previewImage} />
              )}
            </div>
          </div>

          <div style={styles.characterContainer}>
            <div style={styles.characterWrapper}>
              <img
                src={selectedCharacter.src}
                alt={selectedCharacter.name}
                style={styles.characterImage}
              />
            </div>
            <div>
              <button onClick={openModal} style={styles.changeCharacterButton}>
                Change Character
              </button>
            </div>

            {showModal && (
              <div style={styles.modal}>
                <h2>Select a Character</h2>
                {characters.map((char) => (
                  <div
                    key={char.name}
                    style={styles.characterOption}
                    onClick={() => selectCharacter(char)}
                  >
                    <p>{char.name}</p>
                  </div>
                ))}
                <button onClick={closeModal} style={styles.closeModalButton}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 50px)", // Adjust this value based on your navbar height
    width: "100vw",
  },
  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  leftPanel: {
    flex: "0 0 60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  whiteboard: {
    width: "95%",
    height: "95%",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  rightPanel: {
    flex: "0 0 40%",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  interactionArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  microphoneButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    marginBottom: "10px",
  },
  microphoneCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
  },
  microphoneIcon: {
    width: "40px",
    height: "40px",
  },
  microphoneText: {
    fontSize: "18px",
    marginTop: "10px",
    textAlign: "center",
  },
  transcriptBox: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginTop: "20px",
  },
  uploadContainer: {
    marginTop: "30px",
    textAlign: "center",
  },
  uploadButton: {
    marginBottom: "15px",
    cursor: "pointer",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "200px",
    objectFit: "contain",
    marginTop: "10px",
  },
  characterContainer: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  characterWrapper: {
    width: "200px",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
  },
  characterImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  changeCharacterButton: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "white",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  characterOption: {
    cursor: "pointer",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  },
  closeModalButton: {
    marginTop: "10px",
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#f0f0f0",
    color: "black",
  },
};

export default Home;