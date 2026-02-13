import path from "node:path";
import fs from "fs-extra";
import prompts from "prompts";
import chalk from "chalk";
import { execa } from "execa";
import { lightenHex, darkenHex } from "./color.js";

type NextPackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

async function ensureNextProject(root: string) {
  const packageJsonPath = path.join(root, "package.json");
  const exists = await fs.pathExists(packageJsonPath);
  if (!exists) {
    throw new Error("package.json not found. Run this inside a Next.js project.");
  }
  const pkg = (await fs.readJson(packageJsonPath)) as NextPackageJson;
  const hasNext = Boolean(pkg.dependencies?.next || pkg.devDependencies?.next);
  if (!hasNext) {
    throw new Error("next dependency not found in package.json. Run this inside a Next.js project.");
  }
}

async function detectSrcRoot(root: string) {
  const srcPath = path.join(root, "src");
  const hasSrc = await fs.pathExists(srcPath);
  if (hasSrc) {
    return srcPath;
  }
  return root;
}

async function runShadcnWorkflow() {
  console.log(chalk.cyan("Running shadcn init"));
  await execa("npx", ["shadcn", "init"], { stdio: "inherit" });
  console.log(chalk.cyan("Installing shadcn button component"));
  await execa("npx", ["shadcn", "add", "button"], { stdio: "inherit" });
}

async function ensureStandardFolders(root: string) {
  const targets = ["components", "hooks", "utils"];
  for (const name of targets) {
    const dir = path.join(root, name);
    await fs.ensureDir(dir);
  }
}

async function detectGlobalsCss(root: string) {
  const candidates = [
    path.join(root, "src", "app", "globals.css"),
    path.join(root, "app", "globals.css")
  ];
  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }
  throw new Error("globals.css not found. Expected src/app/globals.css or app/globals.css.");
}

function buildGlobalsCss(primary: string, secondary: string) {
  const primaryLight = lightenHex(primary, 0.2);
  const primaryDark = darkenHex(primary, 0.2);
  const secondaryLight = lightenHex(secondary, 0.2);
  const secondaryDark = darkenHex(secondary, 0.2);
  const primaryValue = `#${primary}`;
  const primaryLightValue = `#${primaryLight}`;
  const primaryDarkValue = `#${primaryDark}`;
  const secondaryValue = `#${secondary}`;
  const secondaryLightValue = `#${secondaryLight}`;
  const secondaryDarkValue = `#${secondaryDark}`;
  return `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --primary: ${primaryValue};
  --primary-light: ${primaryLightValue};
  --primary-dark: ${primaryDarkValue};
  --primary-foreground: #ffffff;

  --secondary: ${secondaryValue};
  --secondary-light: ${secondaryLightValue};
  --secondary-dark: ${secondaryDarkValue};
  --secondary-foreground: #ffffff;

  --background: #ffffff;
  --foreground: #020817;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: ${primaryValue};
  --radius: 0.75rem;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background-color: var(--background);
  color: var(--foreground);
}

html {
  min-height: 100%;
}

@layer base {
  * {
    border-color: var(--border);
  }

  body {
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

.bg-primary { background-color: var(--primary); }
.bg-primary-light { background-color: var(--primary-light); }
.bg-primary-dark { background-color: var(--primary-dark); }

.text-primary { color: var(--primary); }

.bg-secondary { background-color: var(--secondary); }
.bg-secondary-light { background-color: var(--secondary-light); }
.bg-secondary-dark { background-color: var(--secondary-dark); }

.text-secondary { color: var(--secondary); }
`;
}

export async function runCli() {
  const root = process.cwd();
  await ensureNextProject(root);
  const srcRoot = await detectSrcRoot(root);

  const shadcnAnswer = await prompts({
    type: "confirm",
    name: "install",
    message: "Do you want to install shadcn/ui? (yes/no)",
    initial: true
  });

  if (shadcnAnswer.install) {
    await runShadcnWorkflow();
  }

  const foldersAnswer = await prompts({
    type: "confirm",
    name: "create",
    message: "Do you want to generate standard development folders? (yes/no)",
    initial: true
  });

  if (foldersAnswer.create) {
    await ensureStandardFolders(srcRoot);
  }

  const themeAnswer = await prompts({
    type: "confirm",
    name: "theme",
    message: "Do you want to set color theme? (yes/no)",
    initial: true
  });

  if (!themeAnswer.theme) {
    console.log(chalk.green("Done. No theme changes applied."));
    return;
  }

  const colors = await prompts([
    {
      type: "text",
      name: "primary",
      message: "Enter primary color (hex without #)",
      validate: (value: string) => (/^[0-9a-fA-F]{6}$/.test(String(value)) ? true : "Enter a 6 character hex value without #")
    },
    {
      type: "text",
      name: "secondary",
      message: "Enter secondary color (hex without #)",
      validate: (value: string) => (/^[0-9a-fA-F]{6}$/.test(String(value)) ? true : "Enter a 6 character hex value without #")
    }
  ]);

  const primary = String(colors.primary);
  const secondary = String(colors.secondary);

  const globalsPath = await detectGlobalsCss(root);
  const cssContent = buildGlobalsCss(primary, secondary);
  await fs.writeFile(globalsPath, cssContent, "utf8");

  console.log(chalk.green("Theme configured successfully."));
}


