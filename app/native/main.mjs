import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { CopilotClient } from "@github/copilot-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let client;
let session;

function resolveCopilotClientOptions() {
  const copilotLoader = join(process.cwd(), "node_modules", "@github", "copilot", "npm-loader.js");
  const windowsNode = "C:\\Program Files\\nodejs\\node.exe";

  if (process.platform === "win32" && existsSync(windowsNode) && existsSync(copilotLoader)) {
    return {
      cliPath: windowsNode,
      cliArgs: [copilotLoader],
      cwd: process.cwd(),
      logLevel: "error",
    };
  }

  return { logLevel: "error" };
}

function ensureSupportedNodeVersion() {
  const major = Number(process.versions.node.split(".")[0]);
  if (!Number.isFinite(major) || major < 22) {
    throw new Error(`Node.js 22 以上が必要です。現在のバージョン: ${process.versions.node}`);
  }
}

function getAssistantText(responseEvent) {
  if (!responseEvent || !responseEvent.data) {
    return "(応答を取得できませんでした)";
  }

  const data = responseEvent.data;
  if (typeof data.content === "string" && data.content.trim().length > 0) {
    return data.content;
  }

  if (Array.isArray(data.content)) {
    const texts = data.content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item.text === "string") {
          return item.text;
        }
        return "";
      })
      .filter(Boolean);

    if (texts.length > 0) {
      return texts.join("\n");
    }
  }

  return JSON.stringify(data);
}

async function setupCopilot() {
  ensureSupportedNodeVersion();
  client = new CopilotClient(resolveCopilotClientOptions());
  await client.start();
  session = await client.createSession();
}

async function ensureSession() {
  if (session) {
    return session;
  }
  await setupCopilot();
  return session;
}

async function shutdownCopilot() {
  if (session) {
    await session.destroy().catch(() => {});
    session = undefined;
  }
  if (client) {
    await client.stop().catch(() => []);
    client = undefined;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 760,
    minWidth: 780,
    minHeight: 560,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.loadFile(join(__dirname, "index.html"));
}

ipcMain.handle("chat:send", async (_event, prompt) => {
  const input = typeof prompt === "string" ? prompt.trim() : "";
  if (!input) {
    throw new Error("prompt is required");
  }

  const activeSession = await ensureSession();
  if (!activeSession) {
    throw new Error("Copilot session is not initialized.");
  }

  const responseEvent = await activeSession.sendAndWait({ prompt: input }, 120000);
  return { answer: getAssistantText(responseEvent) };
});

app.whenReady()
  .then(async () => {
    Menu.setApplicationMenu(null);
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  })
  .catch(async (error) => {
    const message = error instanceof Error ? error.message : String(error);
    dialog.showErrorBox("GHC-win 起動エラー", message);
    await shutdownCopilot();
    app.exit(1);
  });

process.on("unhandledRejection", async (reason) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  dialog.showErrorBox("GHC-win 実行エラー", message);
  await shutdownCopilot();
  app.exit(1);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async (event) => {
  event.preventDefault();
  await shutdownCopilot();
  app.exit(0);
});
