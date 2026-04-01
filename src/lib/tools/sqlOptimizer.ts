export interface SQLOptimizationIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  line?: number;
  suggestion: string;
  sqlSnippet?: string;
}

export interface SQLOptimizationResult {
  issues: SQLOptimizationIssue[];
  score: number; // 0-100, higher is better
  engine: 'wasm-ast' | 'regex-fallback';
  structuralSignals: {
    partitionAware: boolean;
    costOptimized: boolean;
    sargable: boolean;
  };
  summary: {
    errors: number;
    warnings: number;
    infos: number;
  };
}

export type WarehouseType = 'snowflake' | 'databricks';
type SQLDialect = 'snowflake' | 'databricks';

const OPTIMIZATION_RULES = {
  fullTableScan: {
    pattern: /\bSELECT\s+.*\bFROM\s+(\w+)\s+WHERE\s+[^)]*\bLIKE\s+['"]%[^%]*['"]/gi,
    message: 'Full table scan detected with leading wildcard in LIKE',
    suggestion: 'Consider using search optimization or restructuring the query to avoid leading wildcards',
    category: 'Performance',
    severity: 'warning' as const
  },
  inefficientJoin: {
    pattern: /\bJOIN\s+(\w+)\s+ON\s+[^=]*=\s*[^=]*(?:\s+AND\s+[^=]*=\s*[^=]*)+/gi,
    message: 'Multiple conditions in JOIN may cause inefficient execution',
    suggestion: 'Consider filtering in WHERE clause or using subqueries for complex joins',
    category: 'Performance',
    severity: 'info' as const
  },
  missingPartition: {
    pattern: /\bFROM\s+(\w+)\s+WHERE\s+(?!.*PARTITION\s*\()/gi,
    message: 'Query may benefit from partition pruning',
    suggestion: 'Consider adding PARTITION filters for large tables',
    category: 'Performance',
    severity: 'info' as const
  },
  selectStar: {
    pattern: /\bSELECT\s+\*\s+FROM/gi,
    message: 'SELECT * can be inefficient for wide tables',
    suggestion: 'Specify only required columns to reduce data transfer',
    category: 'Performance',
    severity: 'warning' as const
  },
  noLimit: {
    pattern: /\bSELECT\s+.*\bFROM\s+\w+\s+WHERE\s+[^)]*(?!.*\bLIMIT\s+\d)/gi,
    message: 'Query without LIMIT may return excessive data',
    suggestion: 'Add LIMIT clause for testing or when expecting small result sets',
    category: 'Performance',
    severity: 'info' as const
  },
  nestedSubquery: {
    pattern: /\(\s*SELECT\s+.*\bFROM\s+.*\)/gi,
    message: 'Nested subquery detected',
    suggestion: 'Consider using JOINs or CTEs for better performance',
    category: 'Performance',
    severity: 'warning' as const
  },
  unionWithoutAll: {
    pattern: /\bUNION\s+(?!ALL)/gi,
    message: 'UNION without ALL may cause unnecessary DISTINCT operation',
    suggestion: 'Use UNION ALL if duplicates are acceptable',
    category: 'Performance',
    severity: 'info' as const
  }
};

