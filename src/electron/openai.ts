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

export async function aiCall(link: string, calltype: string): Promise<{ output_text: string } | undefined> {
    const html = await fetch(link).then((res: Response) => res.text());
    console.log(html);
    const mainText = await getMainTextFromHtml(html);
    let inputtext = "";
    if (calltype === "summarize") {
        inputtext = "please summarize the following article: " + mainText + "return just the summary.";
    } else if (calltype === "fact-check") {
        inputtext = "please fact check this article:" + mainText + "if the article is too current, respond with your best guess on if it is fake from how it is written, if you are able to fact check it, correct any mistakes you find, and return the full corrected article.";
    }

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
