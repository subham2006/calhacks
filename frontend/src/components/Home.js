import React, { useState, useEffect, useRef, Image } from "react";
import ang from "../assets/characters/ang.png";
import hiro from "../assets/characters/hiro.png";

const characters = [
  { name: "Ang", src: ang },
  { name: "Hiro", src: hiro },
];

function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]); // Default character
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
      <header style={styles.header}>Welcome to EduPal.ai</header>
      <div style={styles.content}>
        <button onClick={handleMicrophoneClick} style={styles.button}>
          <div
            style={{
              ...styles.circle,
              backgroundColor: isRecording ? "#ff4d4d" : "#f0f0f0",
            }}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/microphone.png"
              alt="Microphone Icon"
            />
          </div>
        </button>
        <div style={styles.text}>
          {isRecording ? "Listening..." : "Click to Talk"}
        </div>

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
          {image && (
            <img src={image} alt="Uploaded" style={styles.previewImage} />
          )}
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
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    position: "relative", // Allows absolute positioning for character
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "20px 0",
    position: "absolute",
    top: "20px",
    textAlign: "center",
    width: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  characterContainer: {
    position: "absolute",
    right: "20px", // Push character to the right
    top: "80px", // Start just below the header
    bottom: "85px", // Align with the "Choose File" button
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
  },
  characterWrapper: {
    width: "250px", // Standardize width for all characters
    height: "400px", // Standardize height for all characters
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Ensure content stays within the box
    backgroundColor: "#f5f5f5", // Optional background for consistency
    borderRadius: "12px", // Optional rounded corners
  },
  characterImage: {
    width: "100%", // Ensure it fills the width of the container
    height: "100%", // Ensure it fills the height of the container
    objectFit: "contain", // Preserve aspect ratio without distortion
  },
  changeCharacterButton: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "grey",
    color: "white",
  },
  button: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    marginBottom: "10px",
    padding: 0,
    color: "grey",
  },
  circle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
  },
  text: {
    fontSize: "18px",
    marginTop: "10px",
  },
  transcriptBox: {
    marginTop: "20px",
    width: "80%",
    maxWidth: "500px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
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
    maxWidth: "300px",
    maxHeight: "300px",
    objectFit: "contain",
    marginTop: "10px",
  },
};

export default Home;
