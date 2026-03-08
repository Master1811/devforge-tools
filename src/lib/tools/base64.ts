export function encodeBase64(input: string, urlSafe: boolean = false): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  let result = btoa(binary);
  if (urlSafe) result = result.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return result;
}

export function decodeBase64(input: string): string {
  let s = input.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const binary = atob(s);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function isBase64(str: string): boolean {
  if (str.length < 4) return false;
  return /^[A-Za-z0-9+/\-_=\s]+$/.test(str) && str.length % 4 <= 1;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export type DetectedContent = "jwt" | "json" | "image" | "xml" | "text" | "unknown";

export function detectBase64Content(decoded: string): DetectedContent {
  const trimmed = decoded.trim();
  // Check JWT (3 base64 segments separated by dots)
  if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(trimmed)) return "jwt";
  // Check data URL image prefix
  if (trimmed.startsWith("data:image/")) return "image";
  // Check JSON
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    try { JSON.parse(trimmed); return "json"; } catch { /* not JSON */ }
  }
  // Check XML
  if (trimmed.startsWith("<?xml") || trimmed.startsWith("<")) return "xml";
  // Check if mostly printable text
  const printable = trimmed.split("").filter(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 127).length;
  if (printable / trimmed.length > 0.9) return "text";
  return "unknown";
}

export function getByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
