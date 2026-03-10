import type { Metadata } from "next";
import PasswordPolicyAuditorPage from "@/page-components/PasswordGenerator";

export const metadata: Metadata = {
  title: "Enterprise Password Policy Auditor",
  description: "Validate passwords against enterprise security policies including NIST, OWASP, and corporate standards. Check complexity, entropy, and compliance requirements.",
  keywords: ["password policy auditor", "enterprise password validation", "nist password policy", "owasp password guidelines", "corporate password requirements"],
  openGraph: {
    title: "Enterprise Password Policy Auditor | DevForge",
    description: "Validate passwords against enterprise security policies. Free online tool.",
    url: "https://devforge.tools/password-policy-auditor",
  },
  alternates: {
    canonical: "https://devforge.tools/password-policy-auditor",
  },
};

export default function Page() {
  return <PasswordPolicyAuditorPage />;
}

