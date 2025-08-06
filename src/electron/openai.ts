import 'dotenv/config';
import OpenAI from "openai";

export async function ai_call() {
    const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    });
    const response = await client.responses.create({
        model: "gpt-4.1",
        input: "Write a one-sentence bedtime story about a unicorn.",
    });
    return {
        response
    }
}

