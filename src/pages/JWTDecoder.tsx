import { useState, useCallback } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { decodeJWT, formatTimestamp } from "@/lib/tools/jwt";

const TABS = ["Header", "Payload", "Signature"] as const;

export default function JWTDecoderPage() {
  const [input, setInput] = useLocalStorage("devforge-jwt-input", "");
  const debounced = useDebounce(input, 200);
  const [tab, setTab] = useState<typeof TABS[number]>("Payload");

  const result = debounced.trim() ? decodeJWT(debounced) : null;

  const getOutput = () => {
    if (!result) return "";
    if (result.error) return result.error;
    if (tab === "Header") return JSON.stringify(result.header, null, 2);
    if (tab === "Payload") {
      if (!result.payload) return "";
      const display = { ...result.payload };
      if (display.exp) display._exp_human = formatTimestamp(display.exp);
      if (display.iat) display._iat_human = formatTimestamp(display.iat);
      if (display.nbf) display._nbf_human = formatTimestamp(display.nbf);
      return JSON.stringify(display, null, 2);
    }
    return `Signature: ${result.signature}\n\n⚠️ Cannot verify signature without the secret key.\nThis tool only decodes — it does not validate.`;
  };

  // Token visualization
  const parts = debounced.trim().split(".");
  const colors = ["text-primary", "text-accent", "text-destructive"];

  return (
    <ToolLayout
      title="JWT Decoder & Debugger Online"
      slug="jwt-decoder"
      description="Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration — no signup required."
      keywords={["jwt decoder online", "decode jwt token", "jwt payload viewer", "debug jwt token"]}
      howToUse={[
        "Paste your JWT token into the input field.",
        "The decoder automatically splits and decodes the header and payload.",
        "Review the claims, check expiry status, and copy individual sections.",
      ]}
      whatIs={{
        title: "What is a JSON Web Token (JWT)?",
        content: "A JSON Web Token (JWT) is a compact, URL-safe token format used to securely transmit information between parties as a JSON object. JWTs consist of three parts separated by dots: a header (specifying the algorithm), a payload (containing claims like user ID, expiration, and custom data), and a signature used for verification. JWTs are commonly used in authentication flows — after a user logs in, the server issues a JWT that the client includes in subsequent requests. The token is Base64URL-encoded, meaning you can decode and inspect its contents without the secret key. However, verifying the signature requires the secret or public key. Our jwt decoder online tool lets you instantly inspect any JWT's header and payload, check expiration timestamps, and debug authentication issues — all running entirely in your browser with no data transmitted to any server.",
      }}
      faqs={[
        { q: "Can I verify a JWT without the secret?", a: "No. You can decode and read the header and payload without the secret, but verifying the signature requires the signing key. This tool decodes the token for inspection purposes only." },
        { q: "What does the JWT exp claim mean?", a: "The 'exp' (expiration) claim identifies the time after which the JWT must not be accepted. It's a Unix timestamp in seconds. If the current time is past this value, the token is expired." },
        { q: "Is it safe to decode JWTs in the browser?", a: "Yes, this tool runs 100% client-side. Your token never leaves your browser. However, never paste production tokens containing sensitive data into online tools that send data to a server." },
        { q: "What is the difference between JWT and session tokens?", a: "Session tokens are opaque identifiers stored server-side, while JWTs are self-contained tokens that carry their own data. JWTs are stateless — the server doesn't need to store session data." },
        { q: "Why is my JWT showing as expired?", a: "The token's 'exp' claim timestamp is in the past relative to your system clock. Check that your server and client clocks are synchronized, and that the token lifetime is appropriate for your use case." },
      ]}
      relatedTools={[
        { name: "Base64 Encoder/Decoder", path: "/base64-encoder", description: "Inspect the Base64-encoded segments of your JWT." },
        { name: "JSON to TypeScript", path: "/json-to-typescript", description: "Generate TypeScript types from your JWT payload." },
        { name: "Password Generator", path: "/password-generator", description: "Create secure secrets for JWT signing." },
      ]}
    >
      {/* Token visualization */}
      {parts.length === 3 && debounced.trim() && (
        <div className="mb-4 p-3 rounded-lg bg-surface border border-border font-mono text-xs break-all">
          {parts.map((p, i) => (
            <span key={i}>
              <span className={colors[i]}>{p}</span>
              {i < 2 && <span className="text-muted-foreground">.</span>}
            </span>
          ))}
        </div>
      )}

      {/* Status badge */}
      {result && result.isExpired !== null && (
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono ${result.isExpired ? "bg-destructive/20 text-destructive" : "bg-accent/20 text-accent"}`}>
            {result.isExpired ? "⚠ EXPIRED" : "✓ VALID"}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="JWT Input" placeholder="Paste your JWT token here..." minHeight="200px" />
        <div>
          <div className="flex gap-1 mb-2">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-surface2 text-muted-foreground hover:text-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
          <CodePanel value={getOutput()} readOnly label={`${tab} Output`} minHeight="200px" />
        </div>
      </div>
    </ToolLayout>
  );
}
