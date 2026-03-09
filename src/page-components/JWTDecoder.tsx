"use client";

import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import { decodeJWT, formatTimestamp, getAlgorithmRisk, getExpiryMessage, CLAIM_EXPLANATIONS } from "@/lib/tools/jwt";
import { Shield, ShieldAlert, ShieldX, Info } from "lucide-react";

const TABS = ["Header", "Payload", "Signature"] as const;

export default function JWTDecoderPage() {
  const [input, setInput] = useLocalStorage("devforge-jwt-input", "");
  const debounced = useDebounce(input, 200);
  const [tab, setTab] = useState<typeof TABS[number]>("Payload");
  const [showExplanations, setShowExplanations] = useState(true);

  const result = debounced.trim() ? decodeJWT(debounced) : null;
  const algoRisk = result?.header?.alg ? getAlgorithmRisk(result.header.alg as string) : null;
  const expiryMsg = result?.payload ? getExpiryMessage(result.payload) : null;

  const getOutput = () => {
    if (!result) return "";
    if (result.error) return result.error;
    if (tab === "Header") return JSON.stringify(result.header, null, 2);
    if (tab === "Payload") {
      if (!result.payload) return "";
      const display = { ...result.payload };
      if (typeof display.exp === "number") display._exp_human = formatTimestamp(display.exp);
      if (typeof display.iat === "number") display._iat_human = formatTimestamp(display.iat);
      if (typeof display.nbf === "number") display._nbf_human = formatTimestamp(display.nbf);
      return JSON.stringify(display, null, 2);
    }
    return `Signature: ${result.signature}\n\n⚠️ Cannot verify signature without the secret key.\nThis tool only decodes — it does not validate.`;
  };

  // Token visualization
  const parts = debounced.trim().split(".");
  const segmentLabels = ["HEADER", "PAYLOAD", "SIGNATURE"];
  const segmentColors = [
    "text-primary bg-primary/10 border-primary/30",
    "text-accent bg-accent/10 border-accent/30",
    "text-destructive bg-destructive/10 border-destructive/30",
  ];

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
      {/* Token Anatomy Diagram */}
      {parts.length === 3 && debounced.trim() && (
        <div className="mb-6 space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Token Anatomy</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {parts.map((p, i) => (
              <div key={i} className={`rounded-lg border p-3 ${segmentColors[i]} transition-all hover:scale-[1.02]`}>
                <p className="text-[10px] font-mono font-bold mb-1 opacity-70">{segmentLabels[i]}</p>
                <p className="font-mono text-xs break-all line-clamp-2">{p}</p>
              </div>
            ))}
          </div>
          <div className="font-mono text-xs break-all p-3 rounded-lg bg-surface border border-border">
            {parts.map((p, i) => (
              <span key={i}>
                <span className={segmentColors[i].split(" ")[0]}>{p}</span>
                {i < 2 && <span className="text-muted-foreground font-bold">.</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Risk + Expiry Badges */}
      {result && !result.error && (
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Expiry status */}
          {result.isExpired !== null && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono ${result.isExpired ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-accent/20 text-accent border border-accent/30"}`}>
              {result.isExpired ? "⚠ EXPIRED" : "✓ VALID"}
              {expiryMsg && <span className="opacity-70">— {expiryMsg}</span>}
            </span>
          )}

          {/* Algorithm risk */}
          {algoRisk && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border ${
              algoRisk.risk === "critical" ? "bg-destructive/20 text-destructive border-destructive/30" :
              algoRisk.risk === "warn" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
              "bg-accent/20 text-accent border-accent/30"
            }`}>
              {algoRisk.risk === "critical" ? <ShieldX className="w-3.5 h-3.5" /> :
               algoRisk.risk === "warn" ? <ShieldAlert className="w-3.5 h-3.5" /> :
               <Shield className="w-3.5 h-3.5" />}
              {result.header?.alg as string} — {algoRisk.label}
            </span>
          )}
        </div>
      )}

      {/* Algorithm risk description */}
      {algoRisk && result && !result.error && (
        <div className={`mb-4 p-3 rounded-lg text-xs font-mono border ${
          algoRisk.risk === "critical" ? "bg-destructive/10 border-destructive/30 text-destructive" :
          algoRisk.risk === "warn" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
          "bg-accent/10 border-accent/30 text-accent"
        }`}>
          {algoRisk.description}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodePanel value={input} onChange={setInput} label="JWT Input" placeholder="Paste your JWT token here..." minHeight="200px" />
        <div>
          <div className="flex gap-1 mb-2 items-center">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-surface2 text-muted-foreground hover:text-foreground"}`}>
                {t}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={showExplanations} onChange={e => setShowExplanations(e.target.checked)} className="accent-primary" />
              Explain claims
            </label>
          </div>
          <CodePanel value={getOutput()} readOnly label={`${tab} Output`} minHeight="200px" />
        </div>
      </div>

      {/* Claim Explanations */}
      {showExplanations && result?.payload && !result.error && (
        <div className="mt-4 rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-mono text-muted-foreground mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Claim Reference
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.keys(result.payload).filter(k => !k.startsWith("_")).map(key => (
              <div key={key} className="flex gap-2 text-xs font-mono p-2 rounded bg-surface2/50">
                <span className="text-primary font-bold shrink-0">{key}</span>
                <span className="text-muted-foreground">
                  {CLAIM_EXPLANATIONS[key] || "Custom claim"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
