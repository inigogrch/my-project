import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    console.log("API route called");
    const { messages } = await req.json();
    console.log("Messages:", messages);
    
    if (!process.env.OPENAI_API_KEY) {
      console.error("No OpenAI API key found");
      return new Response("OpenAI API key not configured", { status: 500 });
    }

    // Clean messages to proper format for OpenAI
    const cleanMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));
    
    console.log("Clean messages:", cleanMessages);

    const result = streamText({
      model: openai("gpt-4o"),
      messages: cleanMessages,
    });

    console.log("Streaming response created");
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("API Error:", error);
    return new Response(`Error: ${error}`, { status: 500 });
  }
} 
