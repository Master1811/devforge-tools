"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { convertCurl, harToCurl, Language } from "@/lib/tools/curlConverter";
import { Upload, Copy } from "lucide-react";

const LANGS: { id: Language; label: string }[] = [
  { id: "fetch", label: "JS Fetch" },
  { id: "python", label: "Python" },
  { id: "axios", label: "Node Axios" },
  { id: "go", label: "Go" },
  { id: "php", label: "PHP" },
  { id: "ruby", label: "Ruby" },
];

export default function CurlConverterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useLocalStorage("devforge-curl-input", "");
  const [lang, setLang] = useState<Language>("fetch");
  const [harMode, setHarMode] = useState(false);
  const [harCurls, setHarCurls] = useState<string[]>([]);
  const [selectedHar, setSelectedHar] = useState(0);
  const debounced = useDebounce(input, 200);

  // Read from URL params on mount
  useEffect(() => {
    const curlParam = searchParams.get("curl");
    const langParam = searchParams.get("lang");

    if (curlParam && !input) setInput(decodeURIComponent(curlParam));
    if (langParam && ["fetch", "python", "axios", "go", "php", "ruby"].includes(langParam)) {
      setLang(langParam as Language);
    }
  }, [searchParams, setInput]);

  // Update URL when inputs change
  useEffect(() => {
    const params = new URLSearchParams();
    if (input.trim()) params.set("curl", encodeURIComponent(input.trim()));
    if (lang !== "fetch") params.set("lang", lang);

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    if (newUrl !== window.location.search) {
      router.replace(`/curl-converter${newUrl}`, { scroll: false });
    }
  }, [input, lang, router]);

  let output = "";
  const effectiveInput = harMode && harCurls.length > 0 ? harCurls[selectedHar] || "" : debounced;
  if (effectiveInput.trim()) {
    try { output = convertCurl(effectiveInput, lang); }
    catch (e) { output = "Error parsing curl command: " + (e as Error).message; }
  }

  const handleHarImport = (text: string) => {
    try {
      const curls = harToCurl(text);
      if (curls.length > 0) {
        setHarCurls(curls);
        setHarMode(true);
        setSelectedHar(0);
      }
    } catch (e) {
      setInput("Error parsing HAR: " + (e as Error).message);
    }
  };

  const handleHarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => handleHarImport(reader.result as string);
      reader.readAsText(file);
    }
  };

  return (
    <ToolLayout
      title="cURL to Code Converter Online"
      slug="curl-converter"
      description="Convert curl commands to JavaScript Fetch, Python requests, Go, PHP, Ruby, and Axios — free curl to code converter."
      keywords={["curl to python requests", "curl to fetch javascript", "convert curl command online", "curl to code", "har to curl"]}
      howToUse={["Paste your curl command or import a HAR file from browser DevTools.", "Select your target programming language from the tabs.", "Copy the generated code directly into your project."]}
      whatIs={{ title: "What is cURL?", content: "cURL is a command-line tool for transferring data using various protocols, most commonly HTTP. Developers use curl commands to test APIs, download files, and debug network requests. When you find a curl command in documentation or browser DevTools, you often need to translate it to your programming language. Our curl to code converter parses the curl command — extracting the URL, HTTP method, headers, request body, and authentication — and generates idiomatic code for JavaScript Fetch, Python requests, Go net/http, PHP cURL, Ruby Net::HTTP, and Node.js Axios. The converter handles common flags like -X, -H, -d, --data, -u for basic auth, and multiline commands." }}
      faqs={[
        { q: "How do I copy a curl command from Chrome DevTools?", a: "Right-click a network request → Copy → Copy as cURL. This gives you the complete curl command with all headers and data that you can paste directly into this tool." },
        { q: "Can I import HAR files?", a: "Yes! Export a HAR file from Chrome DevTools (Network tab → Export HAR) and import it. We'll extract all requests as curl commands you can browse." },
        { q: "Does it handle multiline curl commands?", a: "Yes. The converter handles backslash line continuations (\\) that are common in documentation and terminal output." },
        { q: "Can it convert POST requests with JSON bodies?", a: "Yes. When -d or --data flags contain JSON, the converter generates proper JSON request bodies for all target languages." },
        { q: "Which languages are supported?", a: "JavaScript Fetch, Python requests, Node.js Axios, Go net/http, PHP cURL, and Ruby Net::HTTP." },
      ]}
      relatedTools={[
        { name: "JSON to TypeScript", path: "/json-to-typescript", description: "Generate types for API response JSON." },
        { name: "Base64 Encoder", path: "/base64-encoder", description: "Encode authentication credentials for API headers." },
        { name: "YAML ↔ JSON", path: "/yaml-json-converter", description: "Convert API config files between formats." },
      ]}
    >
      <div className="flex flex-wrap gap-1 mb-4 items-center">
        {LANGS.map(l => (
          <button key={l.id} onClick={() => setLang(l.id)} className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${lang === l.id ? "bg-primary text-primary-foreground" : "bg-surface2 text-muted-foreground hover:text-foreground border border-border"}`}>
            {l.label}
          </button>
        ))}
        {output && lang === "fetch" && (
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-accent/10 text-accent hover:bg-accent/20 transition-colors ml-2"
            title="Copy fetch code"
          >
            <Copy className="w-3 h-3" />
            Copy Fetch
          </button>
        )}
        <label className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-surface2 border border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground cursor-pointer">
          <Upload className="w-3.5 h-3.5" /> Import HAR
          <input type="file" accept=".har,.json" className="hidden" onChange={handleHarFile} />
        </label>
      </div>

      {/* HAR request selector */}
      {harMode && harCurls.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-surface border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-muted-foreground">{harCurls.length} requests from HAR</span>
            <button onClick={() => { setHarMode(false); setHarCurls([]); }} className="text-xs font-mono text-destructive hover:underline">Clear</button>
          </div>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {harCurls.map((curl, i) => {
              const urlMatch = curl.match(/curl\s+'([^']+)'/);
              const shortUrl = urlMatch ? new URL(urlMatch[1]).pathname : `Request ${i + 1}`;
              return (
                <button key={i} onClick={() => setSelectedHar(i)} className={`px-2 py-1 rounded text-[10px] font-mono truncate max-w-[200px] ${selectedHar === i ? "bg-primary text-primary-foreground" : "bg-surface2 text-muted-foreground border border-border"}`}>
                  {shortUrl}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel
          value={harMode && harCurls.length > 0 ? harCurls[selectedHar] || "" : input}
          onChange={harMode ? undefined : setInput}
          readOnly={harMode}
          label="cURL Input"
          placeholder="curl https://api.example.com -H 'Content-Type: application/json'"
        />
        <CodePanel value={output} readOnly label={`${LANGS.find(l => l.id === lang)?.label} Output`} />
      </div>
    </ToolLayout>
  );
}
