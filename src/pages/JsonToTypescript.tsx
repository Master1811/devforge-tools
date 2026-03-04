import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { jsonToTypescript } from "@/lib/tools/jsonToTs";

export default function JsonToTypescriptPage() {
  const [input, setInput] = useLocalStorage("devforge-json-ts-input", "");
  const [useExport, setUseExport] = useState(true);
  const [useType, setUseType] = useState(false);
  const debounced = useDebounce(input, 200);

  let output = "";
  let error = "";
  if (debounced.trim()) {
    try { output = jsonToTypescript(debounced, { useExport, useType }); }
    catch (e) { error = "Invalid JSON: " + (e as Error).message; }
  }

  return (
    <ToolLayout
      title="JSON to TypeScript Interface Generator"
      slug="json-to-typescript"
      description="Convert JSON to TypeScript interfaces instantly. Generate accurate types from any JSON — free, no signup required."
      keywords={["json to typescript", "json to ts online", "generate typescript types from json"]}
      howToUse={["Paste your JSON into the input panel.", "TypeScript interfaces are generated automatically in real-time.", "Toggle between interface and type alias, then copy the output."]}
      whatIs={{ title: "What is JSON to TypeScript Conversion?", content: "When working with TypeScript, you often receive JSON data from APIs and need corresponding type definitions. A JSON to TypeScript interface generator analyzes the structure of your JSON — detecting strings, numbers, booleans, arrays, nested objects, and null values — and produces clean TypeScript interfaces. This eliminates the tedious manual work of writing types for API responses. Our tool handles arrays with mixed types by creating union types, generates PascalCase interface names from object keys, and properly handles nullable fields. All processing happens in your browser — your JSON data is never sent to any server." }}
      faqs={[
        { q: "Can it handle nested JSON objects?", a: "Yes. The generator recursively processes nested objects and creates separate named interfaces for each level, using PascalCase naming derived from the parent key." },
        { q: "How does it handle arrays with mixed types?", a: "If an array contains elements of different types, the generator creates a union type (e.g., (string | number)[]). If all elements are the same type, it uses a simple array type." },
        { q: "What's the difference between interface and type alias?", a: "Interfaces are extendable and can be merged, making them ideal for object shapes. Type aliases are more flexible and can represent unions, intersections, and primitives. Both work for most use cases." },
        { q: "Does it handle null values?", a: "Yes. Null values in your JSON are represented as 'null' in the generated TypeScript type, helping you handle nullable fields correctly." },
        { q: "Can I use the generated types directly in my project?", a: "Absolutely. The output is valid TypeScript that you can copy directly into your codebase. Toggle 'export' on if you need exported types." },
      ]}
      relatedTools={[
        { name: "JWT Decoder", path: "/jwt-decoder", description: "Decode JWT payloads and generate types for their claims." },
        { name: "YAML ↔ JSON Converter", path: "/yaml-json-converter", description: "Convert YAML configs to JSON before generating types." },
        { name: "cURL Converter", path: "/curl-converter", description: "Convert API calls to code, then type the responses." },
      ]}
    >
      <div className="flex gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={useExport} onChange={e => setUseExport(e.target.checked)} className="accent-primary" />
          Export
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={useType} onChange={e => setUseType(e.target.checked)} className="accent-primary" />
          Type alias
        </label>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="JSON Input" placeholder='{"name": "John", "age": 30}' />
        <CodePanel value={error || output} readOnly label="TypeScript Output" />
      </div>
    </ToolLayout>
  );
}
