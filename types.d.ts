type EventPayloadMapping = {
    aiCall: { output_text: string; } | Promise<{ output_text: string; } | undefined> | undefined;
    apiImageCall: { output_text: string; } | Promise<{ output_text: string; } | undefined> | undefined;
}

interface Window {
    electronAPI: {
      aiCall: (link: string, calltype: string) => { output_text: string; } | Promise<{ output_text: string; } | undefined> | undefined;
      apiImageCall: (imageBase64: string) => { output_text: string; } | Promise<{ output_text: string; } | undefined> | undefined;
      onScreenshotTakenSummary: (callback: (imageBase64: string) => void) => () => void;
      onScreenshotTakenFactCheck: (callback: (imageBase64: string) => void) => () => void;
    };
  }
