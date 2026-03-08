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
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  isExpired: boolean | null;
  error?: string;
}

export function decodeJWT(token: string): JWTResult {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return { header: null, payload: null, signature: "", isExpired: null, error: "Invalid JWT: expected 3 parts separated by dots" };

  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;
    const signature = parts[2];
    let isExpired: boolean | null = null;
    if (typeof payload.exp === "number") isExpired = payload.exp * 1000 < Date.now();
    return { header, payload, signature, isExpired };
  } catch (e) {
    return { header: null, payload: null, signature: "", isExpired: null, error: "Failed to decode JWT: " + (e as Error).message };
  }
}

export function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

export type AlgoRisk = "good" | "warn" | "critical";

export function getAlgorithmRisk(alg: string): { risk: AlgoRisk; label: string; description: string } {
  const upper = (alg || "").toUpperCase();
  if (upper === "NONE") return { risk: "critical", label: "CRITICAL", description: "No signature — anyone can forge this token" };
  if (upper.startsWith("HS")) return { risk: "warn", label: "WARNING", description: "Symmetric signing — secret shared between issuer and verifier. Vulnerable if secret is weak or leaked." };
  if (upper.startsWith("RS") || upper.startsWith("PS") || upper.startsWith("ES") || upper.startsWith("EDDSA")) return { risk: "good", label: "SECURE", description: "Asymmetric signing — only the private key holder can sign." };
  return { risk: "warn", label: "UNKNOWN", description: `Unrecognized algorithm: ${alg}` };
}

export function getExpiryMessage(payload: Record<string, unknown>): string | null {
  if (typeof payload.exp !== "number") return null;
  const expMs = payload.exp * 1000;
  const now = Date.now();
  const diffMs = Math.abs(expMs - now);
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (expMs < now) {
    if (days > 0) return `Expired ${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `Expired ${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `Expired ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }
  if (days > 0) return `Expires in ${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `Expires in ${hours} hour${hours > 1 ? "s" : ""}`;
  return `Expires in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
}

export const CLAIM_EXPLANATIONS: Record<string, string> = {
  iss: "Issuer — Who created and signed this token",
  sub: "Subject — The user or entity this token represents",
  aud: "Audience — The intended recipient(s) of this token",
  exp: "Expiration Time — When this token becomes invalid (Unix timestamp)",
  nbf: "Not Before — Token is invalid before this time (Unix timestamp)",
  iat: "Issued At — When this token was created (Unix timestamp)",
  jti: "JWT ID — Unique identifier for this token (prevents replay attacks)",
  name: "Full Name — User's display name",
  email: "Email — User's email address",
  email_verified: "Email Verified — Whether the user's email has been confirmed",
  scope: "Scope — Permissions or access levels granted by this token",
  roles: "Roles — Authorization roles assigned to the user",
  role: "Role — Authorization role assigned to the user",
  azp: "Authorized Party — The client that was issued this token",
  nonce: "Nonce — Value used to associate a client session with an ID token",
  auth_time: "Authentication Time — When the user last authenticated",
  at_hash: "Access Token Hash — Hash of the access token for validation",
  typ: "Type — The type of token (usually 'JWT')",
  alg: "Algorithm — The signing algorithm used",
  kid: "Key ID — Identifier for the key used to sign this token",
};
