"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Book, ChevronRight, Search, Code, Zap, Shield, Globe, FileText, KeyRound, Database, Regex, Terminal } from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    icon: Book,
    items: [
      { title: "Introduction to DevForge Tools", path: "/docs/introduction", description: "Overview of our developer toolkit" },
      { title: "Privacy & Security", path: "/docs/privacy", description: "How we protect your data" },
      { title: "Browser Compatibility", path: "/docs/browser-support", description: "Supported browsers and features" },
    ]
  },
  {
    title: "Tool Guides",
    icon: Code,
    items: [
      { title: "JWT Decoder Guide", path: "/docs/jwt-decoder", description: "Decode, verify, and debug JWT tokens" },
      { title: "RegEx Tester Tutorial", path: "/docs/regex-tester", description: "Master regular expressions with examples" },
      { title: "SQL Formatter Reference", path: "/docs/sql-formatter", description: "Format and optimize SQL queries" },
      { title: "cURL Converter Examples", path: "/docs/curl-converter", description: "Convert API calls to any language" },
      { title: "JSON to TypeScript", path: "/docs/json-typescript", description: "Generate types from API responses" },
    ]
  },
  {
    title: "Advanced Topics",
    icon: Zap,
    items: [
      { title: "AI Code Validation", path: "/docs/ai-validation", description: "Debug AI-generated code and data" },
      { title: "API Testing Workflows", path: "/docs/api-testing", description: "End-to-end API development" },
      { title: "Database Optimization", path: "/docs/database-optimization", description: "SQL performance and best practices" },
      { title: "Security Best Practices", path: "/docs/security", description: "Secure coding with our tools" },
    ]
  },
  {
    title: "Examples & Use Cases",
    icon: FileText,
    items: [
      { title: "Real-World Examples", path: "/examples", description: "Practical examples for each tool" },
      { title: "Common Patterns", path: "/docs/patterns", description: "Frequently used regex and code patterns" },
      { title: "Troubleshooting Guide", path: "/docs/troubleshooting", description: "Solve common issues" },
    ]
  }
];

const featuredGuides = [
  {
    title: "Debugging AI-Generated JWT Tokens",
    description: "Learn how to validate and debug JWT tokens created by AI assistants",
    path: "/docs/ai-jwt-debugging",
    icon: KeyRound,
    tags: ["AI", "JWT", "Debugging"]
  },
  {
    title: "SQL Query Optimization with EXPLAIN",
    description: "Use our SQL formatter's EXPLAIN visualization to optimize database queries",
    path: "/docs/sql-explain-guide",
    icon: Database,
    tags: ["SQL", "Performance", "Database"]
  },
  {
    title: "Advanced Regex Patterns for Data Validation",
    description: "Master complex regular expressions for form validation and data processing",
    path: "/docs/regex-validation",
    icon: Regex,
    tags: ["Regex", "Validation", "Patterns"]
  },
  {
    title: "Converting cURL to Modern JavaScript",
    description: "Transform legacy cURL commands into modern fetch/ axios code",
    path: "/docs/curl-modernization",
    icon: Terminal,
    tags: ["API", "JavaScript", "Modernization"]
  }
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = docSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

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
              Documentation & Guides
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              Comprehensive guides, tutorials, and examples to help you master our developer tools.
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
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
          </div>

          {/* Featured Guides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Featured Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredGuides.map((guide, index) => (
                <motion.div
                  key={guide.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link href={guide.path}>
                    <div className="p-6 rounded-xl border border-border bg-surface hover:bg-surface2 transition-colors group">
                      <div className="flex items-start gap-4">
                        <guide.icon className="w-8 h-8 text-primary shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                            {guide.title}
                          </h3>
                          <p className="text-muted-foreground mb-3">{guide.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {guide.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Documentation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + sectionIndex * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <Link key={item.path} href={item.path}>
                      <div className="p-4 rounded-lg border border-border bg-surface hover:bg-surface2 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-surface rounded-xl p-8 border border-border"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Quick Start Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">1. Choose a Tool</h3>
                <p className="text-muted-foreground">Browse our directory of developer tools and pick what you need.</p>
              </div>
              <div className="text-center">
                <Code className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">2. Input Your Data</h3>
                <p className="text-muted-foreground">Paste your code, tokens, or queries directly into the tool.</p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">3. Get Results</h3>
                <p className="text-muted-foreground">Instant processing with copy-friendly outputs and detailed explanations.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}