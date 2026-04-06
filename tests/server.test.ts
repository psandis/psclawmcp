import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { describe, expect, it } from "vitest";
import { allTools } from "../src/tools/index.js";

describe("server registration", () => {
  it("registers all tools without error", () => {
    const server = new McpServer({ name: "test", version: "0.0.0" });

    for (const tool of allTools) {
      expect(() => {
        server.registerTool(
          tool.name,
          {
            title: tool.title,
            description: tool.description,
            inputSchema: tool.inputSchema,
          },
          async (args: Record<string, unknown>) => tool.run(args),
        );
      }).not.toThrow();
    }
  });

  it("rejects duplicate tool names", () => {
    const server = new McpServer({ name: "test", version: "0.0.0" });
    const tool = allTools[0];

    server.registerTool(
      tool.name,
      { title: tool.title, description: tool.description, inputSchema: tool.inputSchema },
      async (args: Record<string, unknown>) => tool.run(args),
    );

    expect(() => {
      server.registerTool(
        tool.name,
        { title: tool.title, description: tool.description, inputSchema: tool.inputSchema },
        async (args: Record<string, unknown>) => tool.run(args),
      );
    }).toThrow();
  });
});
