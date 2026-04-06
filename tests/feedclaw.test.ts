import { afterEach, describe, expect, it, vi } from "vitest";
import { tools } from "../src/tools/feedclaw.js";

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

describe("feedclaw_init", () => {
  it("passes init with no args", async () => {
    await find("feedclaw_init").run({});
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["init"]);
  });

  it("passes --bundle and --from", async () => {
    await find("feedclaw_init").run({ bundle: "ai", from: "/path/feeds.json" });
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", [
      "init",
      "--bundle",
      "ai",
      "--from",
      "/path/feeds.json",
    ]);
  });
});

describe("feedclaw_add", () => {
  it("passes url as positional arg", async () => {
    await find("feedclaw_add").run({ url: "https://example.com/feed.xml" });
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["add", "https://example.com/feed.xml"]);
  });

  it("passes --category", async () => {
    await find("feedclaw_add").run({ url: "https://example.com/feed.xml", category: "dev" });
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", [
      "add",
      "https://example.com/feed.xml",
      "--category",
      "dev",
    ]);
  });
});

describe("feedclaw_remove", () => {
  it("passes target as positional arg", async () => {
    await find("feedclaw_remove").run({ target: "3" });
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["remove", "3"]);
  });
});

describe("feedclaw_list", () => {
  it("passes list with no args", async () => {
    await find("feedclaw_list").run({});
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["list"]);
  });

  it("passes --category", async () => {
    await find("feedclaw_list").run({ category: "ai" });
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["list", "--category", "ai"]);
  });
});

describe("feedclaw_fetch", () => {
  it("passes fetch with no args", async () => {
    await find("feedclaw_fetch").run({});
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["fetch"]);
  });

  it("passes --feed", async () => {
    await find("feedclaw_fetch").run({ feed: "5" });
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["fetch", "--feed", "5"]);
  });
});

describe("feedclaw_digest", () => {
  it("passes digest with no args", async () => {
    await find("feedclaw_digest").run({});
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["digest"]);
  });

  it("passes all flags", async () => {
    await find("feedclaw_digest").run({
      since: "7d",
      category: "ai",
      provider: "anthropic",
      model: "claude-haiku-4-5-20251001",
      format: "html",
      max_articles: 20,
    });
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", [
      "digest",
      "--since",
      "7d",
      "--category",
      "ai",
      "--provider",
      "anthropic",
      "--model",
      "claude-haiku-4-5-20251001",
      "--format",
      "html",
      "--max-articles",
      "20",
    ]);
  });
});

describe("feedclaw_opml_import", () => {
  it("passes file as positional arg", async () => {
    await find("feedclaw_opml_import").run({ file: "/tmp/feeds.opml" });
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["opml-import", "/tmp/feeds.opml"]);
  });
});

describe("feedclaw_opml_export", () => {
  it("passes opml-export with no args", async () => {
    await find("feedclaw_opml_export").run({});
    expect(mockRunTool).toHaveBeenCalledWith("feedclaw", ["opml-export"]);
  });
});
