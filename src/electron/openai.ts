import 'dotenv/config';
import OpenAI from "openai";

export async function ai_call(functype: string, link: string): Promise<{ output_text: string } | undefined> {
    
    let inputtext = "say error";
    if (functype === "S") {
        inputtext = "please summarize the following article: " + link;
    }
    else if (functype === "C") {
        inputtext = "please fact check the following article: " + link;
    }
    console.log(functype)
    console.log(link)
    const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    });
    const response = await client.responses.create({
        model: "gpt-5",
        input: inputtext,
    });
    return {
        output_text: response.output_text
    }
}
