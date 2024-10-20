// Whiteboard.tsx
import React, { useContext, useMemo } from "react";
import "tldraw/tldraw.css";
import AITool from "./AITool.ts";
import { AIContext } from './AIContext';
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
  TLStateNodeConstructor,
} from "tldraw";
import { useSyncDemo } from '@tldraw/sync';

const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
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

const Whiteboard: React.FC = () => {
  const { setAIResponse } = useContext(AIContext);
  const store = useSyncDemo({ roomId: 'my-unique-room-id' });

  const customTools = useMemo(() => {
    const ExtendedAITool = class extends AITool {
      constructor(editor: any) {
        super(editor, setAIResponse);
      }
    } as unknown as TLStateNodeConstructor;
    return [ExtendedAITool];
  }, [setAIResponse]);

  return (
    <div style={{ width: "100%", height: "100%", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <Tldraw
        tools={customTools}
        initialState="sticker"
        overrides={uiOverrides}
        components={components}
        assetUrls={customAssetUrls}
        store={store}
      />
    </div>
  );
};

export default Whiteboard;