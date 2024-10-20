import { useEditor, exportToBlob } from "tldraw";

export const useHandleExtractImage = () => {
  const editor = useEditor();

  return async () => {
    const shapeIds = editor.getCurrentPageShapeIds();
    if (shapeIds.size === 0) return alert("Nothing on the canvas");

    const blob = await exportToBlob({
      editor: editor,
      ids: [...shapeIds],
      format: "png",
      opts: { background: false },
    });

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    const base64Image = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
    });

    return base64Image;
  };
};
