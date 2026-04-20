import { describe, expect, it } from "vitest";
import { allTools } from "../src/tools/index.js";

describe("tool definitions", () => {
  it("exports 25 tools total", () => {
    expect(allTools).toHaveLength(25);
  });

  it("every tool has required fields", () => {
    for (const tool of allTools) {
      expect(tool.name, `${tool.name} missing name`).toBeTruthy();
      expect(tool.title, `${tool.name} missing title`).toBeTruthy();
      expect(tool.description, `${tool.name} missing description`).toBeTruthy();
      expect(tool.inputSchema, `${tool.name} missing inputSchema`).toBeDefined();
      expect(typeof tool.run, `${tool.name} run is not a function`).toBe("function");
    }
  });

  it("all tool names are unique", () => {
    const names = allTools.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("all tool names are prefixed with CLI name", () => {
    for (const tool of allTools) {
      expect(tool.name).toMatch(/^(feedclaw|dustclaw|driftclaw|dietclaw|wirewatch)_/);
    }
  });

  it("includes tools from all 5 CLIs", () => {
    const prefixes = new Set(allTools.map((t) => t.name.split("_")[0]));
    expect(prefixes).toEqual(
      new Set(["feedclaw", "dustclaw", "driftclaw", "dietclaw", "wirewatch"]),
    );
  });
});

describe("feedclaw tools", () => {
  const feedTools = allTools.filter((t) => t.name.startsWith("feedclaw_"));

  it("has 8 tools", () => {
    expect(feedTools).toHaveLength(8);
  });

  it("includes all commands", () => {
    const names = feedTools.map((t) => t.name);
    expect(names).toContain("feedclaw_init");
    expect(names).toContain("feedclaw_add");
    expect(names).toContain("feedclaw_remove");
    expect(names).toContain("feedclaw_list");
    expect(names).toContain("feedclaw_fetch");
    expect(names).toContain("feedclaw_digest");
    expect(names).toContain("feedclaw_opml_import");
    expect(names).toContain("feedclaw_opml_export");
  });
});

describe("dustclaw tools", () => {
  const dustTools = allTools.filter((t) => t.name.startsWith("dustclaw_"));

  it("has 3 tools", () => {
    expect(dustTools).toHaveLength(3);
  });

  it("includes overview, scan, wasteland", () => {
    const names = dustTools.map((t) => t.name);
    expect(names).toContain("dustclaw_overview");
    expect(names).toContain("dustclaw_scan");
    expect(names).toContain("dustclaw_wasteland");
  });
});

describe("driftclaw tools", () => {
  const driftTools = allTools.filter((t) => t.name.startsWith("driftclaw_"));

  it("has 3 tools", () => {
    expect(driftTools).toHaveLength(3);
  });

  it("includes report, check, drift", () => {
    const names = driftTools.map((t) => t.name);
    expect(names).toContain("driftclaw_report");
    expect(names).toContain("driftclaw_check");
    expect(names).toContain("driftclaw_drift");
  });
});

describe("dietclaw tools", () => {
  const dietTools = allTools.filter((t) => t.name.startsWith("dietclaw_"));

  it("has 3 tools", () => {
    expect(dietTools).toHaveLength(3);
  });

  it("includes scan, deps, trend", () => {
    const names = dietTools.map((t) => t.name);
    expect(names).toContain("dietclaw_scan");
    expect(names).toContain("dietclaw_deps");
    expect(names).toContain("dietclaw_trend");
  });
});

describe("wirewatch tools", () => {
  const wwTools = allTools.filter((t) => t.name.startsWith("wirewatch_"));

  it("has 8 tools", () => {
    expect(wwTools).toHaveLength(8);
  });

  it("includes all commands", () => {
    const names = wwTools.map((t) => t.name);
    expect(names).toContain("wirewatch_start");
    expect(names).toContain("wirewatch_stop");
    expect(names).toContain("wirewatch_status");
    expect(names).toContain("wirewatch_list");
    expect(names).toContain("wirewatch_show");
    expect(names).toContain("wirewatch_analyze");
    expect(names).toContain("wirewatch_analyses");
    expect(names).toContain("wirewatch_db_stats");
  });
});
