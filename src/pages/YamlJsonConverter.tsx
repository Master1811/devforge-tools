import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { yamlToJson, jsonToYaml, detectDirection } from "@/lib/tools/yamlJson";

export default function YamlJsonConverterPage() {
  const [input, setInput] = useLocalStorage("devforge-yaml-json-input", "");
  const [autoDetect, setAutoDetect] = useState(true);
  const [direction, setDirection] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const debounced = useDebounce(input, 200);

  const effectiveDirection = autoDetect && debounced.trim() ? detectDirection(debounced) : direction;

  let output = "";
  let error = "";
  if (debounced.trim()) {
    try {
      output = effectiveDirection === "yaml-to-json" ? yamlToJson(debounced) : jsonToYaml(debounced);
    } catch (e) { error = "Conversion error: " + (e as Error).message; }
  }

  return (
    <ToolLayout
      title="YAML ↔ JSON Converter Online"
      slug="yaml-json-converter"
      description="Convert between YAML and JSON formats instantly. Auto-detect direction, validate syntax — free YAML to JSON converter."
      keywords={["yaml to json converter", "json to yaml online", "yaml formatter online"]}
      howToUse={["Paste your YAML or JSON into the input panel.", "The converter auto-detects the format and converts to the other.", "Copy the converted output from the result panel."]}
      whatIs={{ title: "What are YAML and JSON?", content: "YAML (YAML Ain't Markup Language) and JSON (JavaScript Object Notation) are both data serialization formats used for configuration files, API payloads, and data exchange. JSON uses braces and brackets with strict syntax, while YAML uses indentation and is more human-readable. Our yaml to json converter handles the translation between these formats. JSON is preferred for APIs and JavaScript, while YAML is common in Docker Compose, Kubernetes manifests, CI/CD configs (GitHub Actions, GitLab CI), and Ansible playbooks. This tool auto-detects the input format and converts in both directions, validating syntax along the way." }}
      faqs={[
        { q: "How does auto-detection work?", a: "If your input starts with { or [, it's treated as JSON and converted to YAML. Otherwise, it's treated as YAML and converted to JSON." },
        { q: "Does it preserve comments?", a: "YAML comments (lines starting with #) are stripped during conversion because JSON has no comment syntax. This is a limitation of the JSON format itself." },
        { q: "Can it handle complex nested structures?", a: "Yes. The converter handles nested objects, arrays, mixed types, and most common YAML features including anchors aren't supported but basic structures work well." },
        { q: "Why is my YAML showing a conversion error?", a: "Check for inconsistent indentation (mixing tabs and spaces), missing colons, or unclosed quotes. YAML is whitespace-sensitive — use spaces, not tabs." },
        { q: "Is JSON output pretty-printed?", a: "Yes. JSON output uses 2-space indentation by default for readability." },
      ]}
      relatedTools={[
        { name: "JSON to TypeScript", path: "/json-to-typescript", description: "Convert your JSON output to TypeScript types." },
        { name: "SQL Formatter", path: "/sql-formatter", description: "Format SQL queries from database config files." },
        { name: "Markdown Previewer", path: "/markdown-previewer", description: "Document your config formats in Markdown." },
      ]}
    >
      <div className="flex flex-wrap gap-3 mb-4">
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
        <span className="text-xs font-mono text-muted-foreground self-center">Direction: {effectiveDirection}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="Input" placeholder="Paste YAML or JSON here..." />
        <CodePanel value={error || output} readOnly label="Output" />
      </div>
    </ToolLayout>
  );
}
