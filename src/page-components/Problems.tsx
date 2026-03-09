"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { AlertTriangle, CheckCircle, ArrowRight, ExternalLink, Lightbulb, Zap } from "lucide-react";

const problemCategories = [
  {
    id: "jwt",
    title: "JWT Token Issues",
    icon: AlertTriangle,
    description: "Common problems with JWT tokens and authentication",
    problems: [
      {
        title: "Token Expired Error",
        description: "Getting 'Token has expired' when using JWT tokens",
        solution: "Check the 'exp' claim in your JWT payload. Use our JWT Decoder to inspect token expiration times and ensure your tokens are valid.",
        tool: "/jwt-decoder",
        params: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        tags: ["Expiration", "Authentication", "Token Validation"]
      },
      {
        title: "Invalid Signature",
        description: "JWT signature verification failing",
        solution: "Verify your signing algorithm and secret key. Use JWT Decoder with signature verification to debug signature issues.",
        tool: "/jwt-decoder",
        params: "mode=verify&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ&secret=your-256-bit-secret",
        tags: ["Signature", "Verification", "Security"]
      },
      {
        title: "Malformed Token",
        description: "JWT token format is invalid or corrupted",
        solution: "Check token structure (header.payload.signature). Our JWT Decoder will highlight format issues and help you identify problems.",
        tool: "/jwt-decoder",
        params: "token=invalid.jwt.token",
        tags: ["Format", "Structure", "Parsing"]
      }
    ]
  },
  {
    id: "regex",
    title: "Regular Expression Problems",
    icon: AlertTriangle,
    description: "Common regex pattern matching and validation issues",
    problems: [
      {
        title: "Pattern Not Matching",
        description: "Regex pattern doesn't match expected text",
        solution: "Test your pattern with our Regex Tester. Check for escaped characters, anchors (^$), and quantifiers (*, +, ?).",
        tool: "/regex-tester",
        params: "pattern=%5E%5Ba-zA-Z0-9._%25%2B-%5D%2B%40%5Ba-zA-Z0-9.-%5D%2B%5C.%5Ba-zA-Z%5D%7B2%2C%7D%24&flags=g&test=test%40example.com",
        tags: ["Pattern Matching", "Anchors", "Quantifiers"]
      },
      {
        title: "Greedy vs Lazy Matching",
        description: "Regex capturing too much or too little text",
        solution: "Use lazy quantifiers (*?, +?, ??) for minimal matching. Test with our Regex Tester to see capture groups.",
        tool: "/regex-tester",
        params: "pattern=%3Cdiv%3E(.*%3F)%3C%2Fdiv%3E&test=%3Cdiv%3EFirst%3C%2Fdiv%3E%3Cdiv%3ESecond%3C%2Fdiv%3E",
        tags: ["Greedy", "Lazy", "Capture Groups"]
      },
      {
        title: "Special Characters Not Working",
        description: "Regex special characters like \\d, \\w, \\s not matching",
        solution: "Ensure you're using the correct regex flavor. Test patterns with our Regex Tester to verify character class behavior.",
        tool: "/regex-tester",
        params: "pattern=%5C%2Fd%2B&test=123%20abc%20456",
        tags: ["Character Classes", "Special Characters", "Regex Flavor"]
      }
    ]
  },
  {
    id: "sql",
    title: "SQL Query Issues",
    icon: AlertTriangle,
    description: "Common SQL syntax and formatting problems",
    problems: [
      {
        title: "Syntax Error",
        description: "SQL query has syntax errors preventing execution",
        solution: "Use our SQL Formatter to identify and fix syntax issues. Check for missing commas, incorrect JOIN syntax, and proper quoting.",
        tool: "/sql-formatter",
        params: "sql=SELECT%20name%2C%20email%20FROM%20users%20WHERE%20id%20%3D%201%20ORDER%20BY%20name&uppercase=true",
        tags: ["Syntax", "Formatting", "Query Structure"]
      },
      {
        title: "Slow Query Performance",
        description: "SQL queries running too slowly",
        solution: "Format and analyze your query structure. Check for missing indexes, inefficient JOINs, and WHERE clause optimization.",
        tool: "/sql-formatter",
        params: "sql=SELECT%20u.name%2C%20COUNT(o.id)%20as%20order_count%20FROM%20users%20u%20LEFT%20JOIN%20orders%20o%20ON%20u.id%20%3D%20o.user_id%20WHERE%20u.created_at%20%3E%20'2024-01-01'%20GROUP%20BY%20u.id%2C%20u.name%20HAVING%20COUNT(o.id)%20%3E%205&dialect=postgresql",
        tags: ["Performance", "Optimization", "Indexes"]
      },
      {
        title: "Incorrect Results",
        description: "SQL query returns wrong or unexpected data",
        solution: "Review JOIN conditions and WHERE clauses. Use our formatter to clarify complex query logic and identify logical errors.",
        tool: "/sql-formatter",
        params: "sql=SELECT%20p.name%2C%20c.name%20as%20category%20FROM%20products%20p%20INNER%20JOIN%20categories%20c%20ON%20p.category_id%20%3D%20c.id%20WHERE%20p.price%20%3E%20100",
        tags: ["Data Integrity", "JOIN Conditions", "WHERE Clauses"]
      }
    ]
  },
  {
    id: "api",
    title: "API Request Problems",
    icon: AlertTriangle,
    description: "Common issues with API calls and HTTP requests",
    problems: [
      {
        title: "401 Unauthorized",
        description: "API returning 401 authentication errors",
        solution: "Check your authentication headers. Convert curl commands with our Curl Converter to ensure proper header formatting.",
        tool: "/curl-converter",
        params: "curl=curl%20-X%20GET%20%22https%3A%2F%2Fapi.example.com%2Fdata%22%20-H%20%22Authorization%3A%20Bearer%20your_token_here%22&lang=fetch",
        tags: ["Authentication", "Headers", "401 Error"]
      },
      {
        title: "CORS Errors",
        description: "Cross-origin resource sharing blocking requests",
        solution: "Convert curl to fetch with proper headers. Check if API supports CORS or if you need to use a proxy.",
        tool: "/curl-converter",
        params: "curl=curl%20-X%20GET%20%22https%3A%2F%2Fapi.example.com%2Fdata%22%20-H%20%22Origin%3A%20http%3A%2F%2Flocalhost%3A3000%22&lang=fetch",
        tags: ["CORS", "Cross-origin", "Browser Security"]
      },
      {
        title: "Malformed Request",
        description: "API rejecting request due to format issues",
        solution: "Use our Curl Converter to ensure proper JSON formatting, headers, and request structure across different languages.",
        tool: "/curl-converter",
        params: "curl=curl%20-X%20POST%20%22https%3A%2F%2Fapi.example.com%2Fusers%22%20-H%20%22Content-Type%3A%20application%2Fjson%22%20-d%20'%7B%22name%22%3A%22John%22%2C%22email%22%3A%22john%40example.com%22%7D'&lang=python",
        tags: ["Request Format", "JSON", "Headers"]
      }
    ]
  },
  {
    id: "json",
    title: "JSON Processing Issues",
    icon: AlertTriangle,
    description: "Problems with JSON parsing, validation, and conversion",
    problems: [
      {
        title: "Invalid JSON Format",
        description: "JSON string is malformed or has syntax errors",
        solution: "Use our JSON to TypeScript converter to validate and format your JSON. Check for trailing commas and proper quoting.",
        tool: "/json-to-typescript",
        params: "json=%7B%22name%22%3A%22John%22%2C%22age%22%3A30%2C%22email%22%3A%22john%40example.com%22%7D",
        tags: ["JSON Syntax", "Validation", "Formatting"]
      },
      {
        title: "TypeScript Interface Mismatch",
        description: "Generated TypeScript interfaces don't match your data",
        solution: "Convert your JSON with our tool to generate accurate TypeScript interfaces. Adjust options for optional fields and unions.",
        tool: "/json-to-typescript",
        params: "json=%7B%22user%22%3A%7B%22id%22%3A123%2C%22name%22%3A%22John%22%2C%22email%22%3A%22john%40example.com%22%7D%2C%22posts%22%3A%5B%7B%22id%22%3A1%2C%22title%22%3A%22Hello%22%7D%5D%7D",
        tags: ["TypeScript", "Interfaces", "Type Safety"]
      },
      {
        title: "YAML Conversion Errors",
        description: "Issues converting between JSON and YAML formats",
        solution: "Use our YAML JSON Converter to handle format conversions. Check indentation and data type preservation.",
        tool: "/yaml-json-converter",
        params: "json=%7B%22app%22%3A%7B%22name%22%3A%22my-app%22%2C%22version%22%3A%221.0.0%22%2C%22database%22%3A%7B%22host%22%3A%22localhost%22%2C%22port%22%3A5432%7D%7D%7D",
        tags: ["YAML", "Conversion", "Configuration"]
      }
    ]
  }
];

