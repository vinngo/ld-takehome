"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SAMPLE_MARKDOWN } from "@/lib/sampleMarkdown";

export default function MarkdownEditor() {
  const [value, setValue] = useState(SAMPLE_MARKDOWN);

  return (
    <div className="flex h-screen divide-x divide-gray-200">
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
            p: (props) => <p {...props} className="text-gray-900 dark:text-gray-100" />,
            h1: (props) => <h1 {...props} className="text-gray-900 dark:text-gray-100" />,
            h2: (props) => <h2 {...props} className="text-gray-900 dark:text-gray-100" />,
            h3: (props) => <h3 {...props} className="text-gray-900 dark:text-gray-100" />,
            h4: (props) => <h4 {...props} className="text-gray-900 dark:text-gray-100" />,
            h5: (props) => <h5 {...props} className="text-gray-900 dark:text-gray-100" />,
            h6: (props) => <h6 {...props} className="text-gray-900 dark:text-gray-100" />,
            a: (props) => <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline" />,
            strong: (props) => <strong {...props} className="text-gray-900 dark:text-gray-100" />,
            em: (props) => <em {...props} className="text-gray-900 dark:text-gray-100" />,
            code: ({ children, className, ...props }) => {
              const isInline = !className;
              return isInline
                ? <code {...props} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded px-1 py-0.5 text-sm font-mono">{children}</code>
                : <code {...props} className={`${className ?? ""} text-gray-800 dark:text-gray-200`}>{children}</code>;
            },
            pre: (props) => <pre {...props} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded p-4 overflow-x-auto" />,
            blockquote: (props) => <blockquote {...props} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 text-gray-600 dark:text-gray-400 italic" />,
            ul: (props) => <ul {...props} className="text-gray-900 dark:text-gray-100 list-disc list-inside" />,
            ol: (props) => <ol {...props} className="text-gray-900 dark:text-gray-100 list-decimal list-inside" />,
            li: (props) => <li {...props} className="text-gray-900 dark:text-gray-100" />,
            hr: (props) => <hr {...props} className="border-gray-300 dark:border-gray-600" />,
            table: (props) => <table {...props} className="border-collapse w-full text-gray-900 dark:text-gray-100" />,
            th: (props) => <th {...props} className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />,
            td: (props) => <td {...props} className="border border-gray-300 dark:border-gray-600 px-4 py-2" />,
          }}
        >
          {value}
        </Markdown>
      </div>
    </div>
  );
}
