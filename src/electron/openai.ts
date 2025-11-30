import OpenAI from "openai";
import fetch from "node-fetch";
import type { Response } from "node-fetch";
import { load } from "cheerio";
import dotenv from "dotenv";
import path from "path";
import { app } from "electron";
import fs from "fs";

// load .env (development or packaged)
const devEnv = path.resolve(process.cwd(), ".env");
const packagedCandidates = [
  path.join(process.resourcesPath || process.cwd(), ".env"),
  // some packagers may place extra resources in resources/app
  path.join(process.resourcesPath || process.cwd(), "app", ".env"),
];
let envPath = devEnv;
if (app && app.isPackaged) {
  const found = packagedCandidates.find(p => fs.existsSync(p));
  envPath = found ?? packagedCandidates[0];
}
console.log("Loading .env from:", envPath, "exists:", fs.existsSync(envPath));
dotenv.config({ path: envPath });

// get key and helper
function getOpenAIClient(apiKey?: string) {
  const key = apiKey || process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!key || key.trim() === "") {
    throw new Error("OpenAI API key not found. Please set it in the settings or configure OPENAI_API_KEY in your environment.");
  }
  return new OpenAI({ apiKey: key });
}

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

export async function aiCall(link: string, calltype: string, apiKey?: string): Promise<{ output_text: string } | undefined> {
    const html = await fetch(link).then((res: Response) => res.text());
    const mainText = await getMainTextFromHtml(html);
    let inputtext = "";
    if (calltype === "summarize") {
        inputtext = `
        please summarize the following article: ${mainText}.
        please keep the length of the summary to around 200 words, if necessary you can go up to 400 words.
        please return just the given summary without any additional commentary.
        `;
    } else if (calltype === "fact-check") {
        inputtext = `
        please fact check this article: ${mainText} if the article is too current, respond with your best guess on if it is fake from how it is written, if you are able to fact check it, correct any mistakes you find.
        keep the response to under 300 words.
        please return just the fact-checked article without any additional commentary.
        if there are no factual inaccuracies, respond with "No inaccuracies found.".
        Only correct things you know 100% to be false, do not discuss things you are unsure about.
        `;
    }
    console.log(inputtext)
    const client = getOpenAIClient(apiKey);
    const response = await client.chat.completions.create({
        model: "gpt-5",
        messages: [{
            role: "user",
            content: inputtext,
        }],
    });

    const content = response.choices[0].message.content;
    if (content) {
        return {
            output_text: content
        };
    }
    return undefined;
}

export async function apiImageCall(imageBase64: string, apiKey?: string): Promise<{ output_text: string } | undefined> {
    console.log("inside apiImageCall");
    const openai = getOpenAIClient(apiKey);

    const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "what is the link to the page showing, just give the full link, if you can't find the link just return no" },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${imageBase64}`
                        },
                    },
                ],
            },
        ],
    });

    console.log(response.choices[0].message.content);
    const content = response.choices[0].message.content;
    if (content) {
        return {
            output_text: content
        };
    }
    return undefined;
}

