import { spawn } from "node:child_process";
import { REPO_ROOT } from "./config.js";

// eslint-disable-next-line no-control-regex
const ANSI = /\x1b\[[0-9;]*m/g;
const stripAnsi = (s: string) => s.replace(ANSI, "");

export interface DevServer {
  url: string;
  stop: () => Promise<void>;
}

/**
 * Boot the apps/landing Vite dev server from the repo root, wait until it
 * announces its local URL, and hand back a stop() that tears down the whole
 * process group (npm -> vite -> esbuild).
 */
export async function startLandingDevServer(timeoutMs = 60_000): Promise<DevServer> {
  const child = spawn("npm", ["run", "dev:landing", "--silent"], {
    cwd: REPO_ROOT,
    detached: true, // own process group, so we can kill the whole tree
    env: { ...process.env, FORCE_COLOR: "0", BROWSER: "none" },
  });

  const url = await new Promise<string>((resolveUrl, rejectUrl) => {
    const timer = setTimeout(
      () => rejectUrl(new Error("dev server did not announce a URL within timeout")),
      timeoutMs,
    );
    // Vite prints its banner with ANSI color codes even when piped, which split
    // up "Local:" and the URL — strip them, and buffer across chunks.
    let buf = "";
    const onData = (chunk: Buffer) => {
      buf += stripAnsi(chunk.toString());
      const m = buf.match(/Local:\s*(https?:\/\/\S+)/i);
      if (m) {
        clearTimeout(timer);
        child.stdout?.off("data", onData);
        child.stderr?.off("data", onData);
        resolveUrl(m[1].replace(/\/+$/, "").trim());
      }
    };
    child.stdout?.on("data", onData);
    child.stderr?.on("data", onData);
    child.on("exit", (code) => {
      clearTimeout(timer);
      rejectUrl(new Error(`dev server exited early (code ${code})`));
    });
  });

  const stop = () =>
    new Promise<void>((res) => {
      if (child.pid) {
        try {
          process.kill(-child.pid, "SIGTERM"); // kill the group
        } catch {
          try {
            child.kill("SIGTERM");
          } catch {
            /* already gone */
          }
        }
      }
      res();
    });

  return { url, stop };
}
