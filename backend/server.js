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

        const prompt = `
Pretend that I am a young child learning math, and I am having a conversation with you. Here are some of the questions that I am asking you: "${transcript}". These questions refer to the math problems on the attached image. 

However, if what i am asking you is not realted to math, please respond like a normal human converstaion. the main point is that you seem like a real human teacher, so that you can relate to the student. The entire conversation does not need to be about math. instead. let the student guide where the conversation goes. however, if based on the transcript you can tell we have been off topic for some time ( 3-4 responses), please gently bring the student back to the topic of math.

Please teach/tutor me how to solve these problems. Try to refrain from giving the exact answer; instead, drop hints and lay out potential steps/approaches. Use analogies if needed, but do not reveal the full answer within a single response. 

Keep the response to less than 3 sentences.

Additionally, based on the language used in the last student's response, analyze and tell me what kind of emotion or state of mind you should use as a teacher to help me learn best. this is improve your tone of voice based on what the student is feeling at the time. 

Respond with the following JSON structure:

{
    "tutoringResponse": "Your helpful hints here. this can also not be related to math if the students response is not relating to math",
    "emotion": "The likely emotion, your options are "positivity:high", "surprise:high", or "curiosity:high"."
}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: prompt }
            ],
        });

        const content = response.choices[0].message.content;

        // Parse the JSON response from OpenAI
        const { tutoringResponse, emotion } = JSON.parse(content);

        res.json({
            chatgpt_response: tutoringResponse,
            emotion: emotion
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});