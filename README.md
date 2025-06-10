# js2ts

A fast CLI tool to convert JavaScript and JSX files to TypeScript files using Bun.

⚠️ **Important**: This tool **removes** the original `.js` and `.jsx` files after converting them to `.ts` and `.tsx` files respectively.

## Installation

```bash
bun install
```

## Usage

### Basic Usage

```bash
bun index.ts /path/to/your/project
```

### With Ignore Patterns

```bash
bun index.ts /path/to/your/project dist build temp
```

### Run directly with Bun

```bash
bun index.ts /path/to/your/project [ignore-pattern1] [ignore-pattern2] ...
```

### Build as standalone executable

```bash
bun run build
./js2ts /path/to/your/project [ignore-patterns...]
```

### Install globally

```bash
bun link
js2ts /path/to/your/project [ignore-patterns...]
```

## Features

- 🚀 Fast file discovery using `Bun.glob()`
- 📁 Recursive directory traversal
- ⚡ Parallel file processing
- 💻 CLI executable
- 🚫 Ignore patterns support (node_modules, dist, build, out ignored by default)
- 🔄 **Converts and removes**: Creates `.ts`/`.tsx` files and removes original `.js`/`.jsx` files
- 🎯 Supports both: `.js` → `.ts` and `.jsx` → `.tsx` conversions
- 🧠 **Smart JSX detection**: Automatically detects JSX syntax in `.js` files and converts to `.tsx`
- 📝 Simple: copies content then deletes originals

## File Conversions

- `.js` files → `.ts` files (or `.tsx` if JSX syntax is detected)
- `.jsx` files → `.tsx` files

The tool automatically detects JSX syntax in JavaScript files by looking for:

- JSX components (`<Component>`)
- HTML elements (`<div>`, `<span>`, etc.)
- JSX fragments (`<>`, `</>`)
- Self-closing tags (`<Component />`)

If JSX syntax is found in a `.js` file, it will be converted to `.tsx` instead of `.ts`.

## Ignore Patterns

By default, `node_modules`, `dist`, `build`, and `out` are always ignored. You can specify additional directories or files to ignore:

```bash
js2ts ./src temp coverage __tests__
```

This would ignore:

- `node_modules/` (default)
- `dist/` (default)
- `build/` (default)
- `out/` (default)
- `temp/`
- `coverage/`
- `__tests__/`

## Examples

### Basic conversion

```bash
$ js2ts ./my-project
🚫 Ignoring patterns: node_modules, dist, build, out
🔍 Found 8 file(s) to convert (5 .js, 3 .jsx)
⚠️  Original .js/.jsx files will be removed after conversion
✅ Converted: ./my-project/index.js -> ./my-project/index.ts
✅ Converted: ./my-project/utils.js -> ./my-project/utils.ts
✅ Converted: ./my-project/components/Button.jsx -> ./my-project/components/Button.tsx
✅ Converted: ./my-project/components/Header.jsx -> ./my-project/components/Header.tsx
✅ Converted: ./my-project/components/App.js -> ./my-project/components/App.tsx
✅ Converted: ./my-project/lib/helper.js -> ./my-project/lib/helper.ts
🎉 Conversion complete - all .js/.jsx files converted to .ts/.tsx and originals removed.
```

### With ignore patterns

```bash
$ js2ts ./my-project temp coverage
🚫 Ignoring patterns: node_modules, dist, build, out, temp, coverage
🔍 Found 6 file(s) to convert (4 .js, 2 .jsx)
⚠️  Original .js/.jsx files will be removed after conversion
✅ Converted: ./my-project/src/index.js -> ./my-project/src/index.ts
✅ Converted: ./my-project/src/utils.js -> ./my-project/src/utils.ts
✅ Converted: ./my-project/src/App.jsx -> ./my-project/src/App.tsx
✅ Converted: ./my-project/lib/helper.js -> ./my-project/lib/helper.ts
🎉 Conversion complete - all .js/.jsx files converted to .ts/.tsx and originals removed.
```

## ⚠️ Warning

This tool **permanently removes** your original `.js` and `.jsx` files after conversion. Make sure to:

1. **Backup your code** or use version control before running
2. **Test in a safe environment** first
3. **Review the file list** shown before proceeding

The tool only removes `.js`/`.jsx` files after successfully creating the corresponding `.ts`/`.tsx` files.

This project was created using `bun init` in bun v1.2.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
