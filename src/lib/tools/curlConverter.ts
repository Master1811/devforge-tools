interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
  auth?: { user: string; pass: string };
}

function parseCurl(cmd: string): ParsedCurl {
  const cleaned = cmd.replace(/\\\n/g, " ").replace(/\s+/g, " ").trim();
  const result: ParsedCurl = { url: "", method: "GET", headers: {} };

  // URL
  const urlMatch = cleaned.match(/curl\s+(?:'([^']+)'|"([^"]+)"|(\S+))/);
  if (!urlMatch) {
    const altUrl = cleaned.match(/(?:^|\s)(?:'(https?[^']+)'|"(https?[^"]+)"|(https?\S+))/);
    if (altUrl) result.url = altUrl[1] || altUrl[2] || altUrl[3];
  } else {
    result.url = urlMatch[1] || urlMatch[2] || urlMatch[3];
  }

  // Method
  const methodMatch = cleaned.match(/-X\s+(\w+)/);
  if (methodMatch) result.method = methodMatch[1].toUpperCase();

  // Headers
  const headerRegex = /-H\s+(?:'([^']+)'|"([^"]+)")/g;
  let hm;
  while ((hm = headerRegex.exec(cleaned)) !== null) {
    const h = hm[1] || hm[2];
    const idx = h.indexOf(":");
    if (idx > 0) result.headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
  }

  // Data
  const dataMatch = cleaned.match(/(?:-d|--data|--data-raw)\s+(?:'([^']*)'|"([^"]*)")/);
  if (dataMatch) {
    result.data = dataMatch[1] || dataMatch[2];
    if (!methodMatch) result.method = "POST";
  }

  // Auth
  const authMatch = cleaned.match(/-u\s+(?:'([^']+)'|"([^"]+)"|(\S+))/);
  if (authMatch) {
    const auth = (authMatch[1] || authMatch[2] || authMatch[3]).split(":");
    result.auth = { user: auth[0], pass: auth.slice(1).join(":") };
  }

  return result;
}

function toFetch(p: ParsedCurl): string {
  const opts: string[] = [`  method: '${p.method}'`];
  if (Object.keys(p.headers).length) opts.push(`  headers: ${JSON.stringify(p.headers, null, 4).replace(/\n/g, "\n  ")}`);
  if (p.data) opts.push(`  body: ${JSON.stringify(p.data)}`);
  return `const response = await fetch('${p.url}', {\n${opts.join(",\n")}\n});\nconst data = await response.json();`;
}

function toPython(p: ParsedCurl): string {
  const lines = ["import requests", ""];
  if (Object.keys(p.headers).length) lines.push(`headers = ${JSON.stringify(p.headers, null, 4)}\n`);
  const args = [`'${p.url}'`];
  if (Object.keys(p.headers).length) args.push("headers=headers");
  if (p.data) args.push(`json=${p.data}`);
  lines.push(`response = requests.${p.method.toLowerCase()}(${args.join(", ")})`);
  lines.push("print(response.json())");
  return lines.join("\n");
}

function toAxios(p: ParsedCurl): string {
  return `const axios = require('axios');\n\nconst { data } = await axios({\n  method: '${p.method}',\n  url: '${p.url}',${Object.keys(p.headers).length ? `\n  headers: ${JSON.stringify(p.headers, null, 4).replace(/\n/g, "\n  ")},` : ""}${p.data ? `\n  data: ${p.data},` : ""}\n});\n\nconsole.log(data);`;
}

function toGo(p: ParsedCurl): string {
  const lines = [
    'package main\n',
    'import (\n  "fmt"\n  "net/http"\n  "io/ioutil"',
    p.data ? '  "strings"' : '',
    ')\n',
    'func main() {',
    p.data ? `  body := strings.NewReader(${JSON.stringify(p.data)})` : '',
    `  req, _ := http.NewRequest("${p.method}", "${p.url}", ${p.data ? 'body' : 'nil'})`,
  ];
  for (const [k, v] of Object.entries(p.headers)) lines.push(`  req.Header.Set("${k}", "${v}")`);
  lines.push('  client := &http.Client{}', '  resp, _ := client.Do(req)', '  defer resp.Body.Close()', '  bytes, _ := ioutil.ReadAll(resp.Body)', '  fmt.Println(string(bytes))', '}');
  return lines.filter(Boolean).join("\n");
}

function toPhp(p: ParsedCurl): string {
  const lines = ['<?php', '$ch = curl_init();', `curl_setopt($ch, CURLOPT_URL, '${p.url}');`, 'curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);'];
  if (p.method !== "GET") lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${p.method}');`);
  if (p.data) lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, '${p.data}');`);
  if (Object.keys(p.headers).length) {
    const hs = Object.entries(p.headers).map(([k, v]) => `  '${k}: ${v}'`).join(",\n");
    lines.push(`curl_setopt($ch, CURLOPT_HTTPHEADER, [\n${hs}\n]);`);
  }
  lines.push('$response = curl_exec($ch);', 'curl_close($ch);', 'echo $response;');
  return lines.join("\n");
}

export type Language = "fetch" | "python" | "axios" | "go" | "php";

export function convertCurl(cmd: string, language: Language): string {
  const parsed = parseCurl(cmd);
  switch (language) {
    case "fetch": return toFetch(parsed);
    case "python": return toPython(parsed);
    case "axios": return toAxios(parsed);
    case "go": return toGo(parsed);
    case "php": return toPhp(parsed);
  }
}
