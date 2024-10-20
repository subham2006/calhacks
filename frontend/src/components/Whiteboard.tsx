import React from "react";
import "tldraw/tldraw.css";
import AITool from "./AITool.ts";
import {
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TLUiAssetUrlOverrides,
  TLUiOverrides,
  Tldraw,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
} from "tldraw";
import { useSyncDemo } from '@tldraw/sync'; // Import the sync hook

const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    // Create a tool item in the ui's context.
    tools.sticker = {
      id: "sticker",
      icon: "heart-icon",
      label: "Sticker",
      kbd: "s",
      onSelect: () => {
        editor.setCurrentTool("sticker");
      },
    };
    return tools;
  },
};

const components: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools();
    const isStickerSelected = useIsToolSelected(tools["sticker"]);
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem
          {...tools["sticker"]}
          isSelected={isStickerSelected}
        />
        <DefaultToolbarContent />
      </DefaultToolbar>
    );
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools();
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <DefaultKeyboardShortcutsDialogContent />
        {/* Ideally, we'd interleave this into the tools group */}
        <TldrawUiMenuItem {...tools["sticker"]} />
      </DefaultKeyboardShortcutsDialog>
    );
  },
};

export const customAssetUrls: TLUiAssetUrlOverrides = {
  icons: {
    "heart-icon": "https://emojicdn.elk.sh/🟰",
  },
};

const customTools = [AITool];
const Whiteboard = () => {
  const store = useSyncDemo({ roomId: 'my-unique-room-id' }); // Initialize the sync store

  return (
    <div style={{ width: "100%", height: "100%", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <Tldraw
        tools={customTools}
        initialState="sticker"
        overrides={uiOverrides}
        components={components}
        assetUrls={customAssetUrls}
        store={store} // Pass the store to Tldraw for collaboration
        style={{ width: "100%", height: "100%" }} // Ensure Tldraw takes full width and height
      />
    </div>
  );
};

export default Whiteboard;
