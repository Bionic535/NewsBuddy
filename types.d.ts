type EventPayloadMapping = {
    ai_call: { output_text: string; } | undefined;
}

interface Window {
    electron: {
        ai_call: () => Promise<{ output_text: string; } | undefined>;
    };
}
