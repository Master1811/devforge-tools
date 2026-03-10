"use client";

import { useState } from "react";
import ToolLayout from "@/components/shared/ToolLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDebounce } from "@/hooks/useDebounce";
import {
  auditPasswordPolicy,
  auditPasswordAgainstAllPolicies,
  calculatePasswordEntropy,
  PASSWORD_POLICIES
} from "@/lib/tools/passwordAuditor";
import { Shield, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

type PolicyKey = keyof typeof PASSWORD_POLICIES;

export default function PasswordPolicyAuditorPage() {
  const [password, setPassword] = useLocalStorage("devforge-pw-audit-input", "");
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyKey>("corporate");
  const debouncedPassword = useDebounce(password, 300);

  const auditResult = debouncedPassword.trim()
    ? auditPasswordPolicy(debouncedPassword, selectedPolicy)
    : null;

  const allPoliciesResult = debouncedPassword.trim()
    ? auditPasswordAgainstAllPolicies(debouncedPassword)
    : [];

  const entropy = debouncedPassword ? calculatePasswordEntropy(debouncedPassword) : 0;

  const getSeverityIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <ToolLayout
      title="Enterprise Password Policy Auditor"
      slug="password-policy-auditor"
      description="Validate passwords against enterprise security policies including NIST, OWASP, and corporate standards. Check complexity, entropy, and compliance requirements."
      keywords={["password policy auditor", "enterprise password validation", "nist password policy", "owasp password guidelines", "corporate password requirements"]}
      howToUse={[
        "Enter a password to audit in the input field.",
        "Select a security policy (NIST, OWASP, Corporate) to validate against.",
        "Review the compliance score and specific violations.",
        "See how the password performs against all policies simultaneously."
      ]}
      whatIs={{
        title: "What is Enterprise Password Policy Auditing?",
        content: "Enterprise password policies enforce security standards to protect against credential-based attacks. This auditor validates passwords against industry frameworks like NIST 800-63B (government standard), OWASP guidelines (web application security), and common corporate requirements. It checks character complexity, length requirements, entropy calculations, and blacklisted patterns. The tool provides compliance scores and actionable recommendations for password policy enforcement. All analysis happens in your browser — passwords are never transmitted or stored on any server."
      }}
      faqs={[
        {
          q: "What policies are supported?",
          a: "We support NIST 800-63B (government standard), OWASP guidelines (web application security), and common Corporate password requirements with customizable complexity rules."
        },
        {
          q: "How is entropy calculated?",
          a: "Entropy measures password randomness using the formula: log2(charset_size ^ length). Higher entropy means stronger passwords that are harder to crack."
        },
        {
          q: "Can I customize policies?",
          a: "Currently we provide industry-standard policies. For custom policies, consider the rules as a foundation and adjust your requirements accordingly."
        },
        {
          q: "Is this for enforcing policies or just auditing?",
          a: "This is an auditing tool to validate passwords against policies. For enforcement, integrate these rules into your authentication systems."
        },
        {
          q: "What makes a password compliant?",
          a: "Compliance depends on the selected policy. Generally, longer passwords with mixed character types and good entropy are more secure and compliant."
        },
      ]}
      relatedTools={[
        {
          name: "JWT Decoder",
          path: "/jwt-decoder",
          description: "Decode and validate JWT tokens for authentication systems."
        },
        {
          name: "Base64 Encoder",
          path: "/base64-encoder",
          description: "Encode sensitive data for secure transmission."
        },
        {
          name: "Regex Tester",
          path: "/regex-tester",
          description: "Test password validation regex patterns."
        },
      ]}
    >
      <div className="space-y-6">
        {/* Policy Selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PASSWORD_POLICIES) as PolicyKey[]).map(policy => (
            <button
              key={policy}
              onClick={() => setSelectedPolicy(policy)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                selectedPolicy === policy
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface border-border hover:bg-surface2"
              }`}
            >
              {PASSWORD_POLICIES[policy].name}
            </button>
          ))}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Password to Audit
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to validate..."
            className="w-full px-4 py-3 border border-[hsl(var(--foreground)/0.1)] rounded-lg bg-[hsl(var(--card))] text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-[hsl(var(--foreground)/0.2)] hover:border-[hsl(var(--foreground)/0.15)] placeholder:text-muted-foreground/50 caret-primary transition-[border-color,box-shadow] duration-200 selection:bg-primary/20"
          />
        </div>

        {auditResult && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Policy Results */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{auditResult.policy} Policy Results</h3>
              </div>

              {/* Score */}
              <div className="p-4 rounded-lg bg-surface border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Compliance Score</span>
                  <span className={`text-lg font-bold ${auditResult.score >= 80 ? 'text-green-600' : auditResult.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {auditResult.score}/100
                  </span>
                </div>
                <div className="w-full bg-surface2 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      auditResult.score >= 80 ? 'bg-green-500' : auditResult.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${auditResult.score}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">Entropy: {entropy.toFixed(1)} bits</span>
                  {auditResult.passed && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
              </div>

              {/* Violations */}
              {auditResult.violations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Violations</h4>
                  {auditResult.violations.map((violation, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(violation.severity)}`}>
                      <div className="flex items-start gap-2">
                        {getSeverityIcon(violation.severity)}
                        <span className="text-sm">{violation.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {auditResult.violations.length === 0 && (
                <div className="p-3 rounded-lg border bg-green-50 border-green-200 text-green-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">All requirements met!</span>
                  </div>
                </div>
              )}
            </div>

            {/* All Policies Comparison */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">All Policies Comparison</h3>
              <div className="space-y-3">
                {allPoliciesResult.map(result => (
                  <div key={result.policy} className="p-3 rounded-lg bg-surface border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{result.policy}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${result.score >= 80 ? 'text-accent' : result.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {result.score}/100
                        </span>
                        {result.passed && <CheckCircle className="w-4 h-4 text-accent" />}
                      </div>
                    </div>
                    <div className="w-full bg-surface2 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          result.score >= 80 ? 'bg-accent' : result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
