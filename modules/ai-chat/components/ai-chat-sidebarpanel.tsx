"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Bot,
  Brain,
  Code,
  Copy,
  Cpu,
  Download,
  Filter,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  id: string;
  timestamp: Date;
  type?: "chat" | "code_review" | "suggestion" | "error_fix" | "optimization";
  tokens?: number;
  model?: string;
}

interface AIChatSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const modeOptions = [
  { value: "chat", label: "Chat", icon: MessageSquare },
  { value: "review", label: "Review", icon: Code },
  { value: "fix", label: "Fix", icon: RefreshCw },
  { value: "optimize", label: "Optimize", icon: Zap },
] as const;

const quickPrompts = [
  "Review this component for bugs",
  "Explain this file in simple terms",
  "Find performance issues",
  "Fix this TypeScript error",
  "Improve error handling",
  "Suggest a cleaner refactor",
];

const MessageTypeIndicator: React.FC<{
  type?: string;
  model?: string;
  tokens?: number;
}> = ({ type, model, tokens }) => {
  const getTypeConfig = (messageType?: string) => {
    switch (messageType) {
      case "code_review":
        return { icon: Code, color: "text-teal-300", label: "Code Review" };
      case "suggestion":
        return { icon: Sparkles, color: "text-amber-300", label: "Suggestion" };
      case "error_fix":
        return { icon: RefreshCw, color: "text-red-300", label: "Error Fix" };
      case "optimization":
        return { icon: Zap, color: "text-amber-300", label: "Optimization" };
      default:
        return { icon: MessageSquare, color: "text-teal-300", label: "Chat" };
    }
  };

  const config = getTypeConfig(type);
  const Icon = config.icon;

  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3.5 w-3.5", config.color)} />
        <span className={cn("text-xs font-semibold", config.color)}>
          {config.label}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {model && <span>{model}</span>}
        {tokens && <span>{tokens} tokens</span>}
      </div>
    </div>
  );
};

