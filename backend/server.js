const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const openai = new OpenAI();

// Routes
app.post('/analyze-whiteboard', async (req, res) => {
    try {
        const { base64Image, transcript } = req.body;
        console.log("TRANSCRIPT", transcript);

        if (!base64Image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
            {
                role: "user",
                content: [
                { type: "text", text: "Give me a short 2 sentence summary of the whiteboard. If you see an equation, please solve it. I want you to explain this as if it were a child, please be considerate of the child's level of understanding. remember do not go more than 2 setnences, and if you are talkign about equations do it in latex format." },
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