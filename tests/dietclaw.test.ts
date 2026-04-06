import { afterEach, describe, expect, it, vi } from "vitest";
import { tools } from "../src/tools/dietclaw.js";

vi.mock("../src/runner.js", () => ({
  runTool: vi.fn(async () => ({ content: [{ type: "text", text: "{}" }] })),
}));

import { runTool } from "../src/runner.js";
const mockRunTool = vi.mocked(runTool);

afterEach(() => vi.clearAllMocks());

function find(name: string) {
  const tool = tools.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool ${name} not found`);
  return tool;
}

describe("dietclaw_scan", () => {
  it("passes scan with no args", async () => {
    await find("dietclaw_scan").run({});
    expect(mockRunTool).toHaveBeenCalledWith("dietclaw", ["scan"]);
  });

  it("passes path as positional arg", async () => {
    await find("dietclaw_scan").run({ path: "~/Projects/myapp" });
    expect(mockRunTool).toHaveBeenCalledWith("dietclaw", ["scan", "~/Projects/myapp"]);
  });

  it("passes --limit, --each, --save", async () => {
    await find("dietclaw_scan").run({ path: ".", limit: 5, each: true, save: true });
    expect(mockRunTool).toHaveBeenCalledWith("dietclaw", [
      "scan",
      ".",
      "--limit",
      "5",
      "--each",
      "--save",
    ]);
  });
});

describe("dietclaw_deps", () => {
  it("passes deps with no args", async () => {
    await find("dietclaw_deps").run({});
    expect(mockRunTool).toHaveBeenCalledWith("dietclaw", ["deps"]);
  });

  it("passes path and --limit", async () => {
    await find("dietclaw_deps").run({ path: "/tmp/project", limit: 10 });
    expect(mockRunTool).toHaveBeenCalledWith("dietclaw", ["deps", "/tmp/project", "--limit", "10"]);
  });
});

describe("dietclaw_trend", () => {
  it("passes trend with no args", async () => {
    await find("dietclaw_trend").run({});
    expect(mockRunTool).toHaveBeenCalledWith("dietclaw", ["trend"]);
  });

  it("passes path and --limit", async () => {
    await find("dietclaw_trend").run({ path: ".", limit: 5 });
    expect(mockRunTool).toHaveBeenCalledWith("dietclaw", ["trend", ".", "--limit", "5"]);
  });
});
