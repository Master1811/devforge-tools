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
  summary: {
    errors: number;
    warnings: number;
    infos: number;
  };
}

export type WarehouseType = 'snowflake' | 'databricks';

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

function analyzeSQL(sql: string, warehouse: WarehouseType): SQLOptimizationIssue[] {
  const issues: SQLOptimizationIssue[] = [];
  const lines = sql.split('\n');

  // Apply general rules
  for (const [ruleName, rule] of Object.entries(OPTIMIZATION_RULES)) {
    const matches = sql.matchAll(rule.pattern);
    for (const match of matches) {
      const lineNumber = getLineNumber(sql, match.index!);
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
      const lineNumber = getLineNumber(sql, match.index!);
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

function getLineNumber(sql: string, index: number): number {
  return sql.substring(0, index).split('\n').length;
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

export function optimizeSnowflakeDatabricksSQL(sql: string, warehouse: WarehouseType): SQLOptimizationResult {
  try {
    const issues = analyzeSQL(sql, warehouse);

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

    return {
      issues,
      score,
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
      summary: { errors: 1, warnings: 0, infos: 0 }
    };
  }
}