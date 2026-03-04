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
