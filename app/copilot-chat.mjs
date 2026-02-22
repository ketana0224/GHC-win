import { CopilotClient } from "@github/copilot-sdk";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

function ensureSupportedNodeVersion() {
  const major = Number(process.versions.node.split(".")[0]);
  if (!Number.isFinite(major) || major < 22) {
    throw new Error(
      `Node.js 22 以上が必要です。現在のバージョン: ${process.versions.node}`,
    );
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

async function runChat() {
  const rl = readline.createInterface({ input, output });
  const client = new CopilotClient({ logLevel: "error" });
  let session;

  try {
    ensureSupportedNodeVersion();
    await client.start();
    session = await client.createSession();

    output.write("\nGitHub Copilot 軽量チャット (Windows)\n");
    output.write("終了: /exit, ヘルプ: /help\n\n");

    while (true) {
      const prompt = (await rl.question("You > ")).trim();

      if (!prompt) {
        continue;
      }
      if (prompt === "/exit") {
        break;
      }
      if (prompt === "/help") {
        output.write("/exit で終了できます。通常のテキストを入力すると Copilot が応答します。\n");
        continue;
      }

      const response = await session.sendAndWait({ prompt }, 120000);
      output.write(`Copilot > ${getAssistantText(response)}\n\n`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "readline was closed") {
      output.write("\nチャットを終了しました。\n");
      return;
    }

    output.write("\nCopilot 接続に失敗しました。\n");
    output.write("- Node.js 22+ を利用しているか\n");
    output.write("- GitHub Copilot が利用可能なアカウントでログイン済みか\n");
    output.write("- 必要なら `copilot auth login` を実行して認証できるか\n\n");
    output.write(`詳細: ${error instanceof Error ? error.message : String(error)}\n`);
  } finally {
    rl.close();
    if (session) {
      await session.destroy().catch(() => {});
    }
    await client.stop().catch(() => []);
  }
}

runChat();
