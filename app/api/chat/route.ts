import { createGroqChatCompletion, DEFAULT_GROQ_MODEL } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
  model?: string;
}

async function generateAIResponse(messages: ChatMessage[], model?: string) {
  const systemPrompt = `You are a helpful AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice  
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. Use proper code formatting when showing examples.`;

  const fullMessages = [
    { role: "system" as const, content: systemPrompt },
    ...messages,
  ];

  try {
    return await createGroqChatCompletion({
      messages: fullMessages,
      model: model || DEFAULT_GROQ_MODEL,
      temperature: 0.7,
      maxTokens: 1000,
    });
  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, history = [], model } = body;

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate history format
    const validHistory = Array.isArray(history)
      ? history.filter(
          (msg) =>
            msg &&
            typeof msg === "object" &&
            typeof msg.role === "string" &&
            typeof msg.content === "string" &&
            ["user", "assistant"].includes(msg.role)
        )
      : [];

    const recentHistory = validHistory.slice(-10);

    const messages: ChatMessage[] = [
      ...recentHistory,
      { role: "user", content: message },
    ];

    //   Generate ai response

    const aiResponse = await generateAIResponse(messages, model);



    return NextResponse.json({
      response: aiResponse.content,
      model: aiResponse.model,
      tokens: aiResponse.tokens,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
