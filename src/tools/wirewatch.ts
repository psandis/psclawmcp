import { z } from "zod";
import { runTool } from "../runner.js";
import type { ToolDef } from "./types.js";

const BIN = "ww";

export const tools: ToolDef[] = [
  {
    name: "wirewatch_start",
    title: "Start Daemon",
    description: "Start the wirewatch background capture daemon.",
    inputSchema: z.object({}),
    run: async () => runTool(BIN, ["start"]),
  },
  {
    name: "wirewatch_stop",
    title: "Stop Daemon",
    description: "Stop the wirewatch background capture daemon.",
    inputSchema: z.object({}),
    run: async () => runTool(BIN, ["stop"]),
  },
  {
    name: "wirewatch_status",
    title: "Daemon Status",
    description: "Show daemon running status, uptime, and connection count.",
    inputSchema: z.object({}),
    run: async () => runTool(BIN, ["status"]),
  },
  {
    name: "wirewatch_list",
    title: "List Connections",
    description: "List captured network connections from the database.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Max results (default 100)"),
      protocol: z.string().optional().describe("Filter by protocol: tcp, udp"),
      dst: z.string().optional().describe("Filter by destination IP"),
      direction: z.string().optional().describe("Filter by direction: inbound, outbound, local"),
      process: z.string().optional().describe("Filter by process name"),
      since: z.number().optional().describe("Show connections since timestamp (unix ms)"),
    }),
    run: async (args) => {
      const cmd = ["list"];
      if (args.limit) cmd.push("--limit", String(args.limit));
      if (args.protocol) cmd.push("--protocol", String(args.protocol));
      if (args.dst) cmd.push("--dst", String(args.dst));
      if (args.direction) cmd.push("--direction", String(args.direction));
      if (args.process) cmd.push("--process", String(args.process));
      if (args.since) cmd.push("--since", String(args.since));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "wirewatch_show",
    title: "Show Connection",
    description: "Show full details for a single connection by ID.",
    inputSchema: z.object({
      id: z.number().describe("Connection ID"),
    }),
    run: async (args) => runTool(BIN, ["show", String(args.id)]),
  },
  {
    name: "wirewatch_analyze",
    title: "AI Analysis",
    description: "Send recent connections to AI for anomaly detection and risk assessment.",
    inputSchema: z.object({}),
    run: async () => runTool(BIN, ["analyze"]),
  },
  {
    name: "wirewatch_analyses",
    title: "List Analyses",
    description: "List past AI analyses with risk level, model, connection count, and summary.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Max results (default 20)"),
    }),
    run: async (args) => {
      const cmd = ["analyses"];
      if (args.limit) cmd.push("--limit", String(args.limit));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "wirewatch_db_stats",
    title: "Database Stats",
    description: "Show wirewatch database statistics.",
    inputSchema: z.object({}),
    run: async () => runTool(BIN, ["db", "stats"]),
  },
];
