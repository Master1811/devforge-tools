"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Download, Settings, Code, FileJson } from "lucide-react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { jsonToTypescript, JsonToTsOptions } from "@/lib/tools/jsonToTs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";

const sampleJson = `{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "profile": {
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Software developer",
      "skills": ["JavaScript", "TypeScript", "React"]
    },
    "lastLogin": "2024-01-15T10:30:00Z"
  },
  "metadata": {
    "version": "1.0",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}`;

export default function JsonToTypescriptPage() {
  const [input, setInput] = useLocalStorage("json-to-ts-input", sampleJson);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const [options, setOptions] = useLocalStorage<JsonToTsOptions>("json-to-ts-options", {
    useExport: true,
    useType: false,
    useReadonly: false,
    strictNulls: false,
    outputFormat: "typescript"
  });

  const debouncedInput = useDebounce(input, 300);

  const processJson = useCallback(() => {
    if (!debouncedInput.trim()) {
      setOutput("");
      setError("");
      return;
    }

    try {
      const result = jsonToTypescript(debouncedInput, options);
      setOutput(result);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
    }
  }, [debouncedInput, options]);

  // Process on input or options change
  useEffect(() => {
    processJson();
  }, [processJson]);

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  const downloadAsFile = () => {
    if (output) {
      const blob = new Blob([output], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "types.ts";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleOptionChange = (key: keyof JsonToTsOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ToolLayout
      title="JSON to TypeScript Converter"
      slug="json-to-typescript"
      description="Convert JSON data to TypeScript interfaces, types, Zod schemas, or Yup validation schemas. Supports nested objects, arrays, and automatic type inference."
      keywords={["json to typescript", "typescript interface generator", "json schema", "type inference", "zod schema", "yup validation"]}
      howToUse={[
        "Paste your JSON object into the input panel.",
        "Choose your output format: TypeScript, Zod schema, or Yup schema.",
        "Configure options like export keywords, readonly properties, and strict nulls.",
        "Copy or download the generated TypeScript code."
      ]}
      whatIs={{
        title: "What is JSON to TypeScript Conversion?",
        content: "This tool automatically generates TypeScript interfaces, types, Zod validation schemas, or Yup schemas from JSON data. It analyzes your JSON structure and creates type-safe TypeScript code with proper type inference for primitives, objects, and arrays. The tool supports nested structures, optional properties, and various output formats for different validation libraries. All processing happens in your browser — your JSON data is never sent to any server."
      }}
      faqs={[
        {
          q: "What output formats are supported?",
          a: "The tool supports TypeScript interfaces/types, Zod validation schemas, and Yup validation schemas. Each format generates appropriate code for type checking and validation."
        },
        {
          q: "How does it handle nested objects and arrays?",
          a: "Nested objects become separate interfaces/types with proper references. Arrays are typed correctly whether they contain primitives or objects. Complex nested structures are handled recursively."
        },
        {
          q: "What are the configuration options?",
          a: "You can choose to use export keywords, generate types instead of interfaces, make properties readonly, enable strict null checking, and select different output formats."
        },
        {
          q: "Can I use this for API response typing?",
          a: "Yes! This is perfect for generating TypeScript types from API responses. Just paste your JSON response and get ready-to-use TypeScript interfaces."
        }
      ]}
      relatedTools={[
        {
          name: "JSON to BigQuery Schema",
          path: "/json-to-bigquery-schema",
          description: "Generate BigQuery table schemas from JSON data"
        },
        {
          name: "YAML ↔ JSON",
          path: "/yaml-json-converter",
          description: "Convert between YAML and JSON formats"
        },
        {
          name: "Base64 Encoder",
          path: "/base64-encoder",
          description: "Encode and decode Base64 strings and files"
        }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileJson className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">JSON Input</h3>
          </div>

          <CodePanel
            value={input}
            onChange={setInput}
            label="JSON Input"
            placeholder="Paste your JSON here..."
            language="json"
          />

          {/* Options Panel */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h4 className="font-medium">Options</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useExport"
                    checked={options.useExport}
                    onCheckedChange={(checked) => handleOptionChange("useExport", checked)}
                  />
                  <Label htmlFor="useExport">Use export keyword</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useType"
                    checked={options.useType}
                    onCheckedChange={(checked) => handleOptionChange("useType", checked)}
                  />
                  <Label htmlFor="useType">Use type instead of interface</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useReadonly"
                    checked={options.useReadonly}
                    onCheckedChange={(checked) => handleOptionChange("useReadonly", checked)}
                  />
                  <Label htmlFor="useReadonly">Make properties readonly</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="strictNulls"
                    checked={options.strictNulls}
                    onCheckedChange={(checked) => handleOptionChange("strictNulls", checked)}
                  />
                  <Label htmlFor="strictNulls">Strict null checking</Label>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="outputFormat">Output Format</Label>
                <Select
                  value={options.outputFormat}
                  onValueChange={(value: "typescript" | "zod" | "yup") =>
                    handleOptionChange("outputFormat", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="zod">Zod Schema</SelectItem>
                    <SelectItem value="yup">Yup Schema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">
                {options.outputFormat === "typescript" ? "TypeScript" :
                 options.outputFormat === "zod" ? "Zod Schema" : "Yup Schema"} Output
              </h3>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={!output}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsFile}
                disabled={!output}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>

          <CodePanel
            value={error || output}
            readOnly
            label={`${options.outputFormat === "typescript" ? "TypeScript" : options.outputFormat === "zod" ? "Zod Schema" : "Yup Schema"} Output`}
            placeholder="Generated code will appear here..."
            language={options.outputFormat === "typescript" ? "typescript" : "javascript"}
          />

          {output && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
            >
              <strong>Success!</strong> Generated {options.outputFormat} code from your JSON input.
              {options.outputFormat === "zod" && " Make sure to install zod: `npm install zod`"}
              {options.outputFormat === "yup" && " Make sure to install yup: `npm install yup`"}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}