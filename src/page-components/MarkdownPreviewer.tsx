"use client";

import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { parseMarkdown, wordCount, readTime, SAMPLE_MARKDOWN } from "@/lib/tools/markdown";
import { Copy, Check, List } from "lucide-react";

export default function MarkdownPreviewerPage() {
  const [input, setInput] = useLocalStorage("devforge-md-input", "");
  const debounced = useDebounce(input, 150);
  const [copied, setCopied] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const html = debounced ? parseMarkdown(debounced) : "";

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Extract headings for outline
  const headings = debounced
    .split("\n")
    .filter(line => /^#{1,6}\s/.test(line))
    .map(line => {
      const match = line.match(/^(#{1,6})\s+(.+)/);
      if (!match) return null;
      return { level: match[1].length, text: match[2] };
    })
    .filter(Boolean) as { level: number; text: string }[];

  return (
    <ToolLayout
      title="Markdown Previewer & Editor Online"
      slug="markdown-previewer"
      description="Live markdown editor with instant preview. Convert markdown to HTML, heading outline, word count — free, no signup."
      keywords={["markdown previewer online", "markdown to html", "live markdown editor online"]}
      howToUse={["Type or paste Markdown into the left editor panel.", "See the rendered preview update in real-time on the right.", "Copy the generated HTML or use the sample to explore syntax."]}
      whatIs={{ title: "What is Markdown?", content: "Markdown is a lightweight markup language created by John Gruber that lets you write formatted text using plain text syntax. Headings are marked with # symbols, bold with **, italic with *, and code with backticks. Markdown is used everywhere — GitHub READMEs, documentation sites, blogs, Notion, Slack, and countless other platforms. Our markdown previewer online provides a live, side-by-side editing experience: write Markdown on the left and see the rendered HTML on the right, updating in real-time. It supports GitHub Flavored Markdown including tables, code blocks with language hints, blockquotes, and nested lists. All rendering happens locally in your browser." }}
      faqs={[
        { q: "What Markdown syntax is supported?", a: "The previewer supports headings (# to ######), bold, italic, links, images, code blocks, inline code, blockquotes, ordered and unordered lists, horizontal rules, and tables." },
        { q: "Can I copy the generated HTML?", a: "Yes. Click the 'Copy as HTML' button above the preview panel to copy the raw HTML to your clipboard." },
        { q: "Is this GitHub Flavored Markdown?", a: "It supports most GFM features including tables and fenced code blocks. Some advanced features like task lists and footnotes may not be fully supported." },
        { q: "What is the heading outline?", a: "The outline panel shows a hierarchical table of contents extracted from your headings, perfect for reviewing README structure." },
        { q: "Is my content saved?", a: "Your input is stored in your browser's local storage, so it persists between visits. No data is sent to any server." },
      ]}
      relatedTools={[
        { name: "RegEx Tester", path: "/regex-tester", description: "Test patterns for parsing Markdown syntax." },
        { name: "YAML ↔ JSON", path: "/yaml-json-converter", description: "Convert frontmatter between YAML and JSON." },
        { name: "Base64 Encoder", path: "/base64-encoder", description: "Encode images for embedding in Markdown." },
      ]}
    >
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <button onClick={() => setInput(SAMPLE_MARKDOWN)} className="px-3 py-1.5 rounded-md text-xs font-mono bg-surface2 border border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground">
          Load Sample
        </button>
        <button onClick={copyHtml} className="px-3 py-1.5 rounded-md text-xs font-mono bg-surface2 border border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          {copied ? <><Check className="w-3 h-3 text-accent" /> Copied</> : <><Copy className="w-3 h-3" /> Copy as HTML</>}
        </button>
        <button onClick={() => setShowOutline(!showOutline)} className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors inline-flex items-center gap-1 ${showOutline ? "bg-primary text-primary-foreground border-primary" : "bg-surface2 border-border text-muted-foreground hover:text-foreground"}`}>
          <List className="w-3 h-3" /> Outline
        </button>
        {debounced && (
          <span className="text-xs font-mono text-muted-foreground">
            {wordCount(debounced)} words • {readTime(debounced)} min read • {headings.length} heading{headings.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Heading Outline */}
      {showOutline && headings.length > 0 && (
        <div className="mb-4 p-4 rounded-lg bg-surface border border-border">
          <p className="text-xs font-mono text-muted-foreground mb-2">Document Outline</p>
          <div className="space-y-1">
            {headings.map((h, i) => (
              <div key={i} className="font-mono text-sm text-foreground" style={{ paddingLeft: `${(h.level - 1) * 16}px` }}>
                <span className="text-muted-foreground mr-1.5">{"#".repeat(h.level)}</span>
                {h.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: "400px" }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write Markdown here..."
          className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--foreground)/0.1)] rounded-lg p-4 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-[hsl(var(--foreground)/0.2)] hover:border-[hsl(var(--foreground)/0.15)] resize-y placeholder:text-muted-foreground/50 caret-primary transition-[border-color,box-shadow] duration-200 selection:bg-primary/20"
          style={{ minHeight: "400px" }}
          spellCheck={false}
        />
        <div
          className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground)/0.1)] rounded-lg p-6 overflow-auto prose prose-invert prose-sm max-w-none"
          style={{ minHeight: "400px" }}
          dangerouslySetInnerHTML={{ __html: html || '<p class="text-muted-foreground">Preview will appear here...</p>' }}
        />
      </div>
    </ToolLayout>
  );
}
