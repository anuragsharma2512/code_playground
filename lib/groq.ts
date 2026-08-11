type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type GroqChatOptions = {
  messages: GroqMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

type GroqChatCompletion = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: {
    total_tokens?: number;
  };
};

const GROQ_CHAT_COMPLETIONS_URL =
  "https://api.groq.com/openai/v1/chat/completions";

export const DEFAULT_GROQ_MODEL =
  process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export async function createGroqChatCompletion({
  messages,
  model = DEFAULT_GROQ_MODEL,
  temperature = 0.7,
  maxTokens = 1000,
}: GroqChatOptions) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const isGptOssModel = model.startsWith("openai/gpt-oss-");
  const isQwenReasoningModel = model.startsWith("qwen/");

  const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      include_reasoning: false,
      ...(isGptOssModel ? { reasoning_effort: "low" } : {}),
      ...(isQwenReasoningModel ? { reasoning_effort: "none" } : {}),
    }),
  });

  const data = (await response.json()) as GroqChatCompletion & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(data.error?.message || `Groq API error: ${response.status}`);
  }

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No response from Groq model");
  }

  return {
    content: content.trim(),
    model,
    tokens: data.usage?.total_tokens,
  };
}
