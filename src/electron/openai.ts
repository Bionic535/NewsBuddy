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
const OPENAI_KEY = process.env.OPENAI_API_KEY ?? process.env.OPENAI_KEY;
if (!OPENAI_KEY || OPENAI_KEY.trim() === "") {
  throw new Error("OpenAI API key not found. Set OPENAI_API_KEY or OPENAI_KEY in environment or include a .env in extraResources.");
}
function getOpenAIClient() {
  return new OpenAI({ apiKey: OPENAI_KEY });
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

export async function aiCall(link: string, calltype: string): Promise<{ output_text: string } | undefined> {
    const html = await fetch(link).then((res: Response) => res.text());
    const mainText = await getMainTextFromHtml(html);
    let inputtext = "";
    if (calltype === "summarize") {
        inputtext = "please summarize the following article: " + mainText + "return just the summary.";
    } else if (calltype === "fact-check") {
        inputtext = "please fact check this article:" + mainText + "if the article is too current, respond with your best guess on if it is fake from how it is written, if you are able to fact check it, correct any mistakes you find.";
    }
    console.log(inputtext)
    const client = getOpenAIClient();
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

export async function apiImageCall(imageBase64: string): Promise<{ output_text: string } | undefined> {
    console.log("inside apiImageCall");
    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
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

