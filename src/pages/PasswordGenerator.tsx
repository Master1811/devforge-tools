import { useState, useCallback, useEffect } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  generatePassword, generatePassphrase, calculateEntropy,
  crackTimeEstimate, strengthLabel, PasswordOptions
} from "@/lib/tools/passwordGen";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function PasswordGeneratorPage() {
  const [opts, setOpts] = useLocalStorage<PasswordOptions>("devforge-pw-opts", {
    length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: false,
  });
  const [mode, setMode] = useState<"password" | "passphrase">("password");
  const [phraseWords, setPhraseWords] = useState(4);
  const [delimiter, setDelimiter] = useState("-");
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const pws = Array.from({ length: count }, () =>
      mode === "password" ? generatePassword(opts) : generatePassphrase(phraseWords, delimiter)
    );
    setPasswords(pws);
  }, [opts, mode, phraseWords, delimiter, count]);

  useEffect(() => { generate(); }, [generate]);

  const entropy = mode === "password" ? calculateEntropy(opts) : Math.floor(phraseWords * Math.log2(1000));
  const strength = strengthLabel(entropy);

  const copyPw = (idx: number) => {
    navigator.clipboard.writeText(passwords[idx]);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  // Keyboard shortcut: Space to regenerate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) { e.preventDefault(); generate(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  return (
    <ToolLayout
      title="Secure Password Generator Online"
      slug="password-generator"
      description="Generate cryptographically secure passwords using crypto.getRandomValues(). Entropy scoring, bulk generation — free, no signup."
      keywords={["secure password generator", "random password generator", "strong password generator online"]}
      howToUse={["Configure length, character types, and options.", "Click Regenerate or press Space for a new password.", "Copy your password — it's generated locally and never transmitted."]}
      whatIs={{ title: "What Makes a Password Secure?", content: "A secure password has high entropy — meaning it would take an impractical amount of time for an attacker to guess through brute force. Password strength depends on length and the size of the character set used. Our secure password generator uses crypto.getRandomValues(), a cryptographically secure random number generator built into browsers — unlike Math.random(), which is predictable and unsuitable for security purposes. The tool calculates entropy in bits and estimates crack time assuming 10 billion guesses per second (a realistic rate for modern GPU clusters). A password with 80+ bits of entropy is considered very strong. For maximum security, we also offer passphrase mode — generating random words that are easier to remember but equally secure." }}
      faqs={[
        { q: "Why use crypto.getRandomValues() instead of Math.random()?", a: "Math.random() uses a pseudo-random algorithm that can be predicted. crypto.getRandomValues() uses the operating system's cryptographic random number generator, providing true randomness suitable for security applications." },
        { q: "How long should my password be?", a: "At minimum 12 characters with mixed character types. For sensitive accounts, use 16+ characters. Longer passwords exponentially increase the number of possible combinations." },
        { q: "What are ambiguous characters?", a: "Characters like 0/O (zero/letter O) and l/1 (lowercase L/one) that look similar and cause confusion. Excluding them makes passwords easier to read and type manually." },
        { q: "Is passphrase mode as secure as random characters?", a: "Yes, if you use enough words. A 5-word passphrase from a 1000-word list has about 50 bits of entropy. Use 6+ words for high-security applications." },
        { q: "Is my password stored anywhere?", a: "No. Passwords are generated entirely in your browser using local cryptographic functions. Nothing is transmitted, stored, or logged." },
      ]}
      relatedTools={[
        { name: "JWT Decoder", path: "/jwt-decoder", description: "Generate signing secrets for JWT tokens." },
        { name: "Base64 Encoder", path: "/base64-encoder", description: "Encode passwords for configuration files." },
        { name: "cURL Converter", path: "/curl-converter", description: "Use generated passwords in API authentication." },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button onClick={() => setMode("password")} className={`flex-1 px-3 py-2 text-xs font-mono ${mode === "password" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}>Password</button>
            <button onClick={() => setMode("passphrase")} className={`flex-1 px-3 py-2 text-xs font-mono ${mode === "passphrase" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}>Passphrase</button>
          </div>

          {mode === "password" ? (
            <>
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1 flex justify-between">
                  Length <span className="text-foreground">{opts.length}</span>
                </label>
                <input type="range" min={8} max={128} value={opts.length} onChange={e => setOpts(p => ({ ...p, length: Number(e.target.value) }))} className="w-full accent-primary" />
              </div>
              {[
                ["uppercase", "A-Z"],
                ["lowercase", "a-z"],
                ["numbers", "0-9"],
                ["symbols", "!@#$"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between text-sm cursor-pointer">
                  <span className="text-muted-foreground">{label}</span>
                  <input type="checkbox" checked={(opts as any)[key]} onChange={e => setOpts(p => ({ ...p, [key]: e.target.checked }))} className="accent-primary" />
                </label>
              ))}
              <label className="flex items-center justify-between text-sm cursor-pointer">
                <span className="text-muted-foreground">Exclude ambiguous</span>
                <input type="checkbox" checked={opts.excludeAmbiguous} onChange={e => setOpts(p => ({ ...p, excludeAmbiguous: e.target.checked }))} className="accent-primary" />
              </label>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1 flex justify-between">
                  Words <span className="text-foreground">{phraseWords}</span>
                </label>
                <input type="range" min={3} max={10} value={phraseWords} onChange={e => setPhraseWords(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground mb-1 block">Delimiter</label>
                <input value={delimiter} onChange={e => setDelimiter(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-1.5 font-mono text-sm" />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-mono text-muted-foreground mb-1 block">Bulk generate</label>
            <div className="flex gap-1">
              {[1, 5, 10, 20].map(n => (
                <button key={n} onClick={() => setCount(n)} className={`px-3 py-1.5 rounded text-xs font-mono ${count === n ? "bg-primary text-primary-foreground" : "bg-surface2 border border-border text-muted-foreground"}`}>{n}</button>
              ))}
            </div>
          </div>

          <button onClick={generate} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm hover:bg-primary/90 transition-colors">
            <RefreshCw className="w-4 h-4" /> Regenerate
          </button>
          <p className="text-[10px] font-mono text-muted-foreground text-center">Press Space to regenerate</p>
        </div>

        {/* Output */}
        <div className="lg:col-span-2 space-y-4">
          {/* Strength */}
          <div className="p-4 rounded-lg bg-surface border border-border">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-muted-foreground">Entropy: {entropy} bits</span>
              <span style={{ color: strength.color }}>{strength.label}</span>
            </div>
            <div className="h-2 rounded-full bg-surface2 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${strength.percent}%`, backgroundColor: strength.color }} />
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-2">Crack time (10B guesses/sec): {crackTimeEstimate(entropy)}</p>
          </div>

          {/* Passwords */}
          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-surface border border-border group">
                <code className="flex-1 font-mono text-sm break-all select-all">{pw}</code>
                <button onClick={() => copyPw(i)} className="shrink-0 p-1.5 rounded hover:bg-muted transition-colors">
                  {copied === i ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-xs font-mono text-accent">
            🔒 Generated locally in your browser. Never transmitted.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
