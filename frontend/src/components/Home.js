import React, { useState, useRef } from "react";
import ang from "../assets/characters/ang.png";
import hiro from "../assets/characters/hiro.png";
import Cartesia from "@cartesia/cartesia-js";

// Replace with your Deepgram API key
const deepgramApiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
const cartesiaAPIKey = process.env.REACT_APP_CARTESIA_API_KEY;
const cartesia = new Cartesia({
  apiKey: cartesiaAPIKey, // Replace with your actual API key
});

// Characters array
const characters = [
  { name: "Ang", src: ang },
  { name: "Hiro", src: hiro },
];

// Character Voices Map
const characterVoices = {
  Ang: "a0e99841-438c-4a64-b679-ae501e7d6091", // Example voice ID for Ang
  Hiro: "03496517-369a-4db1-8236-3d3ae459ddf7", // Example voice ID for Hiro
};

function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [collectedTranscript, setCollectedTranscript] = useState(""); // Store segments here
  const [sentiment, setSentiment] = useState("neutral"); // Store sentiment
  const [sentimentScore, setSentimentScore] = useState(0); // Store sentiment score
  const [image, setImage] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [showModal, setShowModal] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Chat history array

  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null); // Store WebSocket reference

  const startDeepgramStream = async () => {
    const socket = new WebSocket(
      `wss://api.deepgram.com/v1/listen?punctuate=true&model=enhanced&sentiment=true`,
      ["token", deepgramApiKey]
    );

    socketRef.current = socket; // Store the socket

    socket.onopen = () => {
      console.log("Connected to Deepgram WebSocket!");
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start(250); // Send audio every 250ms

        mediaRecorderRef.current.ondataavailable = (event) => {
          socket.send(event.data); // Stream audio to Deepgram
        };
      });
    };

    socket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);

        const newSegment = data.channel?.alternatives?.[0]?.transcript || "";
        const newSentiment = data.sentiments?.average?.sentiment || "neutral";
        const newSentimentScore =
          data.sentiments?.average?.sentiment_score || 0;

        console.log(`Transcript Segment: ${newSegment}`);
        console.log(`Sentiment: ${newSentiment} (Score: ${newSentimentScore})`);

        // Accumulate transcript segments
        setCollectedTranscript((prev) => prev + " " + newSegment);

        // Save the latest sentiment values
        setSentiment(newSentiment);
        setSentimentScore(newSentimentScore);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    socket.onclose = () => console.log("WebSocket closed.");
    socket.onerror = (error) => console.error("WebSocket error:", error);

    setIsRecording(true);
  };

  const playTTS = async (text, character) => {
    const voiceId = characterVoices[character.name] || "default-voice-id"; // Fallback voice

    try {
      // Set up the WebSocket connection with the appropriate audio format
      const websocket = cartesia.tts.websocket({
        container: "raw",
        encoding: "pcm_f32le",
        sampleRate: 44100,
      });

      // Connect to the WebSocket
      await websocket.connect();

      // Send the TTS request with the selected character's voice
      const response = await websocket.send({
        model_id: "sonic-english", // Example model, adjust if necessary
        voice: {
          mode: "id",
          id: voiceId, // Use the voice ID from the character's map
        },
        transcript: text || "i am strong", // Default message if text is empty
      });

      // Extract the audio source from the response
      const { source } = response;

      // Create an AudioContext for playback
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const buffer = new Float32Array(source.durationToSampleCount(1));

      let audioData = [];

      // Read the audio stream and collect PCM data
      while (true) {
        const read = await source.read(buffer);
        audioData.push(...buffer.subarray(0, read));
        if (read < buffer.length) break; // No more audio to read
      }

      // Convert PCM data to AudioBuffer for playback
      const audioBuffer = audioContext.createBuffer(1, audioData.length, 44100);
      audioBuffer.getChannelData(0).set(audioData);

      // Create a buffer source for playback
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContext.destination);

      // Play the audio
      sourceNode.start();

      // Disconnect WebSocket after use
      websocket.disconnect();
    } catch (error) {
      console.error("Error playing TTS:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (socketRef.current) {
      socketRef.current.close();
    }

    // Add the collected transcript and sentiment to chat history
    if (collectedTranscript.trim()) {
      addToChatHistory(
        "user",
        collectedTranscript.trim(),
        sentiment,
        sentimentScore
      );
    }

    // Reset collected transcript
    setCollectedTranscript("");
    setIsRecording(false);

    playTTS("i am strong", selectedCharacter);
  };

  const addToChatHistory = (role, content, sentiment, sentimentScore) => {
    const newEntry = { role, content, sentiment, sentimentScore };
    setChatHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, newEntry];
      console.log("Updated Chat History:", updatedHistory); // Log the updated history
      return updatedHistory;
    });
  };

  const handleMicrophoneClick = () => {
    isRecording ? stopRecording() : startDeepgramStream();
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
          <button onClick={openModal} style={styles.changeCharacterButton}>
            Change Character
          </button>

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

        <div>
          <h3>Chat History:</h3>
          <ul>
            {chatHistory.map((entry, index) => (
              <li key={index}>
                <strong>{entry.role}:</strong> {entry.content}
                <br />
                Sentiment: {entry.sentiment} (Score:{" "}
                {entry.sentimentScore.toFixed(2)})
              </li>
            ))}
          </ul>
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
