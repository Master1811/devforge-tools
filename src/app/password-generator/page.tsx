import type { Metadata } from "next";
import PasswordGeneratorPage from "@/page-components/PasswordGenerator";

export const metadata: Metadata = {
  title: "Secure Password Generator Online",
  description: "Generate cryptographically secure passwords and passphrases. Customizable length, character sets, and entropy display.",
  keywords: ["password generator", "secure password", "random password", "passphrase generator"],
  openGraph: {
    title: "Secure Password Generator Online | DevForge",
    description: "Generate cryptographically secure passwords and passphrases. Free online tool.",
    url: "https://devforge.tools/password-generator",
  },
  alternates: {
    canonical: "https://devforge.tools/password-generator",
  },
};

export default function Page() {
  return <PasswordGeneratorPage />;
}