const WAREHOUSE_SPECIFIC_RULES = {
  snowflake: [
    {
      pattern: /\bCOUNT\(\*\)\s+OVER\s*\(\s*\)/gi,
      message: 'COUNT(*) OVER() can be expensive in Snowflake',
      suggestion: 'Consider using APPROX_COUNT_DISTINCT for approximate counts',
      category: 'Snowflake Optimization',
      severity: 'warning' as const
    },
    {
      pattern: /\bFLATTEN\s*\(/gi,
      message: 'FLATTEN operations can be expensive',
      suggestion: 'Consider using LATERAL FLATTEN or restructuring data',
      category: 'Snowflake Optimization',
      severity: 'info' as const
    }
  ],
  databricks: [
    {
      pattern: /\bMERGE\s+INTO/gi,
      message: 'MERGE operations can be slow on large Delta tables',
      suggestion: 'Consider batching operations or using OPTIMIZE after merge',
      category: 'Databricks Optimization',
      severity: 'warning' as const
    },
    {
      pattern: /\bVACUUM\s+/gi,
      message: 'VACUUM operations can impact performance',
      suggestion: 'Run VACUUM during maintenance windows',
      category: 'Databricks Optimization',
      severity: 'info' as const
    }
  ]
};

let sqlParserReady = false;
let sqlParserLoadAttempted = false;
let sqlParser: null | {
  init: () => Promise<void>;
  parse: (sql: string, dialect: SQLDialect) => unknown[];
} = null;

async function ensureParserLoaded(): Promise<boolean> {
  if (sqlParserReady) return true;
  if (sqlParserLoadAttempted) return false;
  sqlParserLoadAttempted = true;
  try {
    const mod = await import('@guanmingchiu/sqlparser-ts');
    sqlParser = mod as unknown as { init: () => Promise<void>; parse: (sql: string, dialect: SQLDialect) => unknown[] };
    await sqlParser.init();
    sqlParserReady = true;
    return true;
  } catch {
    return false;
  }
}

function analyzeSQLRegex(sql: string, warehouse: WarehouseType): SQLOptimizationIssue[] {
  const issues: SQLOptimizationIssue[] = [];
  const lines = sql.split('\n');
  const offsets = buildLineOffsets(sql);

  // Apply general rules
  for (const [, rule] of Object.entries(OPTIMIZATION_RULES)) {
    const matches = sql.matchAll(rule.pattern);
    for (const match of matches) {
      const lineNumber = getLineNumber(offsets, match.index!);
      issues.push({
        type: rule.severity,
        category: rule.category,
        message: rule.message,
        line: lineNumber,
        suggestion: rule.suggestion,
        sqlSnippet: lines[lineNumber - 1]?.trim()
      });
    }
  }

  // Apply warehouse-specific rules
  for (const rule of WAREHOUSE_SPECIFIC_RULES[warehouse]) {
    const matches = sql.matchAll(rule.pattern);
    for (const match of matches) {
      const lineNumber = getLineNumber(offsets, match.index!);
      issues.push({
        type: rule.severity,
        category: rule.category,
        message: rule.message,
        line: lineNumber,
        suggestion: rule.suggestion,
        sqlSnippet: lines[lineNumber - 1]?.trim()
      });
    }
  }

  // Additional analysis
  const complexityScore = calculateComplexityScore(sql);
  if (complexityScore > 50) {
    issues.push({
      type: 'info',
      category: 'Complexity',
      message: `Query has high complexity score (${complexityScore})`,
      suggestion: 'Consider breaking down into smaller queries or using CTEs',
    });
  }

  return issues;
}

function buildLineOffsets(sql: string): number[] {
  const offsets = [0];
  for (let i = 0; i < sql.length; i++) {
    if (sql[i] === '\n') offsets.push(i + 1);
  }
  return offsets;
}

function getLineNumber(offsets: number[], index: number): number {
  let lo = 0, hi = offsets.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (offsets[mid] <= index) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
}

function calculateComplexityScore(sql: string): number {
  let score = 0;
  const upperSQL = sql.toUpperCase();

  // Count various SQL elements
  score += (upperSQL.match(/\bJOIN\b/g) || []).length * 5;
  score += (upperSQL.match(/\bUNION\b/g) || []).length * 3;
  score += (upperSQL.match(/\(\s*SELECT/g) || []).length * 4;
  score += (upperSQL.match(/\bCASE\b/g) || []).length * 2;
  score += (upperSQL.match(/\bWINDOW\b|\bOVER\b/g) || []).length * 3;
  score += (upperSQL.match(/\bGROUP\s+BY\b/g) || []).length * 2;
  score += (upperSQL.match(/\bORDER\s+BY\b/g) || []).length * 1;

  // Length factor
  score += Math.floor(sql.length / 500);

  return Math.min(score, 100);
}

function collectCompoundIdentifiers(node: unknown, out: string[] = []): string[] {
  if (!node || typeof node !== 'object') return out;
  const obj = node as Record<string, unknown>;

  const compound = obj.CompoundIdentifier;
  if (Array.isArray(compound)) {
    const pieces = compound
      .map((p) => (p && typeof p === 'object' ? (p as Record<string, unknown>).value : undefined))
      .filter((x): x is string => typeof x === 'string');
    if (pieces.length >= 2) out.push(`${pieces[0]}.${pieces[pieces.length - 1]}`);
  }

  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) v.forEach((child) => collectCompoundIdentifiers(child, out));
    else if (v && typeof v === 'object') collectCompoundIdentifiers(v, out);
  }
  return out;
}

