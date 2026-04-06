import { z } from "zod";
import { runTool } from "../runner.js";
import type { ToolDef } from "./types.js";

const BIN = "dietclaw";

export const tools: ToolDef[] = [
  {
    name: "dietclaw_scan",
    title: "Health Report",
    description:
      "Quick health report for a project: lines of code, file counts, language breakdown.",
    inputSchema: z.object({
      path: z.string().optional().describe("Project path to scan"),
      limit: z.number().optional().describe("Limit results"),
      each: z.boolean().optional().describe("Detect and report on subprojects"),
      save: z.boolean().optional().describe("Save a snapshot for trend tracking"),
    }),
    run: async (args) => {
      const cmd = ["scan"];
      if (args.path) cmd.push(String(args.path));
      if (args.limit) cmd.push("--limit", String(args.limit));
      if (args.each) cmd.push("--each");
      if (args.save) cmd.push("--save");
      return runTool(BIN, cmd);
    },
  },
  {
    name: "dietclaw_deps",
    title: "Dependency Analysis",
    description: "Analyze dependencies: outdated, unused, heavy, and duplicates.",
    inputSchema: z.object({
      path: z.string().optional().describe("Project path to analyze"),
      limit: z.number().optional().describe("Limit results"),
    }),
    run: async (args) => {
      const cmd = ["deps"];
      if (args.path) cmd.push(String(args.path));
      if (args.limit) cmd.push("--limit", String(args.limit));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "dietclaw_trend",
    title: "Health Trends",
    description: "Show project health over time from saved snapshots.",
    inputSchema: z.object({
      path: z.string().optional().describe("Project path"),
      limit: z.number().optional().describe("Limit results"),
    }),
    run: async (args) => {
      const cmd = ["trend"];
      if (args.path) cmd.push(String(args.path));
      if (args.limit) cmd.push("--limit", String(args.limit));
      return runTool(BIN, cmd);
    },
  },
];
