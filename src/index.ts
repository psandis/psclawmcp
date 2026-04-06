#!/usr/bin/env node

import { Command } from "commander";
import { getConfigPath, loadConfig, saveConfig } from "./config.js";
import { registry } from "./registry.js";
import { startServer } from "./server.js";

const program = new Command();

program.name("psclawmcp").description("MCP server for the OpenClaw CLI ecosystem").version("0.2.0");

program
  .command("add <tool>")
  .description("Enable a claw tool")
  .action((tool: string) => {
    const entry = registry.find((r) => r.name === tool);
    if (!entry) {
      console.error(`Unknown tool: ${tool}`);
      console.error(`Available: ${registry.map((r) => r.name).join(", ")}`);
      process.exit(1);
    }
    const config = loadConfig();
    if (config.tools.includes(tool)) {
      console.log(`${tool} is already enabled`);
      return;
    }
    config.tools.push(tool);
    saveConfig(config);
    console.log(`Added ${tool} — ${entry.description}`);
  });

program
  .command("remove <tool>")
  .description("Disable a claw tool")
  .action((tool: string) => {
    const config = loadConfig();
    if (!config.tools.includes(tool)) {
      console.log(`${tool} is not enabled`);
      return;
    }
    config.tools = config.tools.filter((t) => t !== tool);
    saveConfig(config);
    console.log(`Removed ${tool}`);
  });

program
  .command("list")
  .description("Show available and enabled tools")
  .action(() => {
    const config = loadConfig();
    console.log("\nAvailable tools:\n");
    for (const entry of registry) {
      const enabled = config.tools.includes(entry.name);
      const marker = enabled ? "✓" : " ";
      console.log(`  [${marker}] ${entry.name.padEnd(12)} ${entry.description}`);
    }
    console.log(`\nConfig: ${getConfigPath()}\n`);
  });

program
  .command("start")
  .description("Start the MCP server")
  .action(async () => {
    await startServer();
  });

program.action(async () => {
  const config = loadConfig();
  if (config.tools.length === 0) {
    program.outputHelp();
    console.log("\nNo tools enabled. Run: psclawmcp add <tool>\n");
  } else {
    await startServer();
  }
});

program.parse();
