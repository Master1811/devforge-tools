"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Play, ExternalLink, Copy, Check, KeyRound, Regex, Database, Terminal, FileJson, Clock } from "lucide-react";

const exampleCategories = [
  {
    id: "jwt",
    title: "JWT Token Examples",
    icon: KeyRound,
    description: "Real JWT tokens from popular services and use cases",
    examples: [
      {
        title: "GitHub App Token",
        description: "JWT token from GitHub App authentication",
        tool: "/jwt-decoder",
        params: "token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODQ4NjQwMDAsImV4cCI6MTY4NDg2NzYwMCwiaXNzIjoiMTIzNDU2Nzg5MCJ9.example",
        tags: ["GitHub", "OAuth", "Apps"]
      },
      {
        title: "Auth0 Access Token",
        description: "Access token from Auth0 authentication service",
        tool: "/jwt-decoder",
        params: "token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.example",
        tags: ["Auth0", "Authentication", "Access Token"]
      },
      {
        title: "Firebase Custom Token",
        description: "Custom authentication token for Firebase",
        tool: "/jwt-decoder",
        params: "token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1c2VyMTIzIiwiaWF0IjoxNjg0ODY0MDAwfQ.example",
        tags: ["Firebase", "Custom Auth", "Mobile"]
      }
    ]
  },
  {
    id: "regex",
    title: "Regular Expression Patterns",
    icon: Regex,
    description: "Common regex patterns for validation and data extraction",
    examples: [
      {
        title: "Email Validation",
        description: "RFC-compliant email address validation pattern",
        tool: "/regex-tester",
        params: "pattern=%5B%5Ea-zA-Z0-9._%25%2B-%5D%2B%40%5Ba-zA-Z0-9.-%5D%2B%5C.%5Ba-zA-Z%5D%7B2%2C%7D&test=user%40example.com%0Ainvalid-email%0Atest.email%2Btag%40domain.co.uk",
        tags: ["Email", "Validation", "Forms"]
      },
      {
        title: "URL Extraction",
        description: "Extract URLs from text with various protocols",
        tool: "/regex-tester",
        params: "pattern=https%3F%3A%5C%2F%5C%2F%5B%5Cw%5C-._~%3A%2F%3F%23%5B%5C%5D%40!$%26'()*%2B%2C%3B%3D%5D%2B&test=Check%20out%20https%3A%2F%2Fgithub.com%2Fuser%2Frepo%20and%20http%3A%2F%2Fexample.com%2Fpage%3Fparam%3Dvalue",
        tags: ["URLs", "Extraction", "Web Scraping"]
      },
      {
        title: "Credit Card Numbers",
        description: "Detect and validate credit card number formats",
        tool: "/regex-tester",
        params: "pattern=%5C%2Fb%3F%3A%284%5C%2Fd%7B12%7D%28%3F%3A%5C%2Fd%7B3%7D%29%3F%7C5%5B1-5%5D%5C%2Fd%7B14%7D%7C3%5B47%5D%5C%2Fd%7B13%7D%29%5C%2Fb&test=4111111111111111%0A5500000000000004%0A340000000000009",
        tags: ["Credit Cards", "Validation", "Payment"]
      }
    ]
  },
  {
    id: "sql",
    title: "SQL Query Examples",
    icon: Database,
    description: "Complex SQL queries from real applications",
    examples: [
      {
        title: "User Analytics Query",
        description: "Complex analytics query with CTEs and window functions",
        tool: "/sql-formatter",
        params: "sql=WITH%20user_stats%20AS%20(%0A%20%20SELECT%20user_id%2C%20COUNT(*)%20as%20total_orders%2C%20SUM(amount)%20as%20total_spent%0A%20%20FROM%20orders%0A%20%20WHERE%20created_at%20%3E%3D%20'2024-01-01'%0A%20%20GROUP%20BY%20user_id%0A)%0ASELECT%20u.name%2C%20us.total_orders%2C%20us.total_spent%2C%0A%20%20%20%20%20%20%20RANK()%20OVER%20(ORDER%20BY%20us.total_spent%20DESC)%20as%20spending_rank%0AFROM%20users%20u%0AJOIN%20user_stats%20us%20ON%20u.id%20%3D%20us.user_id%0AORDER%20BY%20us.total_spent%20DESC%0ALIMIT%2010&dialect=postgresql",
        tags: ["Analytics", "CTEs", "Window Functions"]
      },
      {
        title: "E-commerce Product Search",
        description: "Full-text search with ranking and filtering",
        tool: "/sql-formatter",
        params: "sql=SELECT%20p.id%2C%20p.name%2C%20p.price%2C%20p.category%2C%0A%20%20%20%20%20%20%20ts_rank_cd(p.search_vector%2C%20plainto_tsquery('english'%2C%20%24search_term%24))%20as%20rank%0AFROM%20products%20p%0AWHERE%20p.search_vector%20%40%40%20plainto_tsquery('english'%2C%20%24search_term%24)%0A%20%20AND%20p.price%20BETWEEN%20%24min_price%24%20AND%20%24max_price%24%0A%20%20AND%20p.category%20%3D%20ANY(%24categories%24)%0AORDER%20BY%20rank%20DESC%2C%20p.price%20ASC%0ALIMIT%2050&dialect=postgresql",
        tags: ["Full-text Search", "E-commerce", "Ranking"]
      },
      {
        title: "Data Warehouse ETL",
        description: "ETL pipeline with incremental loading",
        tool: "/sql-formatter",
        params: "sql=MERGE%20fact_sales%20target%0AUSING%20(%0A%20%20SELECT%20order_id%2C%20customer_id%2C%20product_id%2C%20quantity%2C%20unit_price%2C%20order_date%0A%20%20FROM%20staging_orders%0A%20%20WHERE%20processed_flag%20%3D%200%0A)%20source%0AON%20target.order_id%20%3D%20source.order_id%0AWHEN%20MATCHED%20THEN%0A%20%20UPDATE%20SET%20quantity%20%3D%20source.quantity%2C%20updated_at%20%3D%20GETDATE()%0AWHEN%20NOT%20MATCHED%20THEN%0A%20%20INSERT%20(order_id%2C%20customer_id%2C%20product_id%2C%20quantity%2C%20unit_price%2C%20order_date)%0A%20%20VALUES%20(source.order_id%2C%20source.customer_id%2C%20source.product_id%2C%20source.quantity%2C%20source.unit_price%2C%20source.order_date)&dialect=mssql",
        tags: ["ETL", "Data Warehouse", "MERGE"]
      }
    ]
  },
  {
    id: "api",
    title: "API Request Examples",
    icon: Terminal,
    description: "Real API calls converted to different languages",
    examples: [
      {
        title: "REST API Authentication",
        description: "API call with Bearer token authentication",
        tool: "/curl-converter",
        params: "curl=curl%20-X%20GET%20%22https%3A%2F%2Fapi.example.com%2Fusers%2F123%22%20%5C%0A%20%20-H%20%22Authorization%3A%20Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...%22%20%5C%0A%20%20-H%20%22Content-Type%3A%20application%2Fjson%22&lang=fetch",
        tags: ["REST", "Authentication", "Bearer Token"]
      },
      {
        title: "GraphQL Query",
        description: "GraphQL API request with complex query",
        tool: "/curl-converter",
        params: "curl=curl%20-X%20POST%20%22https%3A%2F%2Fapi.github.com%2Fgraphql%22%20%5C%0A%20%20-H%20%22Authorization%3A%20Bearer%20ghp_1234567890%22%20%5C%0A%20%20-H%20%22Content-Type%3A%20application%2Fjson%22%20%5C%0A%20%20-d%20'%7B%22query%22%3A%22query%20GetUser%20%7B%20user(login%3A%20%5C%22octocat%5C%22)%20%7B%20name%20login%20bio%20%7D%20%7D%22%7D'&lang=axios",
        tags: ["GraphQL", "GitHub API", "Complex Queries"]
      },
      {
        title: "File Upload",
        description: "Multipart form data upload with progress",
        tool: "/curl-converter",
        params: "curl=curl%20-X%20POST%20%22https%3A%2F%2Fapi.cloudinary.com%2Fv1_1%2Fdemo%2Fimage%2Fupload%22%20%5C%0A%20%20-F%20%22file%3D%40image.jpg%22%20%5C%0A%20%20-F%20%22upload_preset%3Dml_default%22&lang=python",
        tags: ["File Upload", "Multipart", "Cloudinary"]
      }
    ]
  }
];

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState("jwt");
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const copyExampleUrl = (tool: string, params: string) => {
    const url = `https://devforge.tools${tool}?${params}`;
    navigator.clipboard.writeText(url);
    setCopiedExample(`${tool}-${params}`);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const currentCategory = exampleCategories.find(cat => cat.id === selectedCategory);

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
              Tool Examples & Use Cases
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              Real-world examples showing how our tools work with actual data from popular services and applications.
            </motion.p>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {exampleCategories.map(category => (
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

          {/* Examples Grid */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCategory.examples.map((example, index) => (
                  <motion.div
                    key={example.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg">{example.title}</h3>
                      <button
                        onClick={() => copyExampleUrl(example.tool, example.params)}
                        className={`p-2 rounded-lg transition-colors ${
                          copiedExample === `${example.tool}-${example.params}`
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface2"
                        }`}
                        title="Copy example URL"
                      >
                        {copiedExample === `${example.tool}-${example.params}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <p className="text-muted-foreground mb-4">{example.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {example.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`${example.tool}?${example.params}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      <Play className="w-4 h-4" />
                      Try Example
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center bg-surface rounded-xl p-8 border border-border"
          >
            <h2 className="text-2xl font-bold mb-4">Have a Great Example?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Share your real-world use cases and help other developers discover new ways to use our tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Browse All Tools
              </Link>
              <Link
                href="/docs"
                className="px-6 py-3 bg-surface2 text-foreground rounded-lg hover:bg-surface border border-border transition-colors font-medium"
              >
                Read Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}