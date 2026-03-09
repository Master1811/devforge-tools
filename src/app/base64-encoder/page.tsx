import type { Metadata } from "next";
import Base64EncoderPage from "@/page-components/Base64Encoder";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder Online",
  description: "Encode and decode Base64 strings and files instantly. Supports text and file encoding with URL-safe option.",
  keywords: ["base64 encoder", "base64 decoder", "base64 online", "encode base64"],
  openGraph: {
    title: "Base64 Encoder & Decoder Online | DevForge",
    description: "Encode and decode Base64 strings and files instantly. Free online tool.",
    url: "https://devforge.tools/base64-encoder",
  },
  alternates: {
    canonical: "https://devforge.tools/base64-encoder",
  },
};

export default function Page() {
  return <Base64EncoderPage />;
}

