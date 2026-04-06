import { z } from "zod";
import { runTool } from "../runner.js";
import type { ToolDef } from "./types.js";

const BIN = "feedclaw";

export const tools: ToolDef[] = [
  {
    name: "feedclaw_list",
    title: "List Feeds",
    description: "List subscribed RSS/Atom feeds. Optionally filter by category.",
    inputSchema: z.object({
      category: z.string().optional().describe("Filter by feed category"),
    }),
    run: async (args) => {
      const cmd = ["list"];
      if (args.category) cmd.push("--category", String(args.category));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "feedclaw_fetch",
    title: "Fetch Articles",
    description: "Fetch new articles from subscribed feeds.",
    inputSchema: z.object({
      feed: z.string().optional().describe("Fetch a single feed by ID or URL"),
    }),
    run: async (args) => {
      const cmd = ["fetch"];
      if (args.feed) cmd.push("--feed", String(args.feed));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "feedclaw_digest",
    title: "Generate Digest",
    description: "Generate an AI-powered digest of recent articles.",
    inputSchema: z.object({
      since: z.string().optional().describe("Time window: 24h, 7d, 2w (default: 24h)"),
      category: z.string().optional().describe("Filter by feed category"),
      format: z.enum(["terminal", "markdown", "html", "json"]).optional().describe("Output format"),
      max_articles: z.number().optional().describe("Max articles to include"),
    }),
    run: async (args) => {
      const cmd = ["digest"];
      if (args.since) cmd.push("--since", String(args.since));
      if (args.category) cmd.push("--category", String(args.category));
      if (args.format) cmd.push("--format", String(args.format));
      if (args.max_articles) cmd.push("--max-articles", String(args.max_articles));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "feedclaw_add",
    title: "Add Feed",
    description: "Subscribe to an RSS/Atom feed by URL.",
    inputSchema: z.object({
      url: z.string().describe("Feed URL to subscribe to"),
      category: z.string().optional().describe("Feed category"),
    }),
    run: async (args) => {
      const cmd = ["add", String(args.url)];
      if (args.category) cmd.push("--category", String(args.category));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "feedclaw_remove",
    title: "Remove Feed",
    description: "Unsubscribe from a feed by ID or URL.",
    inputSchema: z.object({
      target: z.string().describe("Feed ID or URL to remove"),
    }),
    run: async (args) => runTool(BIN, ["remove", String(args.target)]),
  },
];
