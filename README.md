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

## Node.js 22 への更新手順（Windows）

### 1) いまのバージョン確認

```bash
node -v
```

`v22.x.x` 以上なら更新不要です。

### 2) winget で更新（推奨）

```powershell
winget upgrade OpenJS.NodeJS
```

未インストールの場合は:

```powershell
winget install OpenJS.NodeJS
```

### 3) nvm-windows を使う場合

```powershell
nvm install 22
nvm use 22
```

### 4) 再確認

```bash
node -v
npm -v
```

その後、プロジェクトで以下を実行:

```bash
npm install
npm run chat
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