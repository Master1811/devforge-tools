"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ToolLayout from "@/components/shared/ToolLayout";
import CodePanel from "@/components/shared/CodePanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import {
  decodeJWT, formatTimestamp, getAlgorithmRisk, getExpiryMessage, CLAIM_EXPLANATIONS,
  verifyJWTSignature, compareJWTs, decodeBatchJWTs,
  SignatureVerifyResult, TokenCompareResult, BatchDecodeResult
} from "@/lib/tools/jwt";
import { Shield, ShieldAlert, ShieldX, Info, Key, GitCompare, Layers, CheckCircle, XCircle, AlertTriangle, Minus, Plus, ChevronDown, ChevronRight, Copy } from "lucide-react";

const TABS = ["Header", "Payload", "Signature"] as const;
const MODES = ["decode", "verify", "compare", "batch"] as const;
type Mode = typeof MODES[number];

export default function JWTDecoderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useLocalStorage("devforge-jwt-input", "");
  const debounced = useDebounce(input, 200);
  const [tab, setTab] = useState<typeof TABS[number]>("Payload");
  const [showExplanations, setShowExplanations] = useState(true);
  const [mode, setMode] = useState<Mode>("decode");

  // Verify mode state
  const [secret, setSecret] = useState("");
  const [verifyResult, setVerifyResult] = useState<SignatureVerifyResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Compare mode state
  const [token2, setToken2] = useLocalStorage("devforge-jwt-compare", "");
  const [compareResult, setCompareResult] = useState<TokenCompareResult | null>(null);

  // Batch mode state
  const [batchInput, setBatchInput] = useLocalStorage("devforge-jwt-batch", "");
  const [batchResults, setBatchResults] = useState<BatchDecodeResult[]>([]);
  const [expandedBatch, setExpandedBatch] = useState<number | null>(null);

  // Read from URL params on mount
  useEffect(() => {
    const token = searchParams.get("token");
    const modeParam = searchParams.get("mode");
    const secretParam = searchParams.get("secret");
    const token2Param = searchParams.get("token2");
    const batchParam = searchParams.get("batch");

    if (token && !input) setInput(token);
    if (modeParam && MODES.includes(modeParam as Mode)) setMode(modeParam as Mode);
    if (secretParam) setSecret(secretParam);
    if (token2Param) setToken2(token2Param);
    if (batchParam) setBatchInput(batchParam);
  }, [searchParams, setInput, setToken2, setBatchInput]);

  // Update URL when inputs change
  useEffect(() => {
    const params = new URLSearchParams();
    if (input.trim()) params.set("token", input.trim());
    if (mode !== "decode") params.set("mode", mode);
    if (secret.trim()) params.set("secret", secret.trim());
    if (token2.trim()) params.set("token2", token2.trim());
    if (batchInput.trim()) params.set("batch", batchInput.trim());

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    if (newUrl !== window.location.search) {
      router.replace(`/jwt-decoder${newUrl}`, { scroll: false });
    }
  }, [input, mode, secret, token2, batchInput, router]);

  const result = debounced.trim() ? decodeJWT(debounced) : null;
  const algoRisk = result?.header?.alg ? getAlgorithmRisk(result.header.alg as string) : null;
  const expiryMsg = result?.payload ? getExpiryMessage(result.payload) : null;

  // Handle signature verification
  const handleVerify = async () => {
    if (!debounced.trim() || !secret.trim()) return;
    setIsVerifying(true);
    try {
      const result = await verifyJWTSignature(debounced.trim(), secret);
      setVerifyResult(result);
    } catch (e) {
      setVerifyResult({ valid: false, algorithm: "unknown", message: "Verification failed", details: (e as Error).message });
    }
    setIsVerifying(false);
  };

  // Handle token comparison
  useEffect(() => {
    if (mode === "compare" && debounced.trim() && token2.trim()) {
      setCompareResult(compareJWTs(debounced.trim(), token2.trim()));
    } else {
      setCompareResult(null);
    }
  }, [mode, debounced, token2]);

  // Handle batch decoding
  useEffect(() => {
    if (mode === "batch" && batchInput.trim()) {
      setBatchResults(decodeBatchJWTs(batchInput));
    } else {
      setBatchResults([]);
    }
  }, [mode, batchInput]);

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
      description="Decode, verify, compare and batch process JSON Web Tokens instantly. View header, payload, verify signatures — no signup required."
      keywords={["jwt decoder online", "decode jwt token", "jwt payload viewer", "debug jwt token", "jwt signature verify", "jwt compare"]}
      howToUse={[
        "Paste your JWT token into the input field to decode instantly.",
        "Use Verify mode to check signatures with your secret key or public key.",
        "Use Compare mode to diff two tokens and see what changed.",
        "Use Batch mode to decode multiple tokens at once.",
      ]}
      whatIs={{
        title: "What is a JSON Web Token (JWT)?",
        content: "A JSON Web Token (JWT) is a compact, URL-safe token format used to securely transmit information between parties as a JSON object. JWTs consist of three parts separated by dots: a header (specifying the algorithm), a payload (containing claims like user ID, expiration, and custom data), and a signature used for verification. JWTs are commonly used in authentication flows — after a user logs in, the server issues a JWT that the client includes in subsequent requests. The token is Base64URL-encoded, meaning you can decode and inspect its contents without the secret key. However, verifying the signature requires the secret or public key. Our jwt decoder online tool lets you instantly inspect any JWT's header and payload, check expiration timestamps, and debug authentication issues — all running entirely in your browser with no data transmitted to any server.",
      }}
      faqs={[
        { q: "Can I verify a JWT signature in this tool?", a: "Yes! Switch to Verify mode and enter your secret key (for HS256/384/512) or public key (for RS256). The tool uses the Web Crypto API to verify signatures locally in your browser." },
        { q: "What does the JWT exp claim mean?", a: "The 'exp' (expiration) claim identifies the time after which the JWT must not be accepted. It's a Unix timestamp in seconds. If the current time is past this value, the token is expired." },
        { q: "Is it safe to decode JWTs in the browser?", a: "Yes, this tool runs 100% client-side. Your token and secret key never leave your browser. However, never paste production secrets into online tools that send data to a server." },
        { q: "Can I compare two JWT tokens?", a: "Yes! Use Compare mode to see the differences between two tokens side by side, including header changes, payload changes, and whether the signatures match." },
        { q: "How do I decode multiple JWTs at once?", a: "Use Batch mode and paste multiple tokens (one per line or comma/semicolon separated). Each token will be decoded and you can expand any result to see details." },
      ]}
      relatedTools={[
        { name: "Base64 Encoder/Decoder", path: "/base64-encoder", description: "Inspect the Base64-encoded segments of your JWT." },
        { name: "JSON to TypeScript", path: "/json-to-typescript", description: "Generate TypeScript types from your JWT payload." },
        { name: "Password Generator", path: "/password-generator", description: "Create secure secrets for JWT signing." },
      ]}
    >
      {/* Mode Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-surface2/50 rounded-lg w-fit">
        {[
          { id: "decode", label: "Decode", icon: Key },
          { id: "verify", label: "Verify", icon: Shield },
          { id: "compare", label: "Compare", icon: GitCompare },
          { id: "batch", label: "Batch", icon: Layers },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as Mode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-mono transition-all ${
              mode === m.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <m.icon className="w-4 h-4" />
            {m.label}
          </button>
        ))}
      </div>

      {/* ============ DECODE MODE ============ */}
      {mode === "decode" && (
        <>
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
              {result.isExpired !== null && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono ${result.isExpired ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-accent/20 text-accent border border-accent/30"}`}>
                  {result.isExpired ? "⚠ EXPIRED" : "✓ VALID"}
                  {expiryMsg && <span className="opacity-70">— {expiryMsg}</span>}
                </span>
              )}
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
                {tab === "Payload" && result?.payload && !result.error && (
                  <button
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(result.payload, null, 2))}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-mono bg-accent/10 text-accent hover:bg-accent/20 transition-colors ml-2"
                    title="Copy payload JSON"
                  >
                    <Copy className="w-3 h-3" />
                    Copy JSON
                  </button>
                )}
                <label className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={showExplanations} onChange={e => setShowExplanations(e.target.checked)} className="accent-primary" />
                  Explain claims
                </label>
              </div>
              <CodePanel value={getOutput()} readOnly label={`${tab} Output`} minHeight="200px" />
            </div>
          </div>

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
        </>
      )}

      {/* ============ VERIFY MODE ============ */}
      {mode === "verify" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodePanel value={input} onChange={setInput} label="JWT Token" placeholder="Paste your JWT token here..." minHeight="150px" />
            <div>
              <label className="text-xs font-mono text-muted-foreground mb-2 block">
                Secret Key (for HS256/384/512) or Public Key (for RS256)
              </label>
              <textarea
                value={secret}
                onChange={e => setSecret(e.target.value)}
                placeholder="Enter your secret key or paste PEM public key..."
                className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--foreground)/0.1)] rounded-lg p-4 font-mono text-sm text-foreground min-h-[150px] focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-[hsl(var(--foreground)/0.2)] hover:border-[hsl(var(--foreground)/0.15)] resize-y placeholder:text-muted-foreground/50 caret-primary transition-[border-color,box-shadow] duration-200 selection:bg-primary/20"
                spellCheck={false}
              />
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={!debounced.trim() || !secret.trim() || isVerifying}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            {isVerifying ? "Verifying..." : "Verify Signature"}
          </button>

          {verifyResult && (
            <div className={`p-4 rounded-lg border ${verifyResult.valid ? "bg-accent/10 border-accent/30" : "bg-destructive/10 border-destructive/30"}`}>
              <div className="flex items-center gap-3 mb-2">
                {verifyResult.valid ? (
                  <CheckCircle className="w-5 h-5 text-accent" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                <span className={`font-mono text-sm font-bold ${verifyResult.valid ? "text-accent" : "text-destructive"}`}>
                  {verifyResult.message}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface2 text-muted-foreground">
                  {verifyResult.algorithm}
                </span>
              </div>
              {verifyResult.details && (
                <p className="text-xs font-mono text-muted-foreground ml-8">{verifyResult.details}</p>
              )}
            </div>
          )}

          <div className="p-4 rounded-lg bg-surface border border-border">
            <p className="text-xs font-mono text-muted-foreground mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Supported Algorithms
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
              <span className="px-2 py-1 rounded bg-accent/20 text-accent">HS256 ✓</span>
              <span className="px-2 py-1 rounded bg-accent/20 text-accent">HS384 ✓</span>
              <span className="px-2 py-1 rounded bg-accent/20 text-accent">HS512 ✓</span>
              <span className="px-2 py-1 rounded bg-accent/20 text-accent">RS256 ✓</span>
              <span className="px-2 py-1 rounded bg-surface2 text-muted-foreground">RS384 (soon)</span>
              <span className="px-2 py-1 rounded bg-surface2 text-muted-foreground">RS512 (soon)</span>
              <span className="px-2 py-1 rounded bg-surface2 text-muted-foreground">ES256 (soon)</span>
              <span className="px-2 py-1 rounded bg-surface2 text-muted-foreground">EdDSA (soon)</span>
            </div>
          </div>
        </div>
      )}

      {/* ============ COMPARE MODE ============ */}
      {mode === "compare" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodePanel value={input} onChange={setInput} label="Token 1 (Base)" placeholder="Paste first JWT token..." minHeight="150px" />
            <CodePanel value={token2} onChange={setToken2} label="Token 2 (Compare)" placeholder="Paste second JWT token..." minHeight="150px" />
          </div>

          {compareResult && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex gap-4 flex-wrap">
                <div className={`px-4 py-2 rounded-lg border ${compareResult.summary.totalDiffs === 0 ? "bg-accent/10 border-accent/30" : "bg-yellow-500/10 border-yellow-500/30"}`}>
                  <span className="text-xs font-mono text-muted-foreground">Total Differences: </span>
                  <span className={`font-mono font-bold ${compareResult.summary.totalDiffs === 0 ? "text-accent" : "text-yellow-400"}`}>
                    {compareResult.summary.totalDiffs}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-lg border ${compareResult.signatureMatch ? "bg-accent/10 border-accent/30" : "bg-destructive/10 border-destructive/30"}`}>
                  <span className="text-xs font-mono text-muted-foreground">Signature: </span>
                  <span className={`font-mono font-bold ${compareResult.signatureMatch ? "text-accent" : "text-destructive"}`}>
                    {compareResult.signatureMatch ? "Match ✓" : "Different ✗"}
                  </span>
                </div>
              </div>

              {/* Header Diffs */}
              {compareResult.headerDiffs.length > 0 && (
                <div className="p-4 rounded-lg bg-surface border border-border">
                  <p className="text-xs font-mono text-primary font-bold mb-3">Header Changes ({compareResult.headerDiffs.length})</p>
                  <div className="space-y-2">
                    {compareResult.headerDiffs.map((diff, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs font-mono p-2 rounded bg-surface2/50">
                        {diff.type === "added" && <Plus className="w-4 h-4 text-accent shrink-0" />}
                        {diff.type === "removed" && <Minus className="w-4 h-4 text-destructive shrink-0" />}
                        {diff.type === "changed" && <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />}
                        <span className="text-foreground font-bold">{diff.field}</span>
                        {diff.type === "changed" && (
                          <span className="text-muted-foreground">
                            <span className="text-destructive line-through">{JSON.stringify(diff.token1Value)}</span>
                            {" → "}
                            <span className="text-accent">{JSON.stringify(diff.token2Value)}</span>
                          </span>
                        )}
                        {diff.type === "added" && <span className="text-accent">{JSON.stringify(diff.token2Value)}</span>}
                        {diff.type === "removed" && <span className="text-destructive">{JSON.stringify(diff.token1Value)}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payload Diffs */}
              {compareResult.payloadDiffs.length > 0 && (
                <div className="p-4 rounded-lg bg-surface border border-border">
                  <p className="text-xs font-mono text-accent font-bold mb-3">Payload Changes ({compareResult.payloadDiffs.length})</p>
                  <div className="space-y-2">
                    {compareResult.payloadDiffs.map((diff, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs font-mono p-2 rounded bg-surface2/50">
                        {diff.type === "added" && <Plus className="w-4 h-4 text-accent shrink-0" />}
                        {diff.type === "removed" && <Minus className="w-4 h-4 text-destructive shrink-0" />}
                        {diff.type === "changed" && <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />}
                        <span className="text-foreground font-bold">{diff.field}</span>
                        {diff.type === "changed" && (
                          <span className="text-muted-foreground">
                            <span className="text-destructive line-through">{JSON.stringify(diff.token1Value)}</span>
                            {" → "}
                            <span className="text-accent">{JSON.stringify(diff.token2Value)}</span>
                          </span>
                        )}
                        {diff.type === "added" && <span className="text-accent">{JSON.stringify(diff.token2Value)}</span>}
                        {diff.type === "removed" && <span className="text-destructive">{JSON.stringify(diff.token1Value)}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {compareResult.summary.totalDiffs === 0 && (
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm font-mono text-accent">Tokens are identical</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============ BATCH MODE ============ */}
      {mode === "batch" && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-2 block">
              Paste multiple JWTs (one per line, or separated by commas/semicolons)
            </label>
            <textarea
              value={batchInput}
              onChange={e => setBatchInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkpvaG4ifQ.Signature1&#10;eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IkphbmUifQ.Signature2"
              className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--foreground)/0.1)] rounded-lg p-4 font-mono text-sm text-foreground min-h-[150px] focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-[hsl(var(--foreground)/0.2)] hover:border-[hsl(var(--foreground)/0.15)] resize-y placeholder:text-muted-foreground/50 caret-primary transition-[border-color,box-shadow] duration-200 selection:bg-primary/20"
              spellCheck={false}
            />
          </div>

          {batchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground">
                Decoded {batchResults.length} token{batchResults.length !== 1 ? "s" : ""}
              </p>
              {batchResults.map((item, i) => (
                <div key={i} className="rounded-lg border border-border bg-surface overflow-hidden">
                  <button
                    onClick={() => setExpandedBatch(expandedBatch === i ? null : i)}
                    className="w-full flex items-center justify-between p-3 hover:bg-surface2/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expandedBatch === i ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                      <span className="font-mono text-sm text-primary">#{item.index + 1}</span>
                      <span className="font-mono text-xs text-muted-foreground truncate max-w-[300px]">{item.token}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.result.error ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-destructive/20 text-destructive font-mono">Error</span>
                      ) : (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono">
                            {item.result.header?.alg as string || "?"}
                          </span>
                          {item.result.isExpired !== null && (
                            <span className={`text-xs px-2 py-0.5 rounded font-mono ${item.result.isExpired ? "bg-destructive/20 text-destructive" : "bg-accent/20 text-accent"}`}>
                              {item.result.isExpired ? "Expired" : "Valid"}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </button>
                  {expandedBatch === i && (
                    <div className="border-t border-border p-4 bg-surface2/30">
                      {item.result.error ? (
                        <p className="text-sm font-mono text-destructive">{item.result.error}</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-mono text-muted-foreground mb-2">Header</p>
                            <pre className="text-xs font-mono bg-surface p-3 rounded overflow-auto max-h-[200px]">
                              {JSON.stringify(item.result.header, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs font-mono text-muted-foreground mb-2">Payload</p>
                            <pre className="text-xs font-mono bg-surface p-3 rounded overflow-auto max-h-[200px]">
                              {JSON.stringify(item.result.payload, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
