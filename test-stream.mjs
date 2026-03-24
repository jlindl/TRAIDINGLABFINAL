import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: []
});

console.log(Object.keys(result.__proto__));
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(result)));
