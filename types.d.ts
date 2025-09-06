type EventPayloadMapping = {
    aiCall: { output_text: string; } | Promise<{ output_text: string; } | undefined> | undefined;
}

interface Window {
    electronAPI: {
      aiCall: (link: string, calltype: string) => { output_text: string; } | Promise<{ output_text: string; } | undefined> | undefined;
    };
  }
