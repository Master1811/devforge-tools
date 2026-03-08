import { useState, useRef } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { jsonToTypescript, JsonToTsOptions } from "@/lib/tools/jsonToTs";

type OutputFormat = "typescript" | "zod" | "yup";

export default function JsonToTypescriptPage() {
  const [input, setInput] = useLocalStorage("devforge-json-ts-input", "");
  const [useExport, setUseExport] = useState(true);
  const [useType, setUseType] = useState(false);
  const [useReadonly, setUseReadonly] = useState(false);
  const [strictNulls, setStrictNulls] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("typescript");
  const [prevOutput, setPrevOutput] = useState<string>("");
  const [showDiff, setShowDiff] = useState(false);
  const debounced = useDebounce(input, 200);
  const lastOutput = useRef<string>("");

  let output = "";
  let error = "";
  if (debounced.trim()) {
    try {
      const opts: JsonToTsOptions = { useExport, useType, useReadonly, strictNulls, outputFormat };
      output = jsonToTypescript(debounced, opts);
      // Track for diff
      if (output !== lastOutput.current && lastOutput.current) {
        setPrevOutput(lastOutput.current);
      }
      lastOutput.current = output;
    } catch (e) { error = "Invalid JSON: " + (e as Error).message; }
  }

  // Simple diff computation
  const diffLines = showDiff && prevOutput ? computeDiff(prevOutput, output) : null;

  return (
    <ToolLayout
      title="JSON to TypeScript Interface Generator"
      slug="json-to-typescript"
      description="Convert JSON to TypeScript interfaces, Zod schemas, or Yup schemas instantly. Generate accurate types from any JSON — free, no signup required."
      keywords={["json to typescript", "json to ts online", "generate typescript types from json", "json to zod schema"]}
      howToUse={["Paste your JSON into the input panel.", "TypeScript interfaces are generated automatically in real-time.", "Choose output format (TypeScript, Zod, Yup) and toggle options."]}
      whatIs={{ title: "What is JSON to TypeScript Conversion?", content: "When working with TypeScript, you often receive JSON data from APIs and need corresponding type definitions. A JSON to TypeScript interface generator analyzes the structure of your JSON — detecting strings, numbers, booleans, arrays, nested objects, and null values — and produces clean TypeScript interfaces. This eliminates the tedious manual work of writing types for API responses. Our tool handles arrays with mixed types by creating union types, generates PascalCase interface names from object keys, and properly handles nullable fields. All processing happens in your browser — your JSON data is never sent to any server." }}
      faqs={[
        { q: "Can it handle nested JSON objects?", a: "Yes. The generator recursively processes nested objects and creates separate named interfaces for each level, using PascalCase naming derived from the parent key." },
        { q: "How does it handle arrays with mixed types?", a: "If an array contains elements of different types, the generator creates a union type (e.g., (string | number)[]). If all elements are the same type, it uses a simple array type." },
        { q: "What's the difference between interface and type alias?", a: "Interfaces are extendable and can be merged, making them ideal for object shapes. Type aliases are more flexible and can represent unions, intersections, and primitives. Both work for most use cases." },
        { q: "Can it generate Zod schemas?", a: "Yes! Select 'Zod' from the output format selector to generate runtime-validated Zod schemas from your JSON data." },
        { q: "What is strict null checks mode?", a: "When enabled, null values in your JSON become optional fields (key?: type) instead of explicit null types, matching TypeScript's strict null checking behavior." },
      ]}
      relatedTools={[
        { name: "JWT Decoder", path: "/jwt-decoder", description: "Decode JWT payloads and generate types for their claims." },
        { name: "YAML ↔ JSON Converter", path: "/yaml-json-converter", description: "Convert YAML configs to JSON before generating types." },
        { name: "cURL Converter", path: "/curl-converter", description: "Convert API calls to code, then type the responses." },
      ]}
    >
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Output format selector */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["typescript", "zod", "yup"] as const).map(fmt => (
            <button key={fmt} onClick={() => setOutputFormat(fmt)} className={`px-3 py-1.5 text-xs font-mono transition-colors ${outputFormat === fmt ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground"}`}>
              {fmt === "typescript" ? "TypeScript" : fmt === "zod" ? "Zod" : "Yup"}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={useExport} onChange={e => setUseExport(e.target.checked)} className="accent-primary" />
          Export
        </label>
        {outputFormat === "typescript" && (
          <>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={useType} onChange={e => setUseType(e.target.checked)} className="accent-primary" />
              Type alias
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={useReadonly} onChange={e => setUseReadonly(e.target.checked)} className="accent-primary" />
              Readonly
            </label>
          </>
        )}
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={strictNulls} onChange={e => setStrictNulls(e.target.checked)} className="accent-primary" />
          Strict nulls
        </label>
        {prevOutput && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer ml-auto">
            <input type="checkbox" checked={showDiff} onChange={e => setShowDiff(e.target.checked)} className="accent-primary" />
            Show diff
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="JSON Input" placeholder='{"name": "John", "age": 30}' />
        {showDiff && diffLines ? (
          <div className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-surface2">
              <span className="font-mono text-xs text-muted-foreground">Diff View</span>
            </div>
            <div className="p-4 font-mono text-sm overflow-auto" style={{ minHeight: "200px" }}>
              {diffLines.map((line, i) => (
                <div key={i} className={`${
                  line.type === "added" ? "bg-accent/10 text-accent" :
                  line.type === "removed" ? "bg-destructive/10 text-destructive line-through" :
                  "text-muted-foreground"
                }`}>
                  <span className="select-none opacity-50 mr-2">{line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}</span>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CodePanel value={error || output} readOnly label={`${outputFormat === "typescript" ? "TypeScript" : outputFormat === "zod" ? "Zod Schema" : "Yup Schema"} Output`} />
        )}
      </div>
    </ToolLayout>
  );
}

interface DiffLine { type: "same" | "added" | "removed"; text: string }

function computeDiff(prev: string, curr: string): DiffLine[] {
  const prevLines = prev.split("\n");
  const currLines = curr.split("\n");
  const result: DiffLine[] = [];
  const maxLen = Math.max(prevLines.length, currLines.length);
  
  for (let i = 0; i < maxLen; i++) {
    const p = prevLines[i];
    const c = currLines[i];
    if (p === c) {
      result.push({ type: "same", text: p || "" });
    } else {
      if (p !== undefined && !currLines.includes(p)) result.push({ type: "removed", text: p });
      if (c !== undefined && !prevLines.includes(c)) result.push({ type: "added", text: c });
      if (p !== undefined && currLines.includes(p)) result.push({ type: "same", text: p });
      if (c !== undefined && prevLines.includes(c)) result.push({ type: "same", text: c });
    }
  }
  return result;
}
