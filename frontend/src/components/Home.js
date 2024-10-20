import React, { useState, useRef } from "react";
import ang from "../assets/characters/ang.png";
import hiro from "../assets/characters/hiro.png";
import angBackground from "../assets/backgrounds/avatarBackground.jpg";
import hiroBackground from "../assets/backgrounds/baymaxBackground.jpg";
import Whiteboard from "./Whiteboard";
import "tldraw/tldraw.css";

const characters = [
  { name: "Ang", src: ang, background: angBackground },
  { name: "Hiro", src: hiro, background: hiroBackground },
];

function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(characters[1]);
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

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const selectCharacter = (character) => {
    setSelectedCharacter(character);
    closeModal();
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundImage: `url(${selectedCharacter.background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div style={styles.mainContent}>
        <div style={styles.leftPanel}>
          <div style={styles.whiteboardContainer}>
            <Whiteboard />
          </div>
        </div>
        <div style={styles.rightPanel}>
          <header style={styles.header}>Ask a Question!</header>
          <div style={styles.characterContainer}>
            <div style={styles.characterWrapper}>
              <img
                src={selectedCharacter.src}
                alt={selectedCharacter.name}
                style={styles.characterImage}
              />
            </div>
            <button onClick={openModal} style={styles.changeCharacterButton}>
              Change Character
            </button>
          </div>
          <div style={styles.interactionArea}>
            <button
              onClick={handleMicrophoneClick}
              style={styles.microphoneButton}
            >
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
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "95vh",
    width: "100vw", // Prevent scrolling
  },
  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  leftPanel: {
    flex: "0 0 60%", // Adjusted to fit the whole screen with rightPanel
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "transparent", // Make background transparent to show the container background
  },
  whiteboardContainer: {
    width: "100%",
    height: "100%", // Adjusted to fill the panel
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  rightPanel: {
    flex: "0 0 40%", // Adjusted to fit the whole screen with leftPanel
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    overflow: "hidden",
    backgroundPosition: "center",
    backgroundColor: "transparent", // Make background transparent to show the container background
    position: "relative", // Add this to make it a positioning context for the modal
  },
  header: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  characterContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  characterWrapper: {
    width: "400px",
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  characterImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  changeCharacterButton: {
    padding: "12px 24px",
    fontSize: "18px",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "white",
  },
  interactionArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
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
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
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