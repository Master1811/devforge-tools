export function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  try {
    return decodeURIComponent(
      atob(s).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
  } catch { return atob(s); }
}

export interface JWTResult {
  header: Record<string, any> | null;
  payload: Record<string, any> | null;
  signature: string;
  isExpired: boolean | null;
  error?: string;
}

export function decodeJWT(token: string): JWTResult {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return { header: null, payload: null, signature: "", isExpired: null, error: "Invalid JWT: expected 3 parts separated by dots" };

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];
    let isExpired: boolean | null = null;
    if (payload.exp) isExpired = payload.exp * 1000 < Date.now();
    return { header, payload, signature, isExpired };
  } catch (e) {
    return { header: null, payload: null, signature: "", isExpired: null, error: "Failed to decode JWT: " + (e as Error).message };
  }
}

export function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}
