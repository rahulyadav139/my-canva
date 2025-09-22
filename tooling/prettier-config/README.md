# @repo/prettier-config

Shared Prettier configuration for the monorepo.

## Usage

Install the package and extend the configuration:

```json
{
  "prettier": "@repo/prettier-config"
}
```

Or create a `.prettierrc.js` file:

```javascript
module.exports = require('@repo/prettier-config');
```

## Configuration

This configuration includes:

- **Semi**: Always use semicolons
- **Single Quote**: Use single quotes instead of double quotes
- **Trailing Comma**: Add trailing commas where possible
- **Arrow Parens**: Always include parentheses around arrow function parameters
- **Print Width**: 120 characters
- **Tab Width**: 2 spaces
- **End of Line**: LF (Unix-style line endings)
- **Bracket Spacing**: Include spaces in object brackets
- **JSX Single Quote**: Use single quotes in JSX

## File-specific Overrides

- **Markdown**: 80 character limit with prose wrapping
- **JSON**: No trailing commas
- **YAML**: Double quotes, 2-space indentation
- **SVG**: HTML parser for proper formatting

## Development

This package is part of the monorepo's tooling configuration and should be referenced by all workspace packages for consistent code formatting.
