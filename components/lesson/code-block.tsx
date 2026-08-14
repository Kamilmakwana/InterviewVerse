"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const KEYWORDS =
  /\b(public|private|protected|internal|static|readonly|const|class|struct|record|interface|enum|void|async|await|Task|var|new|return|if|else|for|foreach|while|switch|case|break|continue|using|namespace|null|true|false|this|base|override|virtual|abstract|sealed|get|set|string|int|bool|double|decimal|long|float|object|byte|char|throw|try|catch|finally|yield|in|out|ref|params|select|from|where|join|group|orderby)\b/g;

/** Lightweight, dependency-free highlighter that looks premium enough. */
function highlight(code: string, language: string): string {
  const esc = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (language === "sql") {
    return esc.replace(
      /\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|GROUP|BY|ORDER|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|ALTER|DROP|PRIMARY|KEY|FOREIGN|REFERENCES|AND|OR|NOT|IN|EXISTS|AS|COUNT|SUM|AVG|MAX|MIN|DISTINCT|BEGIN|COMMIT|ROLLBACK|TRANSACTION|CASE|WHEN|THEN|ELSE|END|NULL|WITH|PARTITION)\b/gi,
      (m) => `<span class="tok-kw">${m}</span>`
    );
  }

  return esc
    .replace(/(\/\/[^\n]*)/g, '<span class="tok-cm">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="tok-str">$1</span>')
    .replace(KEYWORDS, '<span class="tok-kw">$&</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');
}

export function CodeBlock({
  code,
  language = "csharp",
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-[#0d1117] dark:bg-[#0b0e14]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-3 font-mono text-xs text-white/50">{language}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[0.82rem] leading-relaxed">
        <code
          className="font-mono text-slate-200"
          dangerouslySetInnerHTML={{ __html: highlight(code, language) }}
        />
      </pre>
      <style jsx>{`
        :global(.tok-kw) {
          color: #7c9cf7;
        }
        :global(.tok-str) {
          color: #7ee787;
        }
        :global(.tok-cm) {
          color: #7d8590;
          font-style: italic;
        }
        :global(.tok-num) {
          color: #f0a35e;
        }
      `}</style>
    </div>
  );
}
