const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const openai = new OpenAI();

// Routes
app.post('/analyze-whiteboard', async (req, res) => {
    try {
        const { base64Image } = req.body;

        if (!base64Image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
            {
                role: "user",
                content: [
                { type: "text", text: "What’s in this image? If you see an equation, please solve it." },
                {
                    type: "image_url",
                    image_url: {
                    url: base64Image,
                    },
                },
                ],
            },
            ],
        });
          
        res.json({"chatgpt_response" : response.choices[0].message.content});

    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});