import { createContext, useContext, useState } from "react";

type AiCallResponseContextType = {
    response: string;
    setResponse: (text: string) => void;
};

export const AiCallResponseContextType = createContext<AiCallResponseContextType | undefined>(undefined);

export function useAiCallResponse() {
    const ctx = useContext(AiCallResponseContextType);
    if (!ctx) {
        throw new Error("useAiCallResponse must be used within an AiCallResponseProvider");
    }
    return ctx;
}

export function AiCallResponseProvider({ children }: { children: React.ReactNode }) {
    const [response, setResponse] = useState("");
    return (
        <AiCallResponseContextType.Provider value={{ response, setResponse: setResponse }}>
            {children}
        </AiCallResponseContextType.Provider>
    );
}