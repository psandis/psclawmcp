import type { ChildProcess } from "node:child_process";
import { execFile } from "node:child_process";
import { afterEach, describe, expect, it, vi } from "vitest";
import { run, runTool } from "../src/runner.js";

vi.mock("node:child_process", () => ({
  execFile: vi.fn(),
}));

const mockExecFile = vi.mocked(execFile);

type ExecFileCallback = (error: Error | null, stdout: string | null, stderr: string | null) => void;

function mockImpl(fn: (cb: ExecFileCallback) => void): (...args: unknown[]) => ChildProcess {
  return ((...args: unknown[]) => {
    const cb = args[args.length - 1] as ExecFileCallback;
    fn(cb);
    return undefined as unknown as ChildProcess;
  }) as unknown as (...args: unknown[]) => ChildProcess;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("run", () => {
  it("returns stdout, stderr, and exit code 0 on success", async () => {
    mockExecFile.mockImplementation(mockImpl((cb) => cb(null, '{"ok":true}', "")));

    const result = await run("echo", ["hello"]);
    expect(result.stdout).toBe('{"ok":true}');
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("returns exit code from error status", async () => {
    mockExecFile.mockImplementation(
      mockImpl((cb) => {
        const err = Object.assign(new Error("fail"), { status: 1 });
        cb(err, "", "command not found");
      }),
    );

    const result = await run("bad", []);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe("command not found");
  });

  it("returns exit code 1 on maxbuffer error", async () => {
    mockExecFile.mockImplementation(
      mockImpl((cb) => {
        const err = Object.assign(new Error("maxbuffer"), {
          code: "ERR_CHILD_PROCESS_STDIO_MAXBUFFER",
        });
        cb(err, "", "");
      }),
    );

    const result = await run("big", []);
    expect(result.exitCode).toBe(1);
  });

  it("defaults stdout and stderr to empty string when null", async () => {
    mockExecFile.mockImplementation(mockImpl((cb) => cb(null, null, null)));

    const result = await run("test", []);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe("");
  });
});

describe("runTool", () => {
  it("prepends --json to args", async () => {
    mockExecFile.mockImplementation(mockImpl((cb) => cb(null, '{"data":"ok"}', "")));

    await runTool("feedclaw", ["list"]);
    expect(mockExecFile).toHaveBeenCalledWith(
      "feedclaw",
      ["--json", "list"],
      expect.any(Object),
      expect.any(Function),
    );
  });

  it("returns content on success", async () => {
    mockExecFile.mockImplementation(mockImpl((cb) => cb(null, '{"feeds":[]}', "")));

    const result = await runTool("feedclaw", ["list"]);
    expect(result.isError).toBeUndefined();
    expect(result.content).toEqual([{ type: "text", text: '{"feeds":[]}' }]);
  });

  it("returns isError on non-zero exit", async () => {
    mockExecFile.mockImplementation(
      mockImpl((cb) => {
        const err = Object.assign(new Error("fail"), { status: 1 });
        cb(err, "", "No such command");
      }),
    );

    const result = await runTool("feedclaw", ["bad"]);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("No such command");
  });

  it("falls back to stdout when stderr is empty on error", async () => {
    mockExecFile.mockImplementation(
      mockImpl((cb) => {
        const err = Object.assign(new Error("fail"), { status: 1 });
        cb(err, "some output", "");
      }),
    );

    const result = await runTool("feedclaw", ["bad"]);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("some output");
  });

  it("falls back to generic message when both streams empty on error", async () => {
    mockExecFile.mockImplementation(
      mockImpl((cb) => {
        const err = Object.assign(new Error("fail"), { status: 2 });
        cb(err, "", "");
      }),
    );

    const result = await runTool("feedclaw", ["bad"]);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("feedclaw exited with code 2");
  });
});
