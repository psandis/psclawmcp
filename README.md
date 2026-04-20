# psclawmcp

[![npm](https://img.shields.io/npm/v/psclawmcp?style=flat-square)](https://www.npmjs.com/package/psclawmcp)

MCP server for the OpenClaw CLI ecosystem. Exposes [feedclaw](https://github.com/psandis/feedclaw), [dustclaw](https://github.com/psandis/dustclaw), [driftclaw](https://github.com/psandis/driftclaw), [dietclaw](https://github.com/psandis/dietclaw), and [wirewatch](https://github.com/psandis/wirewatch) as tools over the [Model Context Protocol](https://modelcontextprotocol.io), so AI assistants can use them directly.

## What It Does

- wraps existing OpenClaw CLIs as MCP tools — no library rework needed
- spawns each CLI as a subprocess with `--json` for structured output
- one MCP tool per CLI subcommand (25 tools across 5 CLIs)
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
│   ├── index.ts          # CLI entry point
│   ├── server.ts         # MCP server
│   ├── config.ts         # config persistence
│   ├── registry.ts       # available tools registry
│   ├── runner.ts         # subprocess runner
│   └── tools/
│       ├── types.ts      # ToolDef interface
│       ├── index.ts      # tool aggregator
│       ├── feedclaw.ts
│       ├── dustclaw.ts
│       ├── driftclaw.ts
│       ├── dietclaw.ts
│       └── wirewatch.ts
├── tests/
│   ├── runner.test.ts
│   ├── tools.test.ts
│   ├── server.test.ts
│   ├── feedclaw.test.ts
│   ├── dustclaw.test.ts
│   ├── driftclaw.test.ts
│   ├── dietclaw.test.ts
│   └── wirewatch.test.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── biome.json
├── LICENSE
└── README.md
```

## Requirements

- Node 22+

## Install

```bash
npm install -g psclawmcp
```

## Usage

Pick which tools to enable:

```bash
psclawmcp add feedclaw
psclawmcp add dustclaw
psclawmcp list
```

```
Available tools:

  [✓] feedclaw     RSS/Atom feeds and AI digests
  [✓] dustclaw     disk space analysis
  [ ] driftclaw    deployment version drift
  [ ] dietclaw     codebase health monitoring
```

Remove a tool:

```bash
psclawmcp remove feedclaw
```

Start the MCP server:

```bash
psclawmcp start
```

Running `psclawmcp` with no arguments starts the server if tools are enabled, or shows help if none are.

Configuration is stored at `~/.psclawmcp/config.json`.

## MCP Client Configuration

Add to your MCP client config (e.g. Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "psclawmcp": {
      "command": "psclawmcp",
      "args": ["start"]
    }
  }
}
```

## Available Tools

### feedclaw — RSS/Atom feeds and AI digests

| Tool | Description |
|------|-------------|
| `feedclaw_init` | Set up default curated feeds |
| `feedclaw_add` | Subscribe to a feed by URL |
| `feedclaw_remove` | Unsubscribe from a feed |
| `feedclaw_list` | List subscribed feeds |
| `feedclaw_fetch` | Pull new articles from feeds |
| `feedclaw_digest` | Generate AI-powered article summary |
| `feedclaw_opml_import` | Import feeds from OPML file |
| `feedclaw_opml_export` | Export feeds as OPML |

### dustclaw — disk space analysis

| Tool | Description |
|------|-------------|
| `dustclaw_overview` | Disk usage, free space, top directories |
| `dustclaw_scan` | Ranked list of largest files and folders |
| `dustclaw_wasteland` | Find known dev/OS space wasters |

### driftclaw — deployment version drift

| Tool | Description |
|------|-------------|
| `driftclaw_report` | Full version matrix across all environments |
| `driftclaw_check` | Check a single service across environments |
| `driftclaw_drift` | Show only services with version drift |

### dietclaw — codebase health monitoring

| Tool | Description |
|------|-------------|
| `dietclaw_scan` | Project health report |
| `dietclaw_deps` | Dependency analysis — outdated, unused, heavy |
| `dietclaw_trend` | Health trends over time |

### wirewatch — network traffic monitoring

| Tool | Description |
|------|-------------|
| `wirewatch_start` | Start the background capture daemon |
| `wirewatch_stop` | Stop the background capture daemon |
| `wirewatch_status` | Daemon status, uptime, and connection count |
| `wirewatch_list` | List captured connections with filters |
| `wirewatch_show` | Full details for a single connection by ID |
| `wirewatch_analyze` | Send recent connections to AI for anomaly detection |
| `wirewatch_analyses` | List past AI analyses with risk levels |
| `wirewatch_db_stats` | Database statistics |

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

## Testing

```bash
pnpm test
```

Current bar:

- 77 tests across 8 test files
- every tool's argument mapping verified against CLI flags
- runner tests use mocked child_process

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
- [wirewatch](https://github.com/psandis/wirewatch) — Network traffic monitoring and AI anomaly detection

## License

See [MIT](LICENSE)
