type EventPayloadMapping = {
    ai_call: any;
}

interface Window {
    electron: {
        ai_call: () => Promise<any>;
    };
}