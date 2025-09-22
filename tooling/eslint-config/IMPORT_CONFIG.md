# ESLint Import Management & Production Configuration

This configuration provides comprehensive import management, automatic unused
import deletion, and production-ready code quality rules.

## Features

### ✅ Import Management

- **Automatic import ordering** with logical grouping
- **Unused import deletion** on save
- **Import cycle detection**
- **Type-only import separation**

### ✅ Import Order Groups

1. Side effect imports
2. Node.js built-in modules
3. External packages (npm)
4. Internal packages (`@repo/`)
5. Parent imports (`../`)
6. Relative imports (`./`)
7. Type imports

### ✅ Production Rules

- TypeScript best practices
- React/Next.js specific rules
- Security rules
- Performance optimizations
- Code quality enforcement

## VS Code Integration

Add this to your VS Code settings (`.vscode/settings.json`):

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "eslint.format.enable": true,
  "eslint.codeActionsOnSave.mode": "all"
}
```

## Example Import Order

After configuration, your imports will be automatically organized like this:

```typescript
// Side effects
import './globals.css';

// Node.js built-ins
import { readFileSync } from 'fs';
import path from 'path';

// External packages
import React from 'react';
import { NextRequest } from 'next/server';
import axios from 'axios';

// Internal packages
import { UserService } from '@repo/database';
import { Button } from '@repo/ui';

// Parent imports
import { config } from '../config';
import { utils } from '../../utils';

// Relative imports
import { Component } from './Component';
import { helper } from './helper';

// Type imports (separated)
import type { User } from '@repo/shared';
import type { Config } from '../types';
```

## Key Rules Enabled

### Import Management

- `simple-import-sort/imports`: Automatic import ordering
- `simple-import-sort/exports`: Export ordering
- `unused-imports/no-unused-imports`: Remove unused imports
- `import/no-cycle`: Prevent circular dependencies
- `import/no-duplicate-imports`: Prevent duplicate imports

### TypeScript Quality

- `@typescript-eslint/consistent-type-imports`: Prefer type-only imports
- `@typescript-eslint/prefer-nullish-coalescing`: Use ?? instead of ||
- `@typescript-eslint/prefer-optional-chain`: Use optional chaining
- `@typescript-eslint/no-floating-promises`: Await async calls
- `@typescript-eslint/naming-convention`: Consistent naming

### React/Next.js

- `react/self-closing-comp`: Self-closing components
- `react/jsx-boolean-value`: Implicit boolean props
- `react/no-unstable-nested-components`: Prevent memory leaks
- `@next/next/no-img-element`: Use Next.js Image component
- `react-hooks/exhaustive-deps`: Complete dependency arrays

### Security & Performance

- `no-eval`: Prevent eval usage
- `react/jsx-no-target-blank`: Safe external links
- `react/jsx-no-bind`: Prevent inline functions
- `no-console`: Warn on console usage

## Usage

### For React/Next.js projects:

```javascript
import { nextJsConfig } from '@repo/eslint-config/next';

export default [...nextJsConfig];
```

### For Node.js/API projects:

```javascript
import { config } from '@repo/eslint-config/base';

export default [...config];
```

## Commands

```bash
# Lint with auto-fix
pnpm lint --fix

# Format and fix imports
pnpm format && pnpm lint --fix
```

## Customization

You can customize import groups in your project's ESLint config:

```javascript
export default [
  ...nextJsConfig,
  {
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Your custom groups here
            ['^@mycompany(/.*|$)'], // Company packages first
            ['^@repo(/.*|$)'], // Then repo packages
          ],
        },
      ],
    },
  },
];
```
