import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import pkg from "../package.json";
import { loadConfig } from "./config.js";
import { allTools } from "./tools/index.js";

const { version } = pkg;

export async function startServer() {
  const config = loadConfig();
  const enabledTools = allTools.filter((t) => config.tools.includes(t.name.split("_")[0]));

  if (enabledTools.length === 0) {
    console.error("No tools enabled. Run: psclawmcp add <tool>");
    process.exit(1);
  }

  const server = new McpServer({
    name: "psclawmcp",
    version,
  });

  for (const tool of enabledTools) {
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

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`psclawmcp running — ${enabledTools.length} tools registered`);
}
