"use client";

import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { yamlToJson, jsonToYaml, detectDirection, splitMultiDocYaml } from "@/lib/tools/yamlJson";

export default function YamlJsonConverterPage() {
  const [input, setInput] = useLocalStorage("devforge-yaml-json-input", "");
  const [autoDetect, setAutoDetect] = useState(true);
  const [direction, setDirection] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [minify, setMinify] = useState(false);
  const [activeDoc, setActiveDoc] = useState(0);
  const debounced = useDebounce(input, 200);

  const effectiveDirection = autoDetect && debounced.trim() ? detectDirection(debounced) : direction;

  // Multi-document YAML support
  const docs = effectiveDirection === "yaml-to-json" ? splitMultiDocYaml(debounced) : [debounced];
  const isMultiDoc = docs.length > 1;

  let output = "";
  let error = "";
  if (debounced.trim()) {
    try {
      const docToConvert = isMultiDoc ? docs[activeDoc] || docs[0] : debounced;
      output = effectiveDirection === "yaml-to-json" ? yamlToJson(docToConvert, minify) : jsonToYaml(docToConvert);
    } catch (e) { error = "Conversion error: " + (e as Error).message; }
  }

  return (
    <ToolLayout
      title="YAML ↔ JSON Converter Online"
      slug="yaml-json-converter"
      description="Convert between YAML and JSON formats instantly. Auto-detect direction, multi-document support, minify — free YAML to JSON converter."
      keywords={["yaml to json converter", "json to yaml online", "yaml formatter online", "multi document yaml"]}
      howToUse={["Paste your YAML or JSON into the input panel.", "The converter auto-detects the format and converts to the other.", "Use tabs for multi-document YAML, toggle minify for compact JSON."]}
      whatIs={{ title: "What are YAML and JSON?", content: "YAML (YAML Ain't Markup Language) and JSON (JavaScript Object Notation) are both data serialization formats used for configuration files, API payloads, and data exchange. JSON uses braces and brackets with strict syntax, while YAML uses indentation and is more human-readable. Our yaml to json converter handles the translation between these formats. JSON is preferred for APIs and JavaScript, while YAML is common in Docker Compose, Kubernetes manifests, CI/CD configs (GitHub Actions, GitLab CI), and Ansible playbooks. This tool auto-detects the input format and converts in both directions, validating syntax along the way." }}
      faqs={[
        { q: "How does auto-detection work?", a: "If your input starts with { or [, it's treated as JSON and converted to YAML. Otherwise, it's treated as YAML and converted to JSON." },
        { q: "Does it support multi-document YAML?", a: "Yes! YAML files with multiple documents separated by --- are split into tabs. You can view and convert each document individually." },
        { q: "Can I minify the JSON output?", a: "Yes. Enable the 'Minify' toggle to get compact, single-line JSON output without whitespace." },
        { q: "Does it preserve comments?", a: "YAML comments (lines starting with #) are stripped during conversion because JSON has no comment syntax. This is a limitation of the JSON format itself." },
        { q: "Is JSON output pretty-printed?", a: "Yes by default, using 2-space indentation. Toggle Minify for compact output." },
      ]}
      relatedTools={[
        { name: "JSON to TypeScript", path: "/json-to-typescript", description: "Convert your JSON output to TypeScript types." },
        { name: "SQL Formatter", path: "/sql-formatter", description: "Format SQL queries from database config files." },
        { name: "Markdown Previewer", path: "/markdown-previewer", description: "Document your config formats in Markdown." },
      ]}
    >
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={autoDetect} onChange={e => setAutoDetect(e.target.checked)} className="accent-primary" />
          Auto-detect
        </label>
        {!autoDetect && (
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button onClick={() => setDirection("yaml-to-json")} className={`px-3 py-1.5 text-xs font-mono ${direction === "yaml-to-json" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}>YAML → JSON</button>
            <button onClick={() => setDirection("json-to-yaml")} className={`px-3 py-1.5 text-xs font-mono ${direction === "json-to-yaml" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}>JSON → YAML</button>
          </div>
        )}
        {effectiveDirection === "yaml-to-json" && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={minify} onChange={e => setMinify(e.target.checked)} className="accent-primary" />
            Minify JSON
          </label>
        )}
        <span className="text-xs font-mono text-muted-foreground self-center">Direction: {effectiveDirection}</span>
      </div>

      {/* Multi-document tabs */}
      {isMultiDoc && (
        <div className="flex gap-1 mb-3 flex-wrap">
          {docs.map((_, i) => (
            <button key={i} onClick={() => setActiveDoc(i)} className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${activeDoc === i ? "bg-primary text-primary-foreground" : "bg-surface2 text-muted-foreground hover:text-foreground border border-border"}`}>
              Doc {i + 1}
            </button>
          ))}
          <span className="text-xs font-mono text-muted-foreground self-center ml-2">{docs.length} documents found (separated by ---)</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="Input" placeholder="Paste YAML or JSON here..." />
        <CodePanel value={error || output} readOnly label="Output" />
      </div>
    </ToolLayout>
  );
}
