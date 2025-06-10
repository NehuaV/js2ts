#!/usr/bin/env bun
import { stat, unlink } from "node:fs/promises";

function containsJSX(content: string): boolean {
  // Look for JSX patterns in the content
  const jsxPatterns = [
    /<[A-Z][a-zA-Z0-9]*[^>]*>/, // JSX components: <Component>
    /<[a-z]+[^>]*>/, // HTML elements: <div>
    /<>/, // JSX fragments: <>
    /<\/>/, // JSX fragment closing: </>
    /<[A-Za-z][a-zA-Z0-9]*[^>]*\/>/, // Self-closing tags: <Component />
  ];

  return jsxPatterns.some((pattern) => pattern.test(content));
}

async function convertJSToTS(jsFile: string) {
  try {
    const content = await Bun.file(jsFile).text();

    // Determine target extension based on file extension and content
    const originallyJSX = jsFile.endsWith(".jsx");
    const hasJSXContent = containsJSX(content);

    const shouldUseTSX = originallyJSX || hasJSXContent;
    const tsFile = shouldUseTSX ? jsFile.replace(/\.jsx?$/, ".tsx") : jsFile.replace(/\.jsx?$/, ".ts");

    await Bun.write(tsFile, content);
    await unlink(jsFile);
    console.log(`✅ Converted: ${jsFile} -> ${tsFile}`);
  } catch (err) {
    console.error(`❌ Failed to convert ${jsFile}:`, err);
  }
}

async function main() {
  const [, , inputPath, ...ignorePaths] = process.argv;
  const defaultIgnores = ["node_modules", "dist", "build", "out"];
  const ignorePatterns = [...defaultIgnores, ...ignorePaths];

  if (!inputPath) {
    console.error("❌ Please provide a directory path.");
    console.error("Usage: js2ts <directory> [ignore-pattern1] [ignore-pattern2] ...");
    console.error("Example: js2ts ./src dist build node_modules");
    process.exit(1);
  }

  try {
    // Verify input is a directory
    const stats = await stat(inputPath);
    if (!stats.isDirectory()) {
      console.error("❌ The provided path is not a directory.");
      process.exit(1);
    }

    if (ignorePatterns.length > 0) {
      console.log(`🚫 Ignoring patterns: ${ignorePatterns.join(", ")}`);
    }

    // Find all JS and JSX files with a single pattern
    const fileGlob = new Bun.Glob(`${inputPath}/**/*.{js,jsx}`);
    const jsFiles: string[] = [];

    // Collect files that don't match ignore patterns
    for await (const file of fileGlob.scan()) {
      const shouldIgnore = ignorePatterns.some(
        (pattern) => file.includes(`/${pattern}/`) || file.includes(`${pattern}/`) || file.endsWith(`/${pattern}`) || file === pattern
      );

      if (!shouldIgnore) {
        jsFiles.push(file);
      }
    }

    if (jsFiles.length === 0) {
      console.log("ℹ️ No .js/.jsx files found (after applying ignore patterns).");
      return;
    }

    const jsCount = jsFiles.filter((f) => f.endsWith(".js")).length;
    const jsxCount = jsFiles.filter((f) => f.endsWith(".jsx")).length;

    console.log(`🔍 Found ${jsFiles.length} file(s) to convert (${jsCount} .js, ${jsxCount} .jsx)`);
    console.log("⚠️  Original .js/.jsx files will be removed after conversion");

    // Process files in parallel
    await Promise.all(jsFiles.map(convertJSToTS));
    console.log("🎉 Conversion complete - all .js/.jsx files converted to .ts/.tsx and originals removed.");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
