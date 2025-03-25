import { lex } from "@/markdown/index.ts";
import { assertEquals } from "@std/assert";
import { join, extname } from "jsr:/@std/path";
import { Token } from "@/markdown/types/index.ts";

// Directory containing test case files
const testCasesDir = "./src/markdown/lexer/test";

export class TestCase {
    input: string;
    expected: Token[];
  
    constructor(input: string, expected: Token[]) {
      this.input = input;
      this.expected = expected;
    }
}

// Recursive function to collect all test case files
function collectTestFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of Deno.readDirSync(dir)) {
    const entryPath = join(dir, entry.name);
    if (entry.isFile && extname(entry.name) === ".ts") {
      files.push(entryPath);
    } else if (entry.isDirectory) {
      files.push(...collectTestFiles(entryPath)); // Recurse into subdirectory
    }
  }
  return files;
}

// Collect all test case files
const testFiles = collectTestFiles(testCasesDir);

// Load and run all test cases
for (const filePath of testFiles) {
  const testCase: TestCase = (await import(filePath)).default; // Import the default export

  Deno.test(`Test case: ${filePath}`, () => {
    assertEquals(lex(testCase.input), testCase.expected);
  });
}