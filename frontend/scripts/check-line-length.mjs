import { promises as fs } from "node:fs";
import path from "node:path";

const MAX_LINES = 180;
const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "src");
const VALID_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const IGNORED_PREFIXES = ["src/components/ui/"];
const IGNORED_FILES = new Set(["src/lib/mock-data.ts"]);

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(entryPath);
      }
      return [entryPath];
    }),
  );

  return nestedFiles.flat();
}

function toRelativePath(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function shouldCheck(filePath) {
  const relativePath = toRelativePath(filePath);
  const extension = path.extname(filePath);
  if (!VALID_EXTENSIONS.has(extension)) {
    return false;
  }
  if (IGNORED_FILES.has(relativePath)) {
    return false;
  }
  return !IGNORED_PREFIXES.some((prefix) => relativePath.startsWith(prefix));
}

function getLineCount(content) {
  if (content.length === 0) {
    return 0;
  }

  const segments = content.split(/\r?\n/);
  const hasTrailingNewline = content.endsWith("\n");
  return hasTrailingNewline ? segments.length - 1 : segments.length;
}

async function main() {
  const files = (await collectFiles(SOURCE_ROOT)).filter(shouldCheck);
  const violations = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const lineCount = getLineCount(content);

    if (lineCount > MAX_LINES) {
      violations.push({ lineCount, path: toRelativePath(file) });
    }
  }

  if (violations.length > 0) {
    console.error(`Found ${violations.length} source file(s) over ${MAX_LINES} lines:`);
    violations
      .sort((left, right) => right.lineCount - left.lineCount)
      .forEach((violation) => {
        console.error(`- ${violation.path}: ${violation.lineCount} lines`);
      });
    process.exit(1);
  }

  console.log(`All ${files.length} checked source files are within ${MAX_LINES} lines.`);
}

await main();
