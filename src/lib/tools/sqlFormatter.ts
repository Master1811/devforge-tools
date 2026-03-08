const KEYWORDS = [
  "SELECT","FROM","WHERE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN","CROSS JOIN",
  "ON","AND","OR","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES",
  "UPDATE","SET","DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","INDEX","UNION","UNION ALL",
  "CASE","WHEN","THEN","ELSE","END","AS","IN","NOT","NULL","IS","BETWEEN","LIKE","EXISTS","DISTINCT",
];

export type SQLDialect = "standard" | "postgresql" | "mysql" | "oracle" | "mssql";

export interface SQLFormatOptions {
  indent?: number;
  uppercase?: boolean;
  dialect?: SQLDialect;
}

export function formatSQL(sql: string, options: SQLFormatOptions = {}): string {
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

export interface SQLComplexity {
  score: number;
  label: string;
  joinCount: number;
  subqueryCount: number;
  conditionCount: number;
  warnings: string[];
}

export function analyzeSQLComplexity(sql: string): SQLComplexity {
  const upper = sql.toUpperCase();
  const joinCount = (upper.match(/\b(INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\b/g) || []).length;
  const subqueryCount = (upper.match(/\(\s*SELECT\b/g) || []).length;
  const conditionCount = (upper.match(/\b(AND|OR)\b/g) || []).length;
  const hasWildcard = /SELECT\s+\*/i.test(sql);
  const hasNoLimit = !/\bLIMIT\b/i.test(sql) && /\bSELECT\b/i.test(sql);
  const hasDistinct = /\bDISTINCT\b/i.test(sql);

  const warnings: string[] = [];
  if (hasWildcard) warnings.push("SELECT * — consider specifying columns for performance");
  if (joinCount >= 4) warnings.push(`${joinCount} JOINs detected — may cause slow queries without proper indexing`);
  if (subqueryCount >= 2) warnings.push(`${subqueryCount} subqueries — consider using CTEs or JOINs instead`);
  if (hasNoLimit && !(/\bINSERT|UPDATE|DELETE|CREATE|ALTER|DROP\b/i.test(sql))) warnings.push("No LIMIT clause — may return excessive rows");
  if (hasDistinct && joinCount > 0) warnings.push("DISTINCT with JOINs — may indicate a join producing duplicates");

  const score = joinCount * 2 + subqueryCount * 3 + conditionCount + (hasWildcard ? 1 : 0);
  let label = "Simple";
  if (score >= 10) label = "Complex";
  else if (score >= 5) label = "Moderate";

  return { score, label, joinCount, subqueryCount, conditionCount, warnings };
}
