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

        if (!base64Image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
            {
                role: "user",
                content: [
                { type: "text", text: `Pretend that I am a young child learning math and I am having a conversation with you. Here are some of the questions that I am asking you: ${transcript}. These questions refer to the math problems on the attached image. Please teach / tutor me how to solve these problems. Try to refrain from giving me the exact answer and instead drop hints and lay out potential steps / approaches. Feel free to use analogies if you see fit. The answer to the problem should not be revealed within a single prompt. Please keep the response to less than 3 sentences.` },
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