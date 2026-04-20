import { afterEach, describe, expect, it, vi } from "vitest";
import { tools } from "../src/tools/wirewatch.js";

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

describe("wirewatch_start", () => {
  it("calls ww start", async () => {
    await find("wirewatch_start").run({});
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["start"]);
  });
});

describe("wirewatch_stop", () => {
  it("calls ww stop", async () => {
    await find("wirewatch_stop").run({});
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["stop"]);
  });
});

describe("wirewatch_status", () => {
  it("calls ww status", async () => {
    await find("wirewatch_status").run({});
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["status"]);
  });
});

describe("wirewatch_list", () => {
  it("calls ww list with no args", async () => {
    await find("wirewatch_list").run({});
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["list"]);
  });

  it("passes --limit", async () => {
    await find("wirewatch_list").run({ limit: 50 });
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["list", "--limit", "50"]);
  });

  it("passes --protocol", async () => {
    await find("wirewatch_list").run({ protocol: "tcp" });
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["list", "--protocol", "tcp"]);
  });

  it("passes --dst", async () => {
    await find("wirewatch_list").run({ dst: "1.2.3.4" });
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["list", "--dst", "1.2.3.4"]);
  });

  it("passes --direction", async () => {
    await find("wirewatch_list").run({ direction: "outbound" });
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["list", "--direction", "outbound"]);
  });

  it("passes --process", async () => {
    await find("wirewatch_list").run({ process: "curl" });
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["list", "--process", "curl"]);
  });

  it("passes --since", async () => {
    await find("wirewatch_list").run({ since: 1700000000000 });
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["list", "--since", "1700000000000"]);
  });
});

describe("wirewatch_show", () => {
  it("passes id as positional arg", async () => {
    await find("wirewatch_show").run({ id: 42 });
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["show", "42"]);
  });
});

describe("wirewatch_analyze", () => {
  it("calls ww analyze", async () => {
    await find("wirewatch_analyze").run({});
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["analyze"]);
  });
});

describe("wirewatch_analyses", () => {
  it("calls ww analyses with no args", async () => {
    await find("wirewatch_analyses").run({});
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["analyses"]);
  });

  it("passes --limit", async () => {
    await find("wirewatch_analyses").run({ limit: 5 });
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["analyses", "--limit", "5"]);
  });
});

describe("wirewatch_db_stats", () => {
  it("calls ww db stats", async () => {
    await find("wirewatch_db_stats").run({});
    expect(mockRunTool).toHaveBeenCalledWith("ww", ["db", "stats"]);
  });
});
