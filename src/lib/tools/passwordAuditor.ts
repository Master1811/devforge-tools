export interface PasswordPolicy {
  name: string;
  description: string;
  rules: PasswordRule[];
}

export interface PasswordRule {
  id: string;
  description: string;
  test: (password: string) => boolean;
  severity: 'error' | 'warning' | 'info';
}

export interface AuditResult {
  policy: string;
  passed: boolean;
  violations: {
    rule: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
  }[];
  score: number; // 0-100
}

const NIST_PASSWORD_POLICY: PasswordPolicy = {
  name: 'NIST 800-63B',
  description: 'NIST Digital Identity Guidelines for passwords',
  rules: [
    {
      id: 'min-length',
      description: 'Minimum 8 characters',
      test: (pw) => pw.length >= 8,
      severity: 'error'
    },
    {
      id: 'max-length',
      description: 'Maximum 128 characters',
      test: (pw) => pw.length <= 128,
      severity: 'warning'
    },
    {
      id: 'complexity',
      description: 'At least 3 of: uppercase, lowercase, numbers, symbols',
      test: (pw) => {
        const checks = [
          /[A-Z]/.test(pw),
          /[a-z]/.test(pw),
          /\d/.test(pw),
          /[^A-Za-z0-9]/.test(pw)
        ];
        return checks.filter(Boolean).length >= 3;
      },
      severity: 'warning'
    },
    {
      id: 'no-common-patterns',
      description: 'Avoid common patterns (123456, password, etc.)',
      test: (pw) => {
        const common = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];
        return !common.some(c => pw.toLowerCase().includes(c));
      },
      severity: 'warning'
    }
  ]
};

const OWASP_PASSWORD_POLICY: PasswordPolicy = {
  name: 'OWASP',
  description: 'OWASP password security guidelines',
  rules: [
    {
      id: 'min-length',
      description: 'Minimum 12 characters',
      test: (pw) => pw.length >= 12,
      severity: 'error'
    },
    {
      id: 'complexity-all',
      description: 'Must include uppercase, lowercase, numbers, and symbols',
      test: (pw) => /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw),
      severity: 'error'
    },
    {
      id: 'no-repeated-chars',
      description: 'No more than 2 consecutive identical characters',
      test: (pw) => !/(.)\1{2,}/.test(pw),
      severity: 'warning'
    },
    {
      id: 'no-sequential',
      description: 'Avoid sequential characters (abc, 123)',
      test: (pw) => {
        const sequential = ['abcdefghijklmnopqrstuvwxyz', '0123456789'];
        const lower = pw.toLowerCase();
        return !sequential.some(seq => {
          for (let i = 0; i < seq.length - 2; i++) {
            if (lower.includes(seq.slice(i, i + 3))) return true;
          }
          return false;
        });
      },
      severity: 'warning'
    }
  ]
};

const CORPORATE_POLICY: PasswordPolicy = {
  name: 'Corporate Standard',
  description: 'Common corporate password requirements',
  rules: [
    {
      id: 'min-length',
      description: 'Minimum 8 characters',
      test: (pw) => pw.length >= 8,
      severity: 'error'
    },
    {
      id: 'uppercase',
      description: 'At least one uppercase letter',
      test: (pw) => /[A-Z]/.test(pw),
      severity: 'error'
    },
    {
      id: 'lowercase',
      description: 'At least one lowercase letter',
      test: (pw) => /[a-z]/.test(pw),
      severity: 'error'
    },
    {
      id: 'number',
      description: 'At least one number',
      test: (pw) => /\d/.test(pw),
      severity: 'error'
    },
    {
      id: 'special-char',
      description: 'At least one special character',
      test: (pw) => /[^A-Za-z0-9]/.test(pw),
      severity: 'error'
    },
    {
      id: 'no-personal-info',
      description: 'Avoid common personal information patterns',
      test: (pw) => {
        // Simple check - in real implementation, this would check against user data
        const personal = ['name', 'birth', 'phone', 'address'];
        return !personal.some(p => pw.toLowerCase().includes(p));
      },
      severity: 'warning'
    }
  ]
};

export const PASSWORD_POLICIES = {
  nist: NIST_PASSWORD_POLICY,
  owasp: OWASP_PASSWORD_POLICY,
  corporate: CORPORATE_POLICY
};

export function auditPasswordPolicy(password: string, policyKey: keyof typeof PASSWORD_POLICIES): AuditResult {
  const policy = PASSWORD_POLICIES[policyKey];
  const violations: AuditResult['violations'] = [];
  let passedRules = 0;

  for (const rule of policy.rules) {
    const passed = rule.test(password);
    if (passed) {
      passedRules++;
    } else {
      violations.push({
        rule: rule.id,
        severity: rule.severity,
        message: rule.description
      });
    }
  }

  const totalRules = policy.rules.length;
  const score = Math.round((passedRules / totalRules) * 100);
  const passed = violations.filter(v => v.severity === 'error').length === 0;

  return {
    policy: policy.name,
    passed,
    violations,
    score
  };
}

export function auditPasswordAgainstAllPolicies(password: string): AuditResult[] {
  return Object.keys(PASSWORD_POLICIES).map(key =>
    auditPasswordPolicy(password, key as keyof typeof PASSWORD_POLICIES)
  );
}

export function calculatePasswordEntropy(password: string): number {
  // Simple entropy calculation
  const charset = new Set();
  if (/[a-z]/.test(password)) charset.add('lowercase');
  if (/[A-Z]/.test(password)) charset.add('uppercase');
  if (/\d/.test(password)) charset.add('digits');
  if (/[^A-Za-z0-9]/.test(password)) charset.add('symbols');

  const charsetSize = charset.size === 0 ? 1 :
    charset.size === 1 ? 26 :
    charset.size === 2 ? 52 :
    charset.size === 3 ? 62 : 94;

  return Math.log2(Math.pow(charsetSize, password.length));
}