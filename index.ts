#!/usr/bin/env bun
import { stat } from "node:fs/promises";

async function convertToTS(jsFile: string) {
	const tsFile = jsFile.replace(/\.js$/, ".ts");

	try {
		const file = Bun.file(jsFile);
		const content = await file.text();
		await Bun.write(tsFile, content);
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
		console.error(
			"Usage: js2ts <directory> [ignore-pattern1] [ignore-pattern2] ...",
		);
		console.error("Example: js2ts ./src dist build node_modules");
		process.exit(1);
	}

	try {
		const stats = await stat(inputPath);
		if (!stats.isDirectory()) {
			console.error("❌ The provided path is not a directory.");
			process.exit(1);
		}

		if (ignorePatterns.length > 0) {
			console.log(`🚫 Ignoring patterns: ${ignorePatterns.join(", ")}`);
		}

		// Use Bun.glob for efficient file finding
		const glob = new Bun.Glob(`${inputPath}/**/*.js`);
		const jsFiles: string[] = [];

		for await (const file of glob.scan()) {
			// Check if file should be ignored
			const shouldIgnore = ignorePatterns.some(
				(pattern) =>
					file.includes(`/${pattern}/`) ||
					file.includes(`${pattern}/`) ||
					file.endsWith(`/${pattern}`) ||
					file === pattern,
			);

			if (!shouldIgnore) {
				jsFiles.push(file);
			}
		}

		if (jsFiles.length === 0) {
			console.log("ℹ️ No .js files found (after applying ignore patterns).");
			return;
		}

		console.log(`🔍 Found ${jsFiles.length} JS file(s) to convert`);

		// Process files in parallel
		await Promise.all(jsFiles.map(convertToTS));
		console.log("🎉 Conversion complete.");
	} catch (err) {
		console.error("❌ Error:", err);
		process.exit(1);
	}
}

main();
