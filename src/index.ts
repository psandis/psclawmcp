#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { allTools } from "./tools/index.js";

const server = new McpServer({
  name: "psclawmcp",
  version: "0.1.0",
});

for (const tool of allTools) {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    },
    async (args: Record<string, unknown>) => tool.run(args),
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`psclawmcp running — ${allTools.length} tools registered`);
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});
