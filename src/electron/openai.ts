import 'dotenv/config';
import OpenAI from "openai";
import fetch from "node-fetch";
import type { Response } from "node-fetch";
import { load } from "cheerio";

export async function getMainTextFromHtml(html: string): Promise<string> {
    const $ = load(html);
    // Try to select <main>, <article>, or fallback to <body>
    let mainText = $("main").text().trim();
    if (!mainText) {
        mainText = $("article").text().trim();
    }
    if (!mainText) {
        mainText = $("body").text().trim();
    }
    return mainText;
}

export async function ai_call(functype: string, link: string): Promise<{ output_text: string } | undefined> {
    const html = await fetch(link).then((res: Response) => res.text());
    console.log(html);
    const mainText = await getMainTextFromHtml(html);
    let inputtext = "say error";
    if (functype === "S") {
        inputtext = "please summarize the following article: " + mainText;
    }
    else if (functype === "C") {
        inputtext = "please fact check the following article: " + mainText;
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
