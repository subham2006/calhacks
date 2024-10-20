const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const openai = new OpenAI();

// Routes
app.post("/analyze-and-speak", async (req, res) => {
  try {
    const { chatHistory } = req.body;

    if (
      !chatHistory ||
      !Array.isArray(chatHistory) ||
      chatHistory.length === 0
    ) {
      return res.status(400).json({ error: "No valid chat history provided" });
    }

    // 1. Prepare OpenAI messages from chatHistory
    const messages = chatHistory.flatMap((entry) => {
      // Flatten content into a single string
      const formattedContent = Array.isArray(entry.content)
        ? entry.content.flat(Infinity).join(" ")
        : entry.content;

      // Build the message block for text
      const textMessage = {
        role: "user",
        content: [
          {
            type: "text",
            text: formattedContent, // Flattened text content
          },
        ],
      };

      // Conditionally add the image if it exists
      const imageMessage = entry.whiteboardImage
        ? {
            role: entry.role,
            content: [
              {
                type: "image_url",
                image_url: { url: entry.whiteboardImage }, // Image URL or Base64 string
              },
            ],
          }
        : null; // If no image, return null

      // Return both text and image messages (if image exists)
      return imageMessage ? [textMessage, imageMessage] : [textMessage];
    });

    // 2. Make the OpenAI API call with the flattened messages
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    // 3. Return the OpenAI response
    res.json({ chatgpt_response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error processing OpenAI request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
