#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import { resolve, basename } from "path";

const REPO = "https://github.com/tiff-k/flow-club-build-challenge.git";
const DEFAULT_NAME = "flow-club-build-challenge";

const args = process.argv.slice(2);
const projectName = args[0] || DEFAULT_NAME;
const targetDir = resolve(process.cwd(), projectName);

// Colors for terminal output
const bold = (t) => `\x1b[1m${t}\x1b[0m`;
const green = (t) => `\x1b[32m${t}\x1b[0m`;
const cyan = (t) => `\x1b[36m${t}\x1b[0m`;
const dim = (t) => `\x1b[2m${t}\x1b[0m`;

console.log();
console.log(bold("  Flow Club Build Challenge"));
console.log(dim("  Build and deploy your own website with Claude Code"));
console.log();

// Check if directory already exists
if (existsSync(targetDir)) {
  console.error(`  Error: ${bold(projectName)} already exists in this directory.`);
  console.error(`  Pick a different name or delete the existing folder.`);
  console.log();
  process.exit(1);
}

// Clone the template
console.log(`  Downloading template into ${bold(projectName)}...`);
try {
  execSync(`git clone --depth 1 ${REPO} "${targetDir}"`, { stdio: "pipe" });
} catch {
  console.error("  Error: Failed to clone the template. Check your internet connection.");
  process.exit(1);
}

// Remove .git and reinitialize so they start fresh
rmSync(resolve(targetDir, ".git"), { recursive: true, force: true });
try {
  execSync("git init", { cwd: targetDir, stdio: "pipe" });
  execSync("git add -A", { cwd: targetDir, stdio: "pipe" });
  execSync('git commit -m "Initial commit from Flow Club Build Challenge"', {
    cwd: targetDir,
    stdio: "pipe",
  });
} catch {
  // Git init is nice-to-have, don't fail on it
}

// Install dependencies
console.log("  Installing dependencies...");
console.log();
try {
  execSync("npm install", { cwd: targetDir, stdio: "inherit" });
} catch {
  console.log();
  console.log(dim("  npm install had issues — you can retry manually."));
}

// Success message
console.log();
console.log(green("  Done!") + " Your project is ready.");
console.log();
console.log("  Next steps:");
console.log();
console.log(`    ${cyan("cd")} ${projectName}`);
console.log(`    ${cyan("npm run dev")}          ${dim("— start the dev server")}`);
console.log(`    ${cyan("claude")}               ${dim("— open Claude Code")}`);
console.log(`    ${cyan("/kickoff")}             ${dim("— start the challenge")}`);
console.log();
console.log(dim("  Happy building!"));
console.log();
