export function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  try {
    return decodeURIComponent(
      atob(s).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
  } catch { return atob(s); }
}

export function base64UrlEncode(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export interface JWTResult {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  isExpired: boolean | null;
  error?: string;
  raw?: string;
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
    return { header, payload, signature, isExpired, raw: token.trim() };
  } catch (e) {
    return { header: null, payload: null, signature: "", isExpired: null, error: "Failed to decode JWT: " + (e as Error).message };
  }
}

// ============== BATCH DECODING ==============
export interface BatchDecodeResult {
  index: number;
  token: string;
  result: JWTResult;
}

export function decodeBatchJWTs(tokens: string): BatchDecodeResult[] {
  const lines = tokens.split(/[\n,;]+/).map(t => t.trim()).filter(Boolean);
  return lines.map((token, index) => ({
    index,
    token: token.length > 50 ? token.slice(0, 25) + "..." + token.slice(-20) : token,
    result: decodeJWT(token),
  }));
}

// ============== TOKEN COMPARISON ==============
export interface TokenDiff {
  field: string;
  path: string;
  token1Value: unknown;
  token2Value: unknown;
  type: "added" | "removed" | "changed" | "unchanged";
}

export interface TokenCompareResult {
  headerDiffs: TokenDiff[];
  payloadDiffs: TokenDiff[];
  signatureMatch: boolean;
  summary: {
    totalDiffs: number;
    headerChanges: number;
    payloadChanges: number;
  };
}

function compareObjects(obj1: Record<string, unknown> | null, obj2: Record<string, unknown> | null, prefix: string): TokenDiff[] {
  const diffs: TokenDiff[] = [];
  const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

  for (const key of allKeys) {
    const v1 = obj1?.[key];
    const v2 = obj2?.[key];
    const path = prefix ? `${prefix}.${key}` : key;

    if (v1 === undefined && v2 !== undefined) {
      diffs.push({ field: key, path, token1Value: undefined, token2Value: v2, type: "added" });
    } else if (v1 !== undefined && v2 === undefined) {
      diffs.push({ field: key, path, token1Value: v1, token2Value: undefined, type: "removed" });
    } else if (JSON.stringify(v1) !== JSON.stringify(v2)) {
      diffs.push({ field: key, path, token1Value: v1, token2Value: v2, type: "changed" });
    }
  }

  return diffs;
}

export function compareJWTs(token1: string, token2: string): TokenCompareResult {
  const result1 = decodeJWT(token1);
  const result2 = decodeJWT(token2);

  const headerDiffs = compareObjects(result1.header, result2.header, "header");
  const payloadDiffs = compareObjects(result1.payload, result2.payload, "payload");
  const signatureMatch = result1.signature === result2.signature;

  return {
    headerDiffs,
    payloadDiffs,
    signatureMatch,
    summary: {
      totalDiffs: headerDiffs.length + payloadDiffs.length + (signatureMatch ? 0 : 1),
      headerChanges: headerDiffs.length,
      payloadChanges: payloadDiffs.length,
    },
  };
}

// ============== SIGNATURE VERIFICATION SIMULATION ==============
export type SignatureVerifyResult = {
  valid: boolean;
  algorithm: string;
  message: string;
  details?: string;
};

// HMAC-SHA256 simulation using Web Crypto API
async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSha384(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-384" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSha512(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [A-Z ]+-----/g, "")
    .replace(/-----END [A-Z ]+-----/g, "")
    .replace(/\s/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function verifyRS256(token: string, publicKey: string): Promise<boolean> {
  const parts = token.split(".");
  const message = `${parts[0]}.${parts[1]}`;
  const signature = parts[2];

  // Convert base64url signature to ArrayBuffer
  let sig = signature.replace(/-/g, "+").replace(/_/g, "/");
  while (sig.length % 4) sig += "=";
  const sigBinary = atob(sig);
  const sigBytes = new Uint8Array(sigBinary.length);
  for (let i = 0; i < sigBinary.length; i++) sigBytes[i] = sigBinary.charCodeAt(i);

  const keyData = pemToArrayBuffer(publicKey);
  const cryptoKey = await crypto.subtle.importKey(
    "spki",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const encoder = new TextEncoder();
  return crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, sigBytes, encoder.encode(message));
}

export async function verifyJWTSignature(token: string, secret: string): Promise<SignatureVerifyResult> {
  const result = decodeJWT(token);

  if (result.error || !result.header) {
    return { valid: false, algorithm: "unknown", message: "Invalid token format", details: result.error };
  }

  const alg = (result.header.alg as string || "").toUpperCase();
  const parts = token.trim().split(".");
  const message = `${parts[0]}.${parts[1]}`;
  const providedSignature = parts[2];

  try {
    if (alg === "NONE") {
      return {
        valid: providedSignature === "",
        algorithm: alg,
        message: providedSignature === "" ? "Token has no signature (alg=none)" : "Invalid signature for alg=none",
        details: "⚠️ Tokens with alg=none are insecure and should never be trusted"
      };
    }

    if (alg === "HS256") {
      const expectedSignature = await hmacSha256(secret, message);
      const valid = expectedSignature === providedSignature;
      return {
        valid,
        algorithm: alg,
        message: valid ? "✓ Signature verified successfully" : "✗ Signature mismatch",
        details: valid ? "The provided secret correctly generates the expected signature" : "The provided secret does not match. Check that you're using the correct secret key."
      };
    }

    if (alg === "HS384") {
      const expectedSignature = await hmacSha384(secret, message);
      const valid = expectedSignature === providedSignature;
      return {
        valid,
        algorithm: alg,
        message: valid ? "✓ Signature verified successfully" : "✗ Signature mismatch",
        details: valid ? "The provided secret correctly generates the expected signature" : "The provided secret does not match."
      };
    }

    if (alg === "HS512") {
      const expectedSignature = await hmacSha512(secret, message);
      const valid = expectedSignature === providedSignature;
      return {
        valid,
        algorithm: alg,
        message: valid ? "✓ Signature verified successfully" : "✗ Signature mismatch",
        details: valid ? "The provided secret correctly generates the expected signature" : "The provided secret does not match."
      };
    }

    if (alg === "RS256" || alg === "RS384" || alg === "RS512") {
      if (!secret.includes("-----BEGIN")) {
        return {
          valid: false,
          algorithm: alg,
          message: "Public key required for RSA verification",
          details: "Please provide a PEM-encoded public key (-----BEGIN PUBLIC KEY-----)"
        };
      }
      try {
        const valid = await verifyRS256(token, secret);
        return {
          valid,
          algorithm: alg,
          message: valid ? "✓ Signature verified successfully" : "✗ Signature mismatch",
          details: valid ? "The public key successfully verified the signature" : "The signature does not match the provided public key"
        };
      } catch (e) {
        return {
          valid: false,
          algorithm: alg,
          message: "RSA verification failed",
          details: "Error: " + (e as Error).message + ". Make sure you're using the correct public key format."
        };
      }
    }

    if (alg.startsWith("ES") || alg === "EDDSA") {
      return {
        valid: false,
        algorithm: alg,
        message: `${alg} verification not yet supported`,
        details: "Elliptic curve and EdDSA algorithms require specialized handling. This tool currently supports HS256/384/512 and RS256."
      };
    }

    return {
      valid: false,
      algorithm: alg,
      message: `Unknown algorithm: ${alg}`,
      details: "This algorithm is not recognized. Supported algorithms: HS256, HS384, HS512, RS256"
    };
  } catch (e) {
    return {
      valid: false,
      algorithm: alg,
      message: "Verification error",
      details: (e as Error).message
    };
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
