type EventPayloadMapping = {
    aiCall: Promise<{ output_text: string; } | undefined>;
    apiImageCall: Promise<{ output_text: string; } | undefined>;
    getApiKey: Promise<string>;
    setApiKey: void;
}

interface Window {
    electronAPI: {
      aiCall: (link: string, calltype: string) => Promise<{ output_text: string; } | undefined>;
      apiImageCall: (imageBase64: string) => Promise<{ output_text: string; } | undefined>;
      onScreenshotTakenSummary: (callback: (imageBase64: string) => void) => () => void;
      onScreenshotTakenFactCheck: (callback: (imageBase64: string) => void) => () => void;
      onLog: (callback: (message: string) => void) => () => void;
      getApiKey: () => Promise<string>;
      setApiKey: (apiKey: string) => void;
    };
  }
