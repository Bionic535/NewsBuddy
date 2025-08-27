type EventPayloadMapping = {
    ai_call: { output_text: string; } | undefined;
}

interface Window {
    electron: {
        ai_call: (link: string) => Promise<{ output_text: string; } | undefined>;
    };
}
