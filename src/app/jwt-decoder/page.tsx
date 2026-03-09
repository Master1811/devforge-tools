import type { Metadata } from "next";
import JWTDecoderPage from "@/page-components/JWTDecoder";

export const metadata: Metadata = {
  title: "JWT Decoder & Debugger Online",
  description: "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration — no signup required.",
  keywords: ["jwt decoder online", "decode jwt token", "jwt payload viewer", "debug jwt token"],
  openGraph: {
    title: "JWT Decoder & Debugger Online | DevForge",
    description: "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration — no signup required.",
    url: "https://devforge.tools/jwt-decoder",
  },
  alternates: {
    canonical: "https://devforge.tools/jwt-decoder",
  },
};

export default function Page() {
  return <JWTDecoderPage />;
}

