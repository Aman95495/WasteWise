// components/MarkdownRenderer.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // for GitHub-flavored markdown
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';


export default function MarkdownRenderer({ content, format }) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ...(format === "code" && {
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  className="rounded-md p-4 my-2"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }),
          h1: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold my-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold my-3" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 my-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 my-2" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }
