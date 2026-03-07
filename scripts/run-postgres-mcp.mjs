import { spawn } from "node:child_process";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

function resolveDatabaseUrl() {
  loadEnvConfig(process.cwd());
  return process.env.DATABASE_URL;
}

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl) {
  console.error("DATABASE_URL is required for PostgreSQL MCP.");
  process.exit(1);
}

const child = spawn(
  "npx",
  ["-y", "@modelcontextprotocol/server-postgres", databaseUrl],
  {
    stdio: "inherit",
    env: process.env,
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
