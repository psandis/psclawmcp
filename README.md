# psclawmcp

MCP server for the OpenClaw CLI ecosystem. Exposes [feedclaw](https://github.com/psandis/feedclaw), [dustclaw](https://github.com/psandis/dustclaw), [driftclaw](https://github.com/psandis/driftclaw), and [dietclaw](https://github.com/psandis/dietclaw) as tools over the [Model Context Protocol](https://modelcontextprotocol.io), so AI assistants can use them directly.

## What It Does

- wraps existing OpenClaw CLIs as MCP tools — no library rework needed
- spawns each CLI as a subprocess with `--json` for structured output
- one MCP tool per CLI subcommand (13 tools across 4 CLIs)
- auto-discovers tool definitions — add a new CLI by dropping a file in `src/tools/`
- communicates over stdio transport

## Architecture

```
AI Client (Claude, etc.)
    │
    │  MCP (JSON-RPC over stdio)
    │
┌───▼──────────────┐
│   psclawmcp       │
│                   │
│  ┌─────────────┐  │
│  │  MCP Server  │  │   registers tools from src/tools/*.ts
│  └──────┬──────┘  │
│         │         │
│  ┌──────▼──────┐  │
│  │   runner.ts  │  │   spawns CLI subprocess with --json
│  └──────┬──────┘  │
└─────────┼─────────┘
          │
    ┌─────▼─────┐
    │  CLI tools │   feedclaw, dustclaw, driftclaw, dietclaw
    └───────────┘
```

Each tool file in `src/tools/` exports an array of `ToolDef` objects. The server loads them all at startup and registers them with the MCP SDK. When a tool is called, the runner spawns the corresponding CLI binary, passes `--json` plus any arguments, and returns the structured output to the client.

## File Structure

```
psclawmcp/
├── src/
│   ├── index.ts              # MCP server entry point, auto-registers tools
│   ├── runner.ts             # generic subprocess runner (--json, timeout, error handling)
│   └── tools/
│       ├── types.ts          # ToolDef interface
│       ├── index.ts          # aggregates all tool files
│       ├── feedclaw.ts       # feedclaw_list, feedclaw_fetch, feedclaw_digest, feedclaw_add, feedclaw_remove
│       ├── dustclaw.ts       # dustclaw_overview, dustclaw_scan, dustclaw_wasteland
│       ├── driftclaw.ts      # driftclaw_check, driftclaw_drift
│       └── dietclaw.ts       # dietclaw_scan, dietclaw_deps, dietclaw_trend
├── tests/
├── package.json
├── tsconfig.json
├── biome.json
├── LICENSE
└── README.md
```

## Requirements

- Node 22+
- pnpm
- The claw CLIs you want to use must be installed and on your PATH:
  - `npm install -g feedclaw` — RSS/Atom feeds and AI digests
  - `npm install -g dustclaw` — disk space analysis
  - `npm install -g driftclaw` — deployment version drift
  - `npm install -g dietclaw` — codebase health monitoring

## Install

```bash
git clone https://github.com/psandis/psclawmcp.git
cd psclawmcp
pnpm install
pnpm build
```

## Configuration

Add to your MCP client config (e.g. Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "psclawmcp": {
      "command": "node",
      "args": ["/path/to/psclawmcp/dist/index.js"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "psclawmcp": {
      "command": "psclawmcp"
    }
  }
}
```

## Available Tools

| Tool | CLI | Description |
|------|-----|-------------|
| `feedclaw_list` | feedclaw | List subscribed feeds |
| `feedclaw_fetch` | feedclaw | Fetch new articles |
| `feedclaw_digest` | feedclaw | Generate AI digest |
| `feedclaw_add` | feedclaw | Subscribe to a feed |
| `feedclaw_remove` | feedclaw | Unsubscribe from a feed |
| `dustclaw_overview` | dustclaw | Disk usage overview |
| `dustclaw_scan` | dustclaw | Deep scan for large files |
| `dustclaw_wasteland` | dustclaw | Find dev/OS space wasters |
| `driftclaw_check` | driftclaw | Check service version across environments |
| `driftclaw_drift` | driftclaw | Show services with version drift |
| `dietclaw_scan` | dietclaw | Project health report |
| `dietclaw_deps` | dietclaw | Dependency analysis |
| `dietclaw_trend` | dietclaw | Health trends over time |

## Adding a New Tool

Create a new file in `src/tools/`, for example `src/tools/newclaw.ts`:

```typescript
import { z } from "zod";
import { runTool } from "../runner.js";
import type { ToolDef } from "./types.js";

const BIN = "newclaw";

export const tools: ToolDef[] = [
  {
    name: "newclaw_scan",
    title: "Scan Something",
    description: "What this tool does.",
    inputSchema: z.object({
      path: z.string().optional().describe("Target path"),
    }),
    run: async (args) => {
      const cmd = ["scan"];
      if (args.path) cmd.push(String(args.path));
      return runTool(BIN, cmd);
    },
  },
];
```

Then add the import to `src/tools/index.ts`:

```typescript
import { tools as newclawTools } from "./newclaw.js";

export const allTools: ToolDef[] = [
  ...feedclawTools,
  ...dustclawTools,
  ...driftclawTools,
  ...dietclawTools,
  ...newclawTools,
];
```

## Development

```bash
pnpm install
pnpm build
pnpm dev        # run with tsx
pnpm lint
pnpm test
```

## Related

- [feedclaw](https://github.com/psandis/feedclaw) — RSS/Atom feed reader and AI digest builder
- [dustclaw](https://github.com/psandis/dustclaw) — Disk space analysis
- [driftclaw](https://github.com/psandis/driftclaw) — Deployment version drift detection
- [dietclaw](https://github.com/psandis/dietclaw) — Codebase health monitoring

## License

See [MIT](LICENSE)
