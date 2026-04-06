import { z } from "zod";
import { runTool } from "../runner.js";
import type { ToolDef } from "./types.js";

const BIN = "feedclaw";

export const tools: ToolDef[] = [
  {
    name: "feedclaw_init",
    title: "Init Feeds",
    description: "Set up feedclaw with curated default feeds.",
    inputSchema: z.object({
      bundle: z
        .enum(["ai", "dev", "openclaw", "news", "all"])
        .optional()
        .describe("Feed bundle (default: all)"),
      from: z.string().optional().describe("Load feeds from a custom JSON file"),
    }),
    run: async (args) => {
      const cmd = ["init"];
      if (args.bundle) cmd.push("--bundle", String(args.bundle));
      if (args.from) cmd.push("--from", String(args.from));
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
      provider: z.enum(["anthropic", "openai"]).optional().describe("AI provider"),
      model: z.string().optional().describe("Model name override"),
      format: z.enum(["terminal", "markdown", "html", "json"]).optional().describe("Output format"),
      max_articles: z.number().optional().describe("Max articles to include"),
    }),
    run: async (args) => {
      const cmd = ["digest"];
      if (args.since) cmd.push("--since", String(args.since));
      if (args.category) cmd.push("--category", String(args.category));
      if (args.provider) cmd.push("--provider", String(args.provider));
      if (args.model) cmd.push("--model", String(args.model));
      if (args.format) cmd.push("--format", String(args.format));
      if (args.max_articles) cmd.push("--max-articles", String(args.max_articles));
      return runTool(BIN, cmd);
    },
  },
  {
    name: "feedclaw_opml_import",
    title: "Import OPML",
    description: "Import feeds from an OPML file.",
    inputSchema: z.object({
      file: z.string().describe("Path to OPML file"),
    }),
    run: async (args) => runTool(BIN, ["opml-import", String(args.file)]),
  },
  {
    name: "feedclaw_opml_export",
    title: "Export OPML",
    description: "Export subscribed feeds as OPML.",
    inputSchema: z.object({}),
    run: async () => runTool(BIN, ["opml-export"]),
  },
];
