import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { convertCurl, Language } from "@/lib/tools/curlConverter";

const LANGS: { id: Language; label: string }[] = [
  { id: "fetch", label: "JS Fetch" },
  { id: "python", label: "Python" },
  { id: "axios", label: "Node Axios" },
  { id: "go", label: "Go" },
  { id: "php", label: "PHP" },
];

export default function CurlConverterPage() {
  const [input, setInput] = useLocalStorage("devforge-curl-input", "");
  const [lang, setLang] = useState<Language>("fetch");
  const debounced = useDebounce(input, 200);

  let output = "";
  if (debounced.trim()) {
    try { output = convertCurl(debounced, lang); }
    catch (e) { output = "Error parsing curl command: " + (e as Error).message; }
  }

  return (
    <ToolLayout
      title="cURL to Code Converter Online"
      slug="curl-converter"
      description="Convert curl commands to JavaScript Fetch, Python requests, Go, PHP, and Axios — free curl to code converter."
      keywords={["curl to python requests", "curl to fetch javascript", "convert curl command online", "curl to code"]}
      howToUse={["Paste your curl command into the input panel.", "Select your target programming language from the tabs.", "Copy the generated code directly into your project."]}
      whatIs={{ title: "What is cURL?", content: "cURL is a command-line tool for transferring data using various protocols, most commonly HTTP. Developers use curl commands to test APIs, download files, and debug network requests. When you find a curl command in documentation or browser DevTools, you often need to translate it to your programming language. Our curl to code converter parses the curl command — extracting the URL, HTTP method, headers, request body, and authentication — and generates idiomatic code for JavaScript Fetch, Python requests, Go net/http, PHP cURL, and Node.js Axios. The converter handles common flags like -X, -H, -d, --data, -u for basic auth, and multiline commands." }}
      faqs={[
        { q: "How do I copy a curl command from Chrome DevTools?", a: "Right-click a network request → Copy → Copy as cURL. This gives you the complete curl command with all headers and data that you can paste directly into this tool." },
        { q: "Does it handle multiline curl commands?", a: "Yes. The converter handles backslash line continuations (\\) that are common in documentation and terminal output." },
        { q: "Can it convert POST requests with JSON bodies?", a: "Yes. When -d or --data flags contain JSON, the converter generates proper JSON request bodies for all target languages." },
        { q: "Does it support Basic Authentication?", a: "Yes. The -u flag (e.g., -u user:pass) is parsed and converted to the appropriate authentication syntax for each language." },
        { q: "Which languages are supported?", a: "Currently: JavaScript Fetch (async/await), Python requests, Node.js Axios, Go net/http, and PHP cURL. More languages may be added." },
      ]}
      relatedTools={[
        { name: "JSON to TypeScript", path: "/json-to-typescript", description: "Generate types for API response JSON." },
        { name: "Base64 Encoder", path: "/base64-encoder", description: "Encode authentication credentials for API headers." },
        { name: "YAML ↔ JSON", path: "/yaml-json-converter", description: "Convert API config files between formats." },
      ]}
    >
      <div className="flex gap-1 mb-4 flex-wrap">
        {LANGS.map(l => (
          <button key={l.id} onClick={() => setLang(l.id)} className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${lang === l.id ? "bg-primary text-primary-foreground" : "bg-surface2 text-muted-foreground hover:text-foreground border border-border"}`}>
            {l.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="cURL Input" placeholder="curl https://api.example.com -H 'Content-Type: application/json'" />
        <CodePanel value={output} readOnly label={`${LANGS.find(l => l.id === lang)?.label} Output`} />
      </div>
    </ToolLayout>
  );
}
