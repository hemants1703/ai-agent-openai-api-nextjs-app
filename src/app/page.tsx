"use client";

import { useActionState } from "react";
import { submitPrompt } from "@/features/actions";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Typewriter({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
    </div>
  );
}

export default function Home() {
  const [state, formAction, isPending] = useActionState(submitPrompt, null);

  return (
    <main className="min-h-screen font-mono p-4 sm:p-6 lg:p-8 flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center pb-4 border-b border-slate-800">
        <h1 className="text-lg font-bold text-cyan-400 tracking-widest">
          A.I. AGENT // PERSONAL ASSISTANT
        </h1>
        <div className="text-xs text-slate-500">
          STATUS: <span className="text-green-400">ONLINE</span>
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex-grow grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-4 min-h-0">
        {/* Left Panel: Input */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-400 mb-4 tracking-wider">
            [ PROMPT TERMINAL ]
          </h2>
          <form
            action={formAction}
            className="flex-grow flex flex-col space-y-4"
          >
            <div className="flex-grow">
              <textarea
                name="prompt"
                placeholder="Enter your query..."
                className="w-full h-full bg-transparent border border-slate-700 p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-transparent border border-cyan-400 text-cyan-400 font-bold py-2 px-4 hover:bg-cyan-400 hover:text-black active:scale-[0.99] active:opacity-80 transition-all duration-200"
              disabled={isPending}
            >
              {isPending ? "EXECUTING..." : "EXECUTE"}
            </button>
          </form>
        </div>

        {/* Right Panel: Output */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-400 mb-4 tracking-wider">
            [ AGENT RESPONSE ]
          </h2>
          <div className="flex-grow bg-slate-950/50 p-4 border border-slate-800 text-sm max-h-[500px] overflow-y-auto">
            {state?.error && (
              <div className="text-red-400">
                <p className="font-bold">[ ERROR ]</p>
                <p>{state.error}</p>
              </div>
            )}

            {state?.success && state.data && (
              <div>
                <p className="text-cyan-400 font-bold">[ RESPONSE DATA ]</p>
                <Typewriter text={state.data} />
              </div>
            )}

            {!state && !isPending && (
              <p className="text-slate-600 animate-pulse">Awaiting input...</p>
            )}

            {isPending && (
              <p className="text-slate-600 animate-pulse">
                Awaiting response from agent...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-slate-600 pt-4 mt-4 border-t border-slate-800">
        <p>AGENT-ID: ALPHA-818-C // POWERED BY OPENAI</p>
      </footer>
    </main>
  );
}