export const AIChatSidePanel: React.FC<AIChatSidePanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<
    "chat" | "review" | "fix" | "optimize"
  >("chat");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [autoSave, setAutoSave] = useState(true);
  const [streamResponse, setStreamResponse] = useState(true);
  const [model, setModel] = useState<string>("openai/gpt-oss-20b");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  const getChatModePrompt = (mode: string, content: string) => {
    switch (mode) {
      case "review":
        return `Please review this code and provide detailed suggestions for improvement, including performance, security, and best practices:\n\n**Request:** ${content}`;
      case "fix":
        return `Please help fix issues in this code, including bugs, errors, and potential problems:\n\n**Problem:** ${content}`;
      case "optimize":
        return `Please analyze this code for performance optimizations and suggest improvements:\n\n**Code to optimize:** ${content}`;
      default:
        return content;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const messageType =
      chatMode === "chat"
        ? "chat"
        : chatMode === "review"
        ? "code_review"
        : chatMode === "fix"
        ? "error_fix"
        : "optimization";

    const newMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      id: Date.now().toString(),
      type: messageType,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const contextualMessage = getChatModePrompt(chatMode, input.trim());

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: contextualMessage,
          history: messages.slice(-10).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          stream: streamResponse,
          mode: chatMode,
          model,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
            id: Date.now().toString(),
            type: messageType,
            tokens: data.tokens,
            model: data.model || model,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I encountered an error while processing your request. Please try again.",
            timestamp: new Date(),
            id: Date.now().toString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting to Groq right now. Please check that your API key is configured and try again.",
          timestamp: new Date(),
          id: Date.now().toString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportChat = () => {
    const chatData = {
      messages,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredMessages = messages
    .filter((msg) => {
      if (filterType === "all") return true;
      return msg.type === filterType;
    })
    .filter((msg) => {
      if (!searchTerm) return true;
      return msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const loadingText =
    chatMode === "review"
      ? "Reviewing your code with Groq..."
      : chatMode === "fix"
      ? "Tracing the issue and drafting a fix..."
      : chatMode === "optimize"
      ? "Looking for performance improvements..."
      : "Thinking through your code question...";

  return (
    <TooltipProvider>
      <>
        <div
          className={cn(
            "fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={onClose}
        />

        <aside
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full w-full max-w-[31rem] flex-col overflow-hidden border-l border-white/10 bg-[#080d14] text-zinc-100 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out sm:w-[31rem]",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(20,184,166,0.18),transparent_28%),radial-gradient(circle_at_88%_22%,rgba(239,63,63,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-size:36px_36px] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />

          <header className="relative z-10 shrink-0 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-teal-400/30 bg-white/10 shadow-lg shadow-teal-500/10">
                  <Image src="/logo.svg" alt="CodeNova logo" width={28} height={28} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">
                      CodeNova Copilot
                    </h2>
                    <span className="rounded-full border border-teal-400/30 bg-teal-400/10 px-2 py-0.5 text-xs font-medium text-teal-200">
                      Groq
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                    <Cpu className="h-3.5 w-3.5 text-teal-300" />
                    <span className="truncate">{model}</span>
                    <span>{messages.length} messages</span>
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-zinc-300 xl:flex">
                <span className="h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_16px_rgba(45,212,191,0.9)]" />
                Groq model
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:bg-white/10 hover:text-white"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    >
                      Auto-save conversations
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={streamResponse}
                      onCheckedChange={setStreamResponse}
                    >
                      Stream responses
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={exportChat}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMessages([])}>
                      Clear All Messages
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs
              value={chatMode}
              onValueChange={(value) => setChatMode(value as typeof chatMode)}
              className="px-4"
            >
              <div className="mb-4 flex flex-col gap-3">
                <TabsList className="grid h-auto w-full grid-cols-4 gap-1 rounded-lg border border-white/10 bg-white/[0.06] p-1">
                  {modeOptions.map((option) => (
                    <TabsTrigger
                      key={option.value}
                      value={option.value}
                      className="flex h-9 items-center gap-1.5 rounded-md text-xs text-zinc-400 data-[state=active]:bg-teal-300 data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
                    >
                      <option.icon className="h-3.5 w-3.5" />
                      {option.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-zinc-400">
                    <span>Model</span>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="bg-transparent text-zinc-100 outline-none"
                    >
                      <option value="openai/gpt-oss-20b">openai/gpt-oss-20b</option>
                      <option value="openai/gpt-oss-120b">openai/gpt-oss-120b</option>
                      <option value="qwen/qwen3.6-27b">qwen/qwen3.6-27b</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <Input
                      placeholder="Search messages"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-10 w-full border-white/10 bg-white/[0.06] pl-9 text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 border border-white/10 bg-white/[0.06] p-0 text-zinc-300 hover:bg-white/10 hover:text-white"
                      >
                        <Filter className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setFilterType("all")}>
                        All Messages
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("chat")}>
                        Chat Only
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("code_review")}>
                        Code Reviews
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("error_fix")}>
                        Error Fixes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("optimization")}>
                        Optimizations
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Tabs>
          </header>

          <main className="relative z-10 flex-1 overflow-y-auto">
            <div className="flex min-h-full w-full flex-col px-4 py-5">
              {filteredMessages.length === 0 && !isLoading && (
                <div className="my-auto flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 shadow-lg shadow-teal-500/10">
                    <Brain className="h-8 w-8 text-teal-200" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    Ask Groq about your code
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400">
                    Paste code, ask for a review, describe an error, or request a cleaner implementation.
                  </p>
                  <div className="mt-7 grid w-full grid-cols-1 gap-2">
                    {quickPrompts.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-white"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-start gap-4 group",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10">
                        <Bot className="h-5 w-5 text-teal-200" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[84%] rounded-lg shadow-xl",
                        msg.role === "user"
                          ? "rounded-br-sm bg-linear-to-br from-[#ef3f3f] to-[#c92845] p-4 text-white shadow-red-950/20"
                          : "rounded-bl-sm border border-white/10 bg-slate-950/72 p-5 text-zinc-100 shadow-black/30 backdrop-blur-xl",
                      )}
                    >
                      {msg.role === "assistant" && (
                        <MessageTypeIndicator
                          type={msg.type}
                          model={msg.model}
                          tokens={msg.tokens}
                        />
                      )}

                      <div className="prose prose-invert prose-sm max-w-none prose-pre:m-0 prose-pre:bg-transparent">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            code: ({
                              children,
                              className,
                              inline,
                            }: {
                              children?: React.ReactNode;
                              className?: string;
                              inline?: boolean;
                            }) => {
                              if (inline) {
                                return (
                                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-teal-100">
                                    {children}
                                  </code>
                                );
                              }

                              return (
                                <div className="my-4 overflow-hidden rounded-lg border border-white/10 bg-black/45">
                                  <pre className="overflow-x-auto p-4 text-sm text-zinc-100">
                                    <code className={className}>{children}</code>
                                  </pre>
                                </div>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <div className="text-xs text-zinc-500">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(msg.content)}
                            className="h-7 w-7 p-0 text-zinc-400 hover:bg-white/10 hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setInput(msg.content)}
                            className="h-7 w-7 p-0 text-zinc-400 hover:bg-white/10 hover:text-white"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {msg.role === "user" && (
                      <Avatar className="mt-1 h-10 w-10 shrink-0 border border-white/10 bg-white/10">
                        <AvatarFallback className="bg-white/10 text-zinc-100">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10">
                      <Brain className="h-5 w-5 text-teal-200" />
                    </div>
                    <div className="flex items-center gap-3 rounded-lg rounded-bl-sm border border-white/10 bg-slate-950/72 p-5 shadow-xl shadow-black/30 backdrop-blur-xl">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-300" />
                      <span className="text-sm text-zinc-300">{loadingText}</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-1" />
              </div>
            </div>
          </main>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative z-10 shrink-0 border-t border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl"
          >
            <div className="flex items-end gap-3">
              <div className="relative flex-1">
                <Textarea
                  placeholder={
                    chatMode === "chat"
                      ? "Ask about your code or paste a snippet..."
                      : chatMode === "review"
                      ? "Paste code or describe what to review..."
                      : chatMode === "fix"
                      ? "Describe the issue or paste the error..."
                      : "Paste code you want optimized..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="min-h-12 max-h-36 resize-none rounded-lg border-white/10 bg-white/[0.06] pr-24 text-zinc-100 placeholder:text-zinc-500 focus:border-teal-400/70 focus:ring-teal-400/20"
                  rows={1}
                />
                <kbd className="absolute bottom-3 right-3 hidden rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-zinc-500 sm:inline-block">
                  Ctrl Enter
                </kbd>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-12 rounded-lg bg-[#ef3f3f] px-5 text-white shadow-lg shadow-red-500/20 hover:bg-[#ef3f3f]/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </aside>
      </>
    </TooltipProvider>
  );
};
