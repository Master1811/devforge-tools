// Web Worker for heavy transformation tasks
// This runs in a separate thread to keep UI at 60fps

type WorkerTask =
  | { type: "formatSQL"; payload: { sql: string; options: { indent: number; uppercase: boolean } } }
  | { type: "jsonToTs"; payload: { json: string; options: Record<string, unknown> } }
  | { type: "parseCron"; payload: { expression: string } }
  | { type: "convertCurl"; payload: { cmd: string; language: string } };

self.onmessage = async (e: MessageEvent<{ id: string; task: WorkerTask }>) => {
  const { id, task } = e.data;
  try {
    let result: unknown;
    switch (task.type) {
      case "formatSQL": {
        // Inline SQL formatting for worker context
        result = workerFormatSQL(task.payload.sql, task.payload.options);
        break;
      }
      case "jsonToTs": {
        result = workerJsonToTs(task.payload.json, task.payload.options);
        break;
      }
      default:
        result = null;
    }
    self.postMessage({ id, result, error: null });
  } catch (err) {
    self.postMessage({ id, result: null, error: (err as Error).message });
  }
};

// ---- Inlined heavy functions for worker context ----

function workerFormatSQL(sql: string, options: { indent: number; uppercase: boolean }): string {
  const KEYWORDS = [
    "SELECT","FROM","WHERE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN",
    "CROSS JOIN","ON","AND","OR","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES",
    "UPDATE","SET","DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","INDEX","UNION","UNION ALL",
    "CASE","WHEN","THEN","ELSE","END","AS","IN","NOT","NULL","IS","BETWEEN","LIKE","EXISTS","DISTINCT",
  ];
  const { indent = 2, uppercase = true } = options;
  const pad = " ".repeat(indent);
  let result = sql.replace(/\s+/g, " ").trim();
  if (uppercase) {
    for (const kw of KEYWORDS) {
      result = result.replace(new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi"), kw);
    }
  }
  const breakBefore = ["SELECT","FROM","WHERE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN",
    "CROSS JOIN","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","UPDATE","SET",
    "DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","UNION","UNION ALL","VALUES"];
  for (const kw of breakBefore) {
    result = result.replace(new RegExp(`\\s+${kw}\\b`, "gi"), `\n${kw}`);
  }
  result = result.replace(/\b(AND|OR)\b/gi, `\n${pad}$1`);
  result = result.replace(/\bON\b/gi, `\n${pad}ON`);
  const selectMatch = result.match(/^SELECT\s+(.+?)(?=\nFROM)/is);
  if (selectMatch) {
    const cols = selectMatch[1].split(",").map((c: string, i: number) => i === 0 ? c.trim() : `${pad}${c.trim()}`);
    result = result.replace(selectMatch[1], "\n" + pad + cols.join(",\n" + pad));
  }
  return result.trim();
}

function workerJsonToTs(json: string, _options: Record<string, unknown>): string {
  // Validation step — just parse to verify
  JSON.parse(json);
  return ""; // Actual generation delegated to main thread for now
}
