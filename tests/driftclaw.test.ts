import { afterEach, describe, expect, it, vi } from "vitest";
import { tools } from "../src/tools/driftclaw.js";

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

describe("driftclaw_report", () => {
  it("passes no subcommand with no args", async () => {
    await find("driftclaw_report").run({});
    expect(mockRunTool).toHaveBeenCalledWith("driftclaw", []);
  });

  it("passes --config", async () => {
    await find("driftclaw_report").run({ config: "/path/driftclaw.yaml" });
    expect(mockRunTool).toHaveBeenCalledWith("driftclaw", ["--config", "/path/driftclaw.yaml"]);
  });

  it("passes --fail-on-drift", async () => {
    await find("driftclaw_report").run({ fail_on_drift: true });
    expect(mockRunTool).toHaveBeenCalledWith("driftclaw", ["--fail-on-drift"]);
  });

  it("passes both --config and --fail-on-drift", async () => {
    await find("driftclaw_report").run({ config: "drift.yaml", fail_on_drift: true });
    expect(mockRunTool).toHaveBeenCalledWith("driftclaw", [
      "--config",
      "drift.yaml",
      "--fail-on-drift",
    ]);
  });
});

describe("driftclaw_check", () => {
  it("passes service as positional arg", async () => {
    await find("driftclaw_check").run({ service: "auth-api" });
    expect(mockRunTool).toHaveBeenCalledWith("driftclaw", ["check", "auth-api"]);
  });

  it("passes --config", async () => {
    await find("driftclaw_check").run({ service: "auth-api", config: "drift.yaml" });
    expect(mockRunTool).toHaveBeenCalledWith("driftclaw", [
      "check",
      "auth-api",
      "--config",
      "drift.yaml",
    ]);
  });
});

describe("driftclaw_drift", () => {
  it("passes drift with no args", async () => {
    await find("driftclaw_drift").run({});
    expect(mockRunTool).toHaveBeenCalledWith("driftclaw", ["drift"]);
  });

  it("passes --config", async () => {
    await find("driftclaw_drift").run({ config: "drift.yaml" });
    expect(mockRunTool).toHaveBeenCalledWith("driftclaw", ["drift", "--config", "drift.yaml"]);
  });
});
