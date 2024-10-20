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
  return (
    <div className="w-full h-screen flex justify-start items-center">
      <div className="ml-10 w-3/4 h-5/6 border border-gray-300 rounded-lg overflow-hidden">
        <Tldraw
          tools={customTools}
          initialState="sticker"
          overrides={uiOverrides}
          components={components}
          assetUrls={customAssetUrls}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
