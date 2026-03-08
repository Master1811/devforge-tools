import { useState, useCallback } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { encodeBase64, decodeBase64, isBase64, fileToBase64, detectBase64Content, getByteSize, formatByteSize } from "@/lib/tools/base64";
import { Upload, FileType } from "lucide-react";

const CONTENT_LABELS: Record<string, { label: string; color: string }> = {
  jwt: { label: "🔑 JWT Token", color: "text-primary" },
  json: { label: "📋 JSON Data", color: "text-accent" },
  image: { label: "🖼️ Image", color: "text-purple-400" },
  xml: { label: "📄 XML", color: "text-yellow-400" },
  text: { label: "📝 Plain Text", color: "text-foreground" },
  unknown: { label: "❓ Binary/Unknown", color: "text-muted-foreground" },
};

export default function Base64EncoderPage() {
  const [input, setInput] = useLocalStorage("devforge-base64-input", "");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const debounced = useDebounce(input, 200);

  let output = "";
  let error = "";
  if (debounced.trim()) {
    try {
      output = mode === "encode" ? encodeBase64(debounced, urlSafe) : decodeBase64(debounced);
    } catch (e) { error = "Error: " + (e as Error).message; }
  }

  // Auto-detect if input is base64
  const autoDetected = debounced.trim() && isBase64(debounced.trim());

  // Content detection for decoded output
  let detectedContent = null;
  if (mode === "decode" && output && !error) {
    const type = detectBase64Content(output);
    detectedContent = CONTENT_LABELS[type];
  }

  // Byte sizes
  const inputBytes = debounced.trim() ? getByteSize(debounced) : 0;
  const outputBytes = output ? getByteSize(output) : 0;
  const sizeRatio = inputBytes > 0 && outputBytes > 0 ? ((outputBytes / inputBytes) * 100).toFixed(0) : null;

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const result = await fileToBase64(file);
      setInput(result);
      setMode("decode");
      if (file.type.startsWith("image/")) setImagePreview(result);
    }
  }, [setInput]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await fileToBase64(file);
      setInput(result);
      setMode("decode");
      if (file.type.startsWith("image/")) setImagePreview(result);
    }
  }, [setInput]);

  return (
    <ToolLayout
      title="Base64 Encoder & Decoder Online"
      slug="base64-encoder"
      description="Encode or decode Base64 strings instantly. Support for UTF-8, URL-safe variants, and image files — free, no signup."
      keywords={["base64 encoder decoder online", "encode base64 online", "base64 image encoder", "decode base64 string"]}
      howToUse={["Paste text or drag an image file into the input area.", "Choose Encode or Decode mode (auto-detected if possible).", "Copy the result or use it as a data URL."]}
      whatIs={{ title: "What is Base64 Encoding?", content: "Base64 is a binary-to-text encoding scheme that represents binary data as an ASCII string. It's commonly used to embed images in CSS/HTML (as data URLs), transmit binary data over text-based protocols like email and HTTP, and encode credentials in Basic Authentication headers. Base64 encoding increases data size by about 33% but ensures the data can pass through systems that only handle text. Our base64 encoder decoder online handles UTF-8 text, URL-safe Base64 variants (replacing + and / with - and _), and file-to-base64 conversion for images. All processing runs locally in your browser." }}
      faqs={[
        { q: "Is Base64 encryption?", a: "No. Base64 is encoding, not encryption. Anyone can decode Base64 — it provides no security. Use it for data transport, not for protecting sensitive information." },
        { q: "Why does Base64 output look longer than the input?", a: "Base64 encodes every 3 bytes into 4 ASCII characters, resulting in roughly 33% size increase. This is the tradeoff for text-safe representation of binary data." },
        { q: "What is URL-safe Base64?", a: "Standard Base64 uses + and / characters which have special meaning in URLs. URL-safe Base64 replaces these with - and _ respectively, and may omit padding (=)." },
        { q: "Can I encode images to Base64?", a: "Yes. Drag and drop an image file onto the input area or use the file picker. The tool will generate a Base64 data URL that you can embed directly in HTML or CSS." },
        { q: "What can it auto-detect?", a: "When decoding, the tool identifies if the content is a JWT token, JSON, image, XML, or plain text — helping you understand what was encoded." },
      ]}
      relatedTools={[
        { name: "JWT Decoder", path: "/jwt-decoder", description: "JWTs use Base64URL encoding — decode them here." },
        { name: "Password Generator", path: "/password-generator", description: "Generate secure passwords and encode them." },
        { name: "cURL Converter", path: "/curl-converter", description: "Base64-encode auth headers for API requests." },
      ]}
    >
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button onClick={() => setMode("encode")} className={`px-4 py-2 text-sm font-mono transition-colors ${mode === "encode" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}>Encode</button>
          <button onClick={() => setMode("decode")} className={`px-4 py-2 text-sm font-mono transition-colors ${mode === "decode" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}>Decode</button>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={urlSafe} onChange={e => setUrlSafe(e.target.checked)} className="accent-primary" />
          URL-safe
        </label>
        {autoDetected && mode === "encode" && (
          <button onClick={() => setMode("decode")} className="text-xs font-mono text-accent px-2 py-1 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors">
            Looks like Base64 — click to Decode
          </button>
        )}

        {/* Byte size info */}
        {inputBytes > 0 && (
          <span className="text-xs font-mono text-muted-foreground ml-auto flex items-center gap-2">
            <FileType className="w-3.5 h-3.5" />
            Input: {formatByteSize(inputBytes)}
            {outputBytes > 0 && <> → Output: {formatByteSize(outputBytes)}</>}
            {sizeRatio && <> ({sizeRatio}%)</>}
          </span>
        )}
      </div>

      {/* Content detection badge */}
      {detectedContent && output && !error && (
        <div className={`mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-border bg-surface ${detectedContent.color}`}>
          {detectedContent.label} detected inside Base64
        </div>
      )}

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
      >
        <div className="relative">
          <CodePanel value={input} onChange={setInput} label={mode === "encode" ? "Text Input" : "Base64 Input"} placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 string..."} />
          {/* File drop zone overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-mono text-primary">Drop file to encode</p>
              </div>
            </div>
          )}
          {/* File picker */}
          <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-surface2 border border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Upload file
            <input type="file" className="hidden" onChange={handleFileSelect} />
          </label>
        </div>
        <div>
          <CodePanel value={error || output} readOnly label={mode === "encode" ? "Base64 Output" : "Decoded Output"} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 max-h-48 rounded-lg border border-border" />}
        </div>
      </div>
    </ToolLayout>
  );
}
