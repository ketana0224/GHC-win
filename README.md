# GHC-win

Windows向けの軽量チャットアプリです。GitHub Copilot SDK を使って、ターミナル上で Copilot と対話できます。

## 目的

- Windowsアプリ（軽量チャット）の実装
- GitHub Copilot SDK の利用

## セットアップ

1. Node.js 22 以上をインストール
2. 依存関係をインストール

```bash
npm install
```

3. 必要に応じて Copilot 認証

```bash
copilot auth login
```

## 使い方

### チャットを起動

```bash
npm run chat
```

または Windows では `run.bat` をダブルクリック。

### チャット操作

- 通常のテキスト入力: Copilot へ送信
- `/help`: ヘルプ表示
- `/exit`: 終了

## ファイル構成

- `app/copilot-chat.mjs`: Copilot SDK を使った軽量チャット本体
- `docs/spec-01.md`: 要件
- `run.bat`: Windows向け起動スクリプト