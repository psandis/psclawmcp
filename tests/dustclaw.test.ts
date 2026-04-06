import { afterEach, describe, expect, it, vi } from "vitest";
import { tools } from "../src/tools/dustclaw.js";

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

describe("dustclaw_overview", () => {
  it("passes overview with no args", async () => {
    await find("dustclaw_overview").run({});
    expect(mockRunTool).toHaveBeenCalledWith("dustclaw", ["overview"]);
  });

  it("passes --path and --top", async () => {
    await find("dustclaw_overview").run({ path: "~/Projects", top: 20 });
    expect(mockRunTool).toHaveBeenCalledWith("dustclaw", [
      "overview",
      "--path",
      "~/Projects",
      "--top",
      "20",
    ]);
  });
});

describe("dustclaw_scan", () => {
  it("passes scan with no args", async () => {
    await find("dustclaw_scan").run({});
    expect(mockRunTool).toHaveBeenCalledWith("dustclaw", ["scan"]);
  });

  it("passes path as positional arg", async () => {
    await find("dustclaw_scan").run({ path: "~/Projects" });
    expect(mockRunTool).toHaveBeenCalledWith("dustclaw", ["scan", "~/Projects"]);
  });

  it("passes all flags", async () => {
    await find("dustclaw_scan").run({
      path: "/tmp",
      top: 30,
      depth: 5,
      older_than: "30d",
      files_only: true,
    });
    expect(mockRunTool).toHaveBeenCalledWith("dustclaw", [
      "scan",
      "/tmp",
      "--top",
      "30",
      "--depth",
      "5",
      "--older-than",
      "30d",
      "--files-only",
    ]);
  });

  it("passes --dirs-only", async () => {
    await find("dustclaw_scan").run({ dirs_only: true });
    expect(mockRunTool).toHaveBeenCalledWith("dustclaw", ["scan", "--dirs-only"]);
  });
});

describe("dustclaw_wasteland", () => {
  it("passes wasteland with no args", async () => {
    await find("dustclaw_wasteland").run({});
    expect(mockRunTool).toHaveBeenCalledWith("dustclaw", ["wasteland"]);
  });

  it("passes --node-modules", async () => {
    await find("dustclaw_wasteland").run({ node_modules: "~/Projects" });
    expect(mockRunTool).toHaveBeenCalledWith("dustclaw", [
      "wasteland",
      "--node-modules",
      "~/Projects",
    ]);
  });
});
