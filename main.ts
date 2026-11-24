// Funniest Time Machine Warning Label — make.fun entry.
// Writes one warning label (a single line, at most 120 characters) to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LABEL =
  "WARNING: If the machine returns empty, do not panic. You are the one who didn't come back.";

const MAX_CHARS = 120;

function countChars(text: string): number {
  return [...text].length;
}

function validate(label: string): void {
  if (label.length === 0) {
    throw new Error("label must not be empty");
  }
  if (countChars(label) > MAX_CHARS) {
    throw new Error(
      `label is ${countChars(label)} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (label.trim() !== label) {
    throw new Error("label must not start or end with whitespace");
  }
  if (label.includes("\n") || label.includes("\r")) {
    throw new Error("label must be a single line");
  }
}

function main(): void {
  validate(LABEL);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LABEL, "utf8");
  // Read back what was written and confirm it is exactly the validated label.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== LABEL) {
    throw new Error("round-trip check failed: entry.txt differs from the label");
  }
  console.log(`wrote ${countChars(LABEL)} characters to ${outPath}`);
}

main();
