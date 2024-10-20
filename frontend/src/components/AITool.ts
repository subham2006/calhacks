import { SelectTool, exportToBlob, StateNode } from "tldraw";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

class AITool extends StateNode {
  static id = "sticker";

  override onEnter() {
    this.editor.setCursor({ type: "cross", rotation: 0 });
  }

  override onPointerDown() {
    this.extractImage();
  }

  extractImage = async () => {
    const shapeIds = this.editor.getCurrentPageShapeIds();
    if (shapeIds.size === 0) return alert("No shapes on the canvas");

    const blob = await exportToBlob({
      editor: this.editor,
      ids: [...shapeIds],
      format: "png",
      opts: { background: false },
    });

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    const base64Image = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What’s in this image?" },
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
      console.log(response.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  };
}

export default AITool;