export default function ProblemsPage() {
  const [selectedCategory, setSelectedCategory] = useState("jwt");

  const currentCategory = problemCategories.find(cat => cat.id === selectedCategory);

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
              Developer Problems & Solutions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              Common developer challenges and how our tools can help you solve them quickly.
            </motion.p>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {problemCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.title}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Problems Grid */}
          {currentCategory && (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">{currentCategory.title}</h2>
                <p className="text-muted-foreground">{currentCategory.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentCategory.problems.map((problem, index) => (
                  <motion.div
                    key={problem.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface rounded-xl border border-border p-6"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                        <p className="text-muted-foreground mb-4">{problem.description}</p>
                      </div>
                    </div>

                    <div className="bg-surface2 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="font-medium text-sm text-primary">Solution</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{problem.solution}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`${problem.tool}?${problem.params}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      <Zap className="w-4 h-4" />
                      Try Solution
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Solutions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 bg-surface rounded-xl p-8 border border-border"
          >
            <div className="text-center mb-8">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Quick Problem Solver</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Can't find your specific issue? Try these general debugging approaches with our tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/jwt-decoder"
                className="group bg-surface2 rounded-lg p-4 hover:bg-surface transition-colors border border-border"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">JWT Issues</h3>
                <p className="text-sm text-muted-foreground">Decode and verify JWT tokens</p>
                <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/regex-tester"
                className="group bg-surface2 rounded-lg p-4 hover:bg-surface transition-colors border border-border"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Regex Problems</h3>
                <p className="text-sm text-muted-foreground">Test and debug regex patterns</p>
                <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/sql-formatter"
                className="group bg-surface2 rounded-lg p-4 hover:bg-surface transition-colors border border-border"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">SQL Errors</h3>
                <p className="text-sm text-muted-foreground">Format and validate SQL queries</p>
                <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/curl-converter"
                className="group bg-surface2 rounded-lg p-4 hover:bg-surface transition-colors border border-border"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">API Issues</h3>
                <p className="text-sm text-muted-foreground">Convert and debug API requests</p>
                <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}