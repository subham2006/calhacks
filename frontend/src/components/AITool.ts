import { exportToBlob, StateNode } from "tldraw";
import axios from "axios";

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
    if (shapeIds.size === 0) return alert("Nothing on the canvas");

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
      const response = await axios.post(
        "http://localhost:3001/analyze-whiteboard", // OpenAI API request is done on the server
        {
          base64Image: base64Image,
        }
      );

      console.log(response.data.chatgpt_response);
    } catch (error) {
      console.log(error);
    }
  };
}

export default AITool;
