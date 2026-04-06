import { execFile, execFileSync } from "node:child_process";

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function run(command: string, args: string[]): Promise<RunResult> {
  return new Promise((resolve) => {
    execFile(command, args, { timeout: 60_000 }, (error, stdout, stderr) => {
      resolve({
        stdout: stdout ?? "",
        stderr: stderr ?? "",
        exitCode:
          error?.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER"
            ? 1
            : ((error as NodeJS.ErrnoException & { status?: number })?.status ?? 0),
      });
    });
  });
}

export async function runTool(
  bin: string,
  args: string[],
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  const result = await run(bin, ["--json", ...args]);

  if (result.exitCode !== 0) {
    const message =
      result.stderr.trim() || result.stdout.trim() || `${bin} exited with code ${result.exitCode}`;
    return { content: [{ type: "text", text: message }], isError: true };
  }

  return { content: [{ type: "text", text: result.stdout.trim() }] };
}
