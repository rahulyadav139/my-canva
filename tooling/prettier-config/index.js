/**
 * @type {import('prettier').Config}
 */
module.exports = {
  // Prettier plugins
  plugins: ['prettier-plugin-tailwindcss'],

  // Tailwind plugin specific configuration
  tailwindFunctions: ['clsx', 'cva', 'cn'],
  tailwindAttributes: ['class', 'className', 'ngClass'],

  // Print semicolons at the ends of statements
  semi: true,

  // Use single quotes instead of double quotes
  singleQuote: true,

  // Print trailing commas wherever possible in multi-line comma-separated syntactic structures
  trailingComma: 'all',

  // Include parentheses around a sole arrow function parameter
  arrowParens: 'always',

  // The line length where Prettier will try wrap
  printWidth: 80,

  // Number of spaces per indentation level
  tabWidth: 2,

  // Indent with spaces instead of tabs
  useTabs: false,

  // Print spaces between brackets in object literals
  bracketSpacing: true,

  // Put the > of a multi-line JSX element at the end of the last line instead of being alone on the next line
  bracketSameLine: false,

  // Line ending style
  endOfLine: 'lf',

  // Control whether Prettier formats quoted code embedded in the file
  embeddedLanguageFormatting: 'auto',

  // How to handle whitespaces in HTML
  htmlWhitespaceSensitivity: 'css',

  // Whether to add a semicolon at the end of every statement in Vue SFCs
  vueIndentScriptAndStyle: false,

  // Control the printing of spaces inside array and object literals
  bracketSpacing: true,

  // Control the printing of quotes in object properties
  quoteProps: 'as-needed',

  // Control the printing of spaces inside JSX brackets
  jsxSingleQuote: true,

  // Control the printing of prose wrap
  proseWrap: 'preserve',

  // Override formatting for specific file types
  overrides: [
    {
      files: ['*.tsx', '*.jsx'],
      options: {
        printWidth: 80,
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 120,
        trailingComma: 'none',
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        singleQuote: false,
        tabWidth: 2,
      },
    },
    {
      files: '*.svg',
      options: {
        parser: 'html',
      },
    },
  ],
};