function analyzeStructuralWithAst(ast: unknown[], sql: string): SQLOptimizationIssue[] {
  const issues: SQLOptimizationIssue[] = [];
  const text = sql.toUpperCase();

  // 1) Unused columns in derived subquery.
  if (text.includes('FROM (SELECT')) {
    const refs = collectCompoundIdentifiers(ast);
    const aliasUsage = new Map<string, Set<string>>();
    for (const ref of refs) {
      const [alias, col] = ref.split('.');
      if (!alias || !col) continue;
      const set = aliasUsage.get(alias) ?? new Set<string>();
      set.add(col);
      aliasUsage.set(alias, set);
    }

    const astString = JSON.stringify(ast);
    const derivedAliasMatch = astString.match(/"Derived".*?"alias".*?"value":"(\w+)"/);
    const derivedAlias = derivedAliasMatch?.[1];
    if (derivedAlias) {
      const innerProjectionMatches = [...astString.matchAll(/"Identifier":\{"value":"(\w+)"/g)].map((m: RegExpMatchArray) => m[1]);
      const used = aliasUsage.get(derivedAlias) ?? new Set<string>();
      const unused = innerProjectionMatches.filter((c) => !used.has(c)).slice(0, 4);
      if (unused.length > 0) {
        issues.push({
          type: 'info',
          category: 'Structural Analysis',
          message: `Derived subquery projects potentially unused columns: ${unused.join(', ')}`,
          suggestion: 'Remove unused projected columns from subqueries to reduce scan and shuffle cost.',
        });
      }
    }
  }

  // 2) Join logic mismatch heuristic by key naming semantics.
  const joinPairs = [...sql.matchAll(/\bON\s+([a-zA-Z_][\w.]*)\s*=\s*([a-zA-Z_][\w.]*)/gi)];
  for (const pair of joinPairs) {
    const left = pair[1].toLowerCase();
    const right = pair[2].toLowerCase();
    const numericHint = /(id|_id|count|num|qty|amount)$/;
    const temporalHint = /(date|time|timestamp|_at)$/;
    const leftNumeric = numericHint.test(left);
    const rightNumeric = numericHint.test(right);
    const leftTemporal = temporalHint.test(left);
    const rightTemporal = temporalHint.test(right);
    if (leftNumeric !== rightNumeric || leftTemporal !== rightTemporal) {
      issues.push({
        type: 'warning',
        category: 'Structural Analysis',
        message: `Join predicate may compare semantically mismatched keys: ${pair[1]} = ${pair[2]}`,
        suggestion: 'Validate key data types and semantics in warehouse catalog before executing large joins.',
      });
    }
  }

  // 3) Predicate pushdown check: derived table with outer WHERE.
  const hasDerived = /\bFROM\s*\(\s*SELECT\b/i.test(sql);
  const hasOuterWhere = /\)\s*\w+\s+WHERE\b/i.test(sql);
  const hasInnerWhere = /\bFROM\s*\(\s*SELECT[\s\S]*?\bWHERE\b[\s\S]*?\)\s*\w+/i.test(sql);
  if (hasDerived && hasOuterWhere && !hasInnerWhere) {
    issues.push({
      type: 'warning',
      category: 'Structural Analysis',
      message: 'Filter appears only on outer query; predicate pushdown opportunity detected.',
      suggestion: 'Move selective filters into subqueries/base-table scans to reduce intermediate data volume.',
    });
  }

  return issues;
}

function computeSignals(issues: SQLOptimizationIssue[], score: number) {
  return {
    partitionAware: !issues.some((i) => /partition pruning/i.test(i.message)),
    costOptimized: score >= 80 && !issues.some((i) => i.type === 'warning'),
    sargable: !issues.some((i) => /leading wildcard|pushdown/i.test(i.message)),
  };
}

export async function optimizeSnowflakeDatabricksSQL(sql: string, warehouse: WarehouseType): Promise<SQLOptimizationResult> {
  try {
    const baseIssues = analyzeSQLRegex(sql, warehouse);
    const wasmLoaded = await ensureParserLoaded();
    const structuralIssues: SQLOptimizationIssue[] = [];

    if (wasmLoaded && sqlParser) {
      try {
        const ast = sqlParser.parse(sql, warehouse);
        structuralIssues.push(...analyzeStructuralWithAst(ast, sql));
      } catch (e) {
        structuralIssues.push({
          type: 'info',
          category: 'Structural Analysis',
          message: 'WASM AST parser failed for this query shape; regex analysis used as fallback.',
          suggestion: 'Retry with valid SQL syntax or simpler statement boundaries.',
        });
      }
    } else {
      structuralIssues.push({
        type: 'info',
        category: 'Structural Analysis',
        message: 'WASM AST parser unavailable; regex analysis fallback active.',
        suggestion: 'Refresh and retry to reinitialize AST engine in-browser.',
      });
    }

    const issues = [...baseIssues, ...structuralIssues];

    const summary = {
      errors: issues.filter(i => i.type === 'error').length,
      warnings: issues.filter(i => i.type === 'warning').length,
      infos: issues.filter(i => i.type === 'info').length
    };

    // Calculate score: start with 100, deduct points for issues
    let score = 100;
    score -= summary.errors * 20;
    score -= summary.warnings * 5;
    score -= summary.infos * 1;
    score = Math.max(0, score);
    const structuralSignals = computeSignals(issues, score);

    return {
      issues,
      score,
      engine: wasmLoaded ? 'wasm-ast' : 'regex-fallback',
      structuralSignals,
      summary
    };
  } catch (e) {
    return {
      issues: [{
        type: 'error',
        category: 'Analysis Error',
        message: 'Failed to analyze SQL: ' + (e as Error).message,
        suggestion: 'Check SQL syntax and try again'
      }],
      score: 0,
      engine: 'regex-fallback',
      structuralSignals: {
        partitionAware: false,
        costOptimized: false,
        sargable: false,
      },
      summary: { errors: 1, warnings: 0, infos: 0 }
    };
  }
}