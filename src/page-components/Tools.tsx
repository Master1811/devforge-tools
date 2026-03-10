"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ToolCard from "@/components/shared/ToolCard";
import { KeyRound, Braces, Database, Clock, Regex, Binary, Terminal, FileJson, FileText, Lock, Zap, Globe, Shield, Search, Filter, Code } from "lucide-react";

const allTools = [
  {
    name: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration — no signup required.",
    path: "/jwt-decoder",
    icon: KeyRound,
    tags: ["auth", "security", "debugging"],
    keywords: ["jwt", "token", "decode", "inspect", "header", "payload", "signature", "expiration"]
  },
  {
    name: "JSON to BigQuery Schema",
    description: "Generate BigQuery table schemas from JSON data. Handles nested objects, arrays, and automatic type inference.",
    path: "/json-to-bigquery-schema",
    icon: Braces,
    tags: ["bigquery", "json", "schema", "database"],
    keywords: ["json", "bigquery", "schema", "bq", "table", "type", "inference", "nested"]
  },
  {
    name: "JSON to TypeScript",
    description: "Convert JSON data to TypeScript interfaces, types, Zod schemas, or Yup validation schemas with automatic type inference.",
    path: "/json-to-typescript",
    icon: Code,
    tags: ["typescript", "json", "schema", "types"],
    keywords: ["json", "typescript", "interface", "type", "zod", "yup", "schema", "inference"]
  },
  {
    name: "SQL Optimizer",
    description: "Analyze SQL queries for performance issues in Snowflake and Databricks. Detect optimization opportunities.",
    path: "/sql-optimizer",
    icon: Database,
    tags: ["database", "sql", "optimization", "performance"],
    keywords: ["sql", "optimizer", "snowflake", "databricks", "performance", "query", "analysis"]
  },
  {
    name: "Cron Visualizer",
    description: "Human-readable cron expressions. See when your scheduled tasks will run next.",
    path: "/cron-visualizer",
    icon: Clock,
    tags: ["scheduling", "cron", "automation", "time"],
    keywords: ["cron", "scheduler", "expression", "schedule", "automation", "timing"]
  },
  {
    name: "RegEx Tester",
    description: "Test regular expressions in real-time. See matches highlighted with capture groups and performance profiling.",
    path: "/regex-tester",
    icon: Regex,
    tags: ["regex", "patterns", "validation", "text"],
    keywords: ["regex", "regular expression", "pattern", "test", "match", "capture", "validation"]
  },
  {
    name: "Base64 Encoder",
    description: "Encode and decode Base64 strings and files. Detect content types automatically.",
    path: "/base64-encoder",
    icon: Binary,
    tags: ["encoding", "base64", "files", "data"],
    keywords: ["base64", "encode", "decode", "binary", "file", "data", "encoding"]
  },
  {
    name: "cURL Converter",
    description: "Convert curl commands to any language. Generate fetch, axios, requests, and more.",
    path: "/curl-converter",
    icon: Terminal,
    tags: ["api", "curl", "http", "conversion"],
    keywords: ["curl", "converter", "api", "http", "fetch", "axios", "requests", "python"]
  },
  {
    name: "YAML ↔ JSON",
    description: "Convert between YAML and JSON formats. Bidirectional conversion with validation.",
    path: "/yaml-json-converter",
    icon: FileJson,
    tags: ["yaml", "json", "config", "conversion"],
    keywords: ["yaml", "json", "converter", "config", "configuration", "format"]
  },
  {
    name: "Markdown Previewer",
    description: "Live markdown editor with instant preview. Write documentation with real-time rendering.",
    path: "/markdown-previewer",
    icon: FileText,
    tags: ["markdown", "docs", "writing", "preview"],
    keywords: ["markdown", "preview", "editor", "documentation", "writing", "render"]
  },
  {
    name: "Password Policy Auditor",
    description: "Validate passwords against enterprise security policies including NIST, OWASP, and corporate standards.",
    path: "/password-policy-auditor",
    icon: Shield,
    tags: ["security", "password", "policy", "enterprise"],
    keywords: ["password", "policy", "auditor", "nist", "owasp", "corporate", "security", "compliance"]
  },
];

const categories = [
  { id: "all", label: "All Tools", count: allTools.length },
  { id: "auth", label: "Authentication", count: allTools.filter(t => t.tags.includes("auth")).length },
  { id: "api", label: "API Tools", count: allTools.filter(t => t.tags.includes("api")).length },
  { id: "database", label: "Database", count: allTools.filter(t => t.tags.includes("database")).length },
  { id: "text", label: "Text Processing", count: allTools.filter(t => t.tags.includes("text")).length },
  { id: "security", label: "Security", count: allTools.filter(t => t.tags.includes("security")).length },
  { id: "conversion", label: "Converters", count: allTools.filter(t => t.tags.includes("conversion")).length },
];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = searchQuery === "" ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || tool.tags.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <main className="pt-20 pb-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold mb-4"
            >
              Developer Tools Directory
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              Free, fast, and privacy-focused developer tools. All processing happens in your browser — your data never leaves your machine.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </motion.div>
          </div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link href={tool.path}>
                  <ToolCard {...tool} tag={tool.tags[0] || "tool"} index={index} />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools found matching your criteria.</p>
            </div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-surface rounded-xl p-8 border border-border"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Why Choose DevForge Tools?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-muted-foreground">All tools run client-side. Your code and data never leave your browser.</p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Sub-millisecond processing with no server round-trips or loading spinners.</p>
              </div>
              <div className="text-center">
                <Globe className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Free Forever</h3>
                <p className="text-muted-foreground">No signups, no subscriptions, no ads. Just powerful developer tools.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}