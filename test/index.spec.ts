import { resolve } from 'path';
import { readFileSync } from 'fs';
/**
 * @fileoverview TSLint wrapper plugin for ESLint
 * @author James Henry
 */
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../lib/index').rules.config;
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {},
};

/**
 * Inline rules should be supported
 */
const tslintRulesConfig = {
  rules: {
    semicolon: [true, 'always'],
  },
};

/**
 * Custom rules directories should be supported
 */
const tslintRulesDirectoryConfig = {
  rulesDirectory: ['./test/test-tslint-rules-directory'],
  rules: {
    'always-fail': {
      severity: 'error',
    },
  },
};

ruleTester.run('tslint/config', rule, {
  valid: [
    {
      code: 'var foo = true;',
      parser: 'typescript-eslint-parser',
      parserOptions,
      options: [tslintRulesConfig],
    },
  ],

  invalid: [
    {
      code: 'var foo = true',
      parser: 'typescript-eslint-parser',
      parserOptions,
      options: [tslintRulesConfig],
      output: 'var foo = true',
      errors: [
        {
          message: 'Missing semicolon (tslint:semicolon)',
          line: 1,
          column: 15,
        },
      ],
    },
    {
      code: 'var foo = true',
      parser: 'typescript-eslint-parser',
      parserOptions,
      options: [tslintRulesDirectoryConfig],
      output: 'var foo = true',
      errors: [
        {
          message: 'failure (tslint:always-fail)',
          line: 1,
          column: 1,
        },
      ],
    },
    {
      filename: resolve('test/test-project/source.ts'),
      code: readFileSync('test/test-project/source.ts').toString(),
      parser: 'typescript-eslint-parser',
      parserOptions,
      options: [
        {
          rulesDirectory: ['node_modules/tslint/lib/rules'],
          rules: { 'restrict-plus-operands': true, 'no-unused-variable': true },
          configFile: `${__dirname}/test-project/tsconfig.json`,
        },
      ],
      errors: [
        {
          message:
            'Operands of \'+\' operation must either be both strings or both numbers, consider using template literals (tslint:restrict-plus-operands)',
        },
        {
          message:
            '\'unused\' is declared but its value is never read. (tslint:no-unused-variable)',
        },
      ],
    },
  ],
});
