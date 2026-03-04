"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SAMPLE_MARKDOWN } from "@/lib/sampleMarkdown";
import { HoverCaption } from "@/components/ui/fabula/hovercaption";
import { useCompletion } from "@ai-sdk/react";

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
      <div className="flex flex-1 min-h-0 divide-x divide-gray-200">
        <textarea
          className="w-1/2 resize-none p-4 font-mono text-sm focus:outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Markdown input"
          spellCheck={false}
        />
        <div className="prose prose-sm w-1/2 max-w-none overflow-y-auto p-4">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: (props) => (
                <p {...props} className="text-gray-900 dark:text-gray-100" />
              ),
              h1: (props) => (
                <h1 {...props} className="text-gray-900 dark:text-gray-100" />
              ),
              h2: (props) => (
                <h2 {...props} className="text-gray-900 dark:text-gray-100" />
              ),
              h3: (props) => (
                <h3 {...props} className="text-gray-900 dark:text-gray-100" />
              ),
              h4: (props) => (
                <h4 {...props} className="text-gray-900 dark:text-gray-100" />
              ),
              h5: (props) => (
                <h5 {...props} className="text-gray-900 dark:text-gray-100" />
              ),
              h6: (props) => (
                <h6 {...props} className="text-gray-900 dark:text-gray-100" />
              ),
              a: (props) => (
                <a
                  {...props}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                />
              ),
              strong: (props) => (
                <strong
                  {...props}
                  className="text-gray-900 dark:text-gray-100"
                />
              ),
              em: (props) => (
                <em {...props} className="text-gray-900 dark:text-gray-100" />
              ),
              code: ({ children, className, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code
                    {...props}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded px-1 py-0.5 text-sm font-mono"
                  >
                    {children}
                  </code>
                ) : (
                  <code
                    {...props}
                    className={`${className ?? ""} text-gray-800 dark:text-gray-200`}
                  >
                    {children}
                  </code>
                );
              },
              pre: (props) => (
                <pre
                  {...props}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded p-4 overflow-x-auto"
                />
              ),
              blockquote: (props) => (
                <blockquote
                  {...props}
                  className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 text-gray-600 dark:text-gray-400 italic"
                />
              ),
              ul: (props) => (
                <ul
                  {...props}
                  className="text-gray-900 dark:text-gray-100 list-disc list-inside"
                />
              ),
              ol: (props) => (
                <ol
                  {...props}
                  className="text-gray-900 dark:text-gray-100 list-decimal list-inside"
                />
              ),
              li: (props) => (
                <li {...props} className="text-gray-900 dark:text-gray-100" />
              ),
              hr: (props) => (
                <hr
                  {...props}
                  className="border-gray-300 dark:border-gray-600"
                />
              ),
              table: (props) => (
                <table
                  {...props}
                  className="border-collapse w-full text-gray-900 dark:text-gray-100"
                />
              ),
              th: (props) => (
                <th
                  {...props}
                  className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              ),
              td: (props) => (
                <td
                  {...props}
                  className="border border-gray-300 dark:border-gray-600 px-4 py-2"
                />
              ),
            }}
          >
            {value}
          </Markdown>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 p-3 border-t border-gray-200 bg-gray-50">
        <button
          type="button"
          disabled={!premiumEnabled || isLoading}
          className={
            premiumEnabled && !isLoading
              ? "rounded px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              : "rounded px-4 py-2 text-sm font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
          }
          onClick={handleSummarize}
          onMouseEnter={
            !premiumEnabled
              ? (e) => setHoverPos({ x: e.clientX, y: e.clientY })
              : undefined
          }
          onMouseLeave={!premiumEnabled ? () => setHoverPos(null) : undefined}
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </button>
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
        <div className="border-t border-gray-200 bg-white p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              AI Summary
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">
                {summaryStyle} variant
              </span>
              {engagementScore !== null && (
                <span className="text-xs text-gray-500">
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
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {completion}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
