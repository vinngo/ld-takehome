"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SAMPLE_MARKDOWN } from "@/lib/sampleMarkdown";
import { HoverCaption } from "@/components/ui/fabula/hovercaption";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "./ui/button";

type MarkdownEditorProps = {
  premiumEnabled: boolean;
  summaryStyle: "short" | "detailed";
};

export default function MarkdownEditor({
  premiumEnabled,
  summaryStyle,
}: MarkdownEditorProps) {
  const [value, setValue] = useState(SAMPLE_MARKDOWN);
  const [engagementScore, setEngagementScore] = useState<number | null>(null);
  const [summaryError, setSummaryError] = useState<Error | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/summarize",
    streamProtocol: "text",
    fetch: async (url, options) => {
      const response = await fetch(url as string, options as RequestInit);
      const score = response.headers.get("X-Engagement-Score");
      if (score) setEngagementScore(Number(score));
      setSummaryError(null);
      return response;
    },
    onError: (err) => {
      setSummaryError(err);
    },
  });

  const handleSummarize = async () => {
    setEngagementScore(null);
    await complete(value, {
      body: { summaryStyle },
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 min-h-0 divide-x divide-gray-200 dark:divide-gray-700">
        <textarea
          className="w-1/2 resize-none p-4 font-mono text-sm focus:outline-none bg-white dark:bg-black text-gray-900 dark:text-gray-100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Markdown input"
          spellCheck={false}
        />
        <div className="prose prose-sm dark:prose-invert w-1/2 max-w-none overflow-y-auto p-4 bg-white dark:bg-black">
          <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black">
        <Button
          type="button"
          disabled={!premiumEnabled || isLoading}
          onClick={handleSummarize}
          onMouseEnter={
            !premiumEnabled
              ? (e) => setHoverPos({ x: e.clientX, y: e.clientY })
              : undefined
          }
          onMouseLeave={!premiumEnabled ? () => setHoverPos(null) : undefined}
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </Button>
        {hoverPos && (
          <HoverCaption
            caption="Upgrade to premium to use Summarize"
            initialX={hoverPos.x}
            initialY={hoverPos.y}
          />
        )}
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">
          {summaryStyle} mode
        </span>
      </div>
      {(completion || summaryError) && (
        <div className="prose prose-sm dark:prose-invert max-w-none border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-black p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-2 not-prose">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              AI Summary
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">
                {summaryStyle} variant
              </span>
              {engagementScore !== null && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Engagement:{" "}
                  <span className="font-medium text-indigo-600">
                    {engagementScore}/100
                  </span>
                </span>
              )}
            </div>
          </div>
          {summaryError ? (
            <p className="text-sm text-red-600">{summaryError.message}</p>
          ) : (
            <Markdown remarkPlugins={[remarkGfm]}>{completion}</Markdown>
          )}
        </div>
      )}
    </div>
  );
}
