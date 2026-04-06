import { z } from "zod";
import { runTool } from "../runner.js";
import type { ToolDef } from "./types.js";

const BIN = "driftclaw";

export const tools: ToolDef[] = [
  {
    name: "driftclaw_report",
    title: "Full Report",
    description: "Full version drift report across all services and environments.",
    inputSchema: z.object({
      config: z.string().optional().describe("Path to driftclaw.yaml config"),
      fail_on_drift: z
        .boolean()
        .optional()
        .describe("Exit with code 1 when drift is detected (useful for CI)"),
    }),
    run: async (args) => {
      const cmd: string[] = [];
      if (args.config) cmd.push("--config", String(args.config));
      if (args.fail_on_drift) cmd.push("--fail-on-drift");
      return runTool(BIN, cmd);
    },
  },
  {
    name: "driftclaw_check",
    title: "Check Service",
    description: "Check a single service version across all environments.",
    inputSchema: z.object({
      service: z.string().describe("Service name to check"),
      config: z.string().optional().describe("Path to driftclaw.yaml config"),
    }),
    run: async (args) => {
      const cmd = ["check", String(args.service)];
      if (args.config) cmd.push("--config", String(args.config));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "driftclaw_drift",
    title: "Show Drift",
    description: "Show only services with version drift across environments.",
    inputSchema: z.object({
      config: z.string().optional().describe("Path to driftclaw.yaml config"),
    }),
    run: async (args) => {
      const cmd = ["drift"];
      if (args.config) cmd.push("--config", String(args.config));
      return runTool(BIN, cmd);
    },
  },
];
