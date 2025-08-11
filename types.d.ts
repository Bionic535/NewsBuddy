type EventPayloadMapping = {
    ai_call: { output_text: string; } | undefined;
}

interface Window {
    electron: {
        ai_call: (functype: string, link: string) => Promise<{ output_text: string; } | undefined>;
    };
}
