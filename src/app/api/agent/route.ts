import { NextRequest, NextResponse } from "next/server";
import { Agent, run, tool } from '@openai/agents';

export async function POST(request: NextRequest) {
    const { prompt } = await request.json();

    if (!prompt) {
        return NextResponse.json({ error: "Prompt is required for a response " });
    }

    const getUserLocation = tool({
        name: 'get_user_location',
        description: 'Get the location of the user',
        execute: async () => {
            const ip = await fetch("http://edns.ip-api.com/json");
            const data = await ip.json();
            console.log("IP: ", data);
            const userIp = data.dns.ip;

            const userLocation = await fetch(`http://ip-api.com/line/${userIp}`);
            const locationData = await userLocation.text();
            console.log("Location: ", locationData);

            return locationData;
        },
        parameters: {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: false,
        },
    });

    const agent = new Agent({
        name: "Personal Assistant",
        model: "gpt-4o-mini",
        instructions: "You are a personal assistant that can help with tasks and answer questions based on the user's IP address. You address the user as Sir. Remember to use proper grammar and punctuation with proper spacing and formatting in your response.",
        tools: [getUserLocation]
    });

    const result = await run(agent, prompt);

    console.log(result.finalOutput);

    return NextResponse.json({ aiAgentResponse: result, aiAgentFinalOutput: result.finalOutput });
}