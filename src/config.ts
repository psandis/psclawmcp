import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".psclawmcp");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export interface Config {
  tools: string[];
}

export function loadConfig(): Config {
  if (!existsSync(CONFIG_FILE)) {
    return { tools: [] };
  }
  return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
}

export function saveConfig(config: Config): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, `${JSON.stringify(config, null, 2)}\n`);
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
