import { z } from "zod";
import { runTool } from "../runner.js";
import type { ToolDef } from "./types.js";

const BIN = "dustclaw";

export const tools: ToolDef[] = [
  {
    name: "dustclaw_overview",
    title: "Disk Overview",
    description: "Quick overview of disk usage, free space, and top directories.",
    inputSchema: z.object({
      path: z.string().optional().describe("Path to analyze"),
      top: z.number().optional().describe("Number of top directories to show"),
    }),
    run: async (args) => {
      const cmd = ["overview"];
      if (args.path) cmd.push("--path", String(args.path));
      if (args.top) cmd.push("--top", String(args.top));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "dustclaw_scan",
    title: "Deep Scan",
    description: "Deep scan with ranked list of largest files and folders.",
    inputSchema: z.object({
      path: z.string().optional().describe("Path to scan"),
      top: z.number().optional().describe("Number of results to show"),
      depth: z.number().optional().describe("Max directory depth"),
      older_than: z.string().optional().describe("Only show items older than this age"),
      files_only: z.boolean().optional().describe("Show only files"),
      dirs_only: z.boolean().optional().describe("Show only directories"),
    }),
    run: async (args) => {
      const cmd = ["scan"];
      if (args.path) cmd.push(String(args.path));
      if (args.top) cmd.push("--top", String(args.top));
      if (args.depth) cmd.push("--depth", String(args.depth));
      if (args.older_than) cmd.push("--older-than", String(args.older_than));
      if (args.files_only) cmd.push("--files-only");
      if (args.dirs_only) cmd.push("--dirs-only");
      return runTool(BIN, cmd);
    },
  },
  {
    name: "dustclaw_wasteland",
    title: "Find Waste",
    description: "Find known dev/OS space wasters like caches, build artifacts, and Trash.",
    inputSchema: z.object({
      node_modules: z.string().optional().describe("Path to scan for node_modules"),
    }),
    run: async (args) => {
      const cmd = ["wasteland"];
      if (args.node_modules) cmd.push("--node-modules", String(args.node_modules));
      return runTool(BIN, cmd);
    },
  },
];
