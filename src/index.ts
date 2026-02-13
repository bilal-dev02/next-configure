#!/usr/bin/env node
import chalk from "chalk";
import { runCli } from "./main.js";

runCli().catch(error => {
  console.error(chalk.red(String(error instanceof Error ? error.message : error)));
  process.exit(1);
});


