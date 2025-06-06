# js2ts

A fast CLI tool to convert JavaScript files to TypeScript files using Bun.

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
- 🚫 Ignore patterns support (node_modules ignored by default)
- 🎯 Simple: just copies `.js` files to `.ts` files

## Ignore Patterns

By default, `node_modules` is always ignored. You can specify additional directories or files to ignore:

```bash
js2ts ./src dist build temp coverage
```

This would ignore:

- `node_modules/` (default)
- `dist/`
- `build/`
- `temp/`
- `coverage/`

## Examples

### Basic conversion

```bash
$ js2ts ./my-project
🚫 Ignoring patterns: node_modules
🔍 Found 5 JS file(s) to convert
✅ Converted: ./my-project/index.js -> ./my-project/index.ts
✅ Converted: ./my-project/utils.js -> ./my-project/utils.ts
✅ Converted: ./my-project/lib/helper.js -> ./my-project/lib/helper.ts
🎉 Conversion complete.
```

### With ignore patterns

```bash
$ js2ts ./my-project dist build
🚫 Ignoring patterns: node_modules, dist, build
🔍 Found 3 JS file(s) to convert
✅ Converted: ./my-project/src/index.js -> ./my-project/src/index.ts
✅ Converted: ./my-project/src/utils.js -> ./my-project/src/utils.ts
✅ Converted: ./my-project/lib/helper.js -> ./my-project/lib/helper.ts
🎉 Conversion complete.
```

This project was created using `bun init` in bun v1.2.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
