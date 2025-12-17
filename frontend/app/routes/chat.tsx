import { useEffect, useRef, useState } from "react";
import { useFetcher, type ClientActionFunctionArgs } from "react-router";

/* ---------------- TYPES ---------------- */

interface Message {
  id: string;
  role: "user" | "assistant";
  message: string;
}

/* ---------------- ACTION (API CALL) ---------------- */

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const question = formData.get("message") as string;

  if (!question?.trim()) {
    return { reply: "" };
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (response.ok) {
      const data = await response.json();
      return { reply: data.answer };
    }
  } catch (error) {
    console.error("Chat API error:", error);
  }

  return { reply: "Sorry, something went wrong." };
}

/* ---------------- COMPONENT ---------------- */

export default function ChatPage() {
  const fetcher = useFetcher<{ reply: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Which demographic groups saw the largest employment gains last year?",
    "What evidence does the report provide regarding wage pressures in low-wage sectors?",
    "How have recent labour market developments contributed to inflation?",
  ];

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Submit handler (optimistic UI) */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || fetcher.state === "submitting") return;

    const userMessage = input;
    setInput("");

    // Optimistic user message
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        message: userMessage,
      },
    ]);

    fetcher.submit({ message: userMessage }, { method: "post" });
  };

  /* Handle assistant response */
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.reply) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          message: fetcher.data.reply,
        },
      ]);
    }
  }, [fetcher.state, fetcher.data]);

  const isEmpty = messages.length === 0;

  return (
    <div className="h-screen w-full bg-[#FAF9F7] flex items-center justify-center px-6">
      <div className="w-full max-w-3xl h-[92vh] bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">

        {/* ---------------- EMPTY STATE ---------------- */}
        {isEmpty && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-4xl font-semibold text-gray-900 mb-3">
              What can I help with?
            </h1>
            <p className="text-gray-600 max-w-xl mb-10">
              Ask questions, explore ideas, summarize content, or get instant insights.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-left px-6 py-4 rounded-2xl bg-[#F1EFEA] border border-transparent hover:border-indigo-400 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="text-gray-900">{q}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- MESSAGES ---------------- */}
        {!isEmpty && (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  {m.message}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {fetcher.state === "submitting" && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

        {/* ---------------- INPUT ---------------- */}
        <form onSubmit={handleSubmit} className="border-t px-6 py-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message AI…"
            className="flex-1 rounded-full border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 rounded-full bg-black text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
            Send
            </button>
        </form>
      </div>
    </div>
  );
}
