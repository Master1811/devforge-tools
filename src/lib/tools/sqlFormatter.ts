const KEYWORDS = [
  "SELECT","FROM","WHERE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN","CROSS JOIN",
  "ON","AND","OR","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES",
  "UPDATE","SET","DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","INDEX","UNION","UNION ALL",
  "CASE","WHEN","THEN","ELSE","END","AS","IN","NOT","NULL","IS","BETWEEN","LIKE","EXISTS","DISTINCT",
];

export function formatSQL(sql: string, options: { indent?: number; uppercase?: boolean } = {}): string {
  const { indent = 2, uppercase = true } = options;
  const pad = " ".repeat(indent);
  let result = sql.replace(/\s+/g, " ").trim();

  // uppercase keywords
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

  // indent AND/OR/ON
  result = result.replace(/\b(AND|OR)\b/gi, `\n${pad}$1`);
  result = result.replace(/\bON\b/gi, `\n${pad}ON`);

  // SELECT columns one per line
  const selectMatch = result.match(/^SELECT\s+(.+?)(?=\nFROM)/is);
  if (selectMatch) {
    const cols = selectMatch[1].split(",").map((c, i) => i === 0 ? c.trim() : `${pad}${c.trim()}`);
    result = result.replace(selectMatch[1], "\n" + pad + cols.join(",\n" + pad));
  }

  return result.trim();
}
