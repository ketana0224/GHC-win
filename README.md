# GHC-win

Windows向けの軽量ネイティブチャットアプリです。GitHub Copilot SDK を使って、ブラウザ不要で Copilot と対話できます。

## 目的

- Windowsネイティブアプリ（インストール可能）の実装
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
npm run native
```

## 使い方

### チャットを起動

```bash
npm run native
```

または Windows では `run.bat` をダブルクリック。

### Windowsインストーラー作成

```bash
npm run dist:win
```

MSIインストーラーを生成します。生成物は `dist` フォルダに出力されます。

PowerShell で `proxyconnect tcp: dial tcp :0` が出る環境では、次を実行してからビルドしてください:

```powershell
$env:NO_PROXY='*'
$env:no_proxy='*'
$env:HTTP_PROXY=''
$env:HTTPS_PROXY=''
$env:ALL_PROXY=''
$env:http_proxy=''
$env:https_proxy=''
$env:all_proxy=''
npm run dist:win
```

### MSIビルドでネットワークエラーが出る場合

`proxyconnect tcp: dial tcp :0` が出る場合は、環境のプロキシ設定が不正です。

確認コマンド:

```powershell
Get-ChildItem Env:*proxy*
npm config get proxy
npm config get https-proxy
```

必要なダウンロード先（許可対象）:

- `https://github.com/electron/electron/releases/...`
- `https://github.com/electron-userland/electron-builder-binaries/releases/...`

### チャット操作

- テキスト入力して「送信」
- `Ctrl+Enter` でも送信
- 「クリア」で表示をリセット

## ファイル構成

- `app/native/main.mjs`: Electronメインプロセス（Copilot SDK連携）
- `app/native/preload.cjs`: IPCブリッジ
- `app/native/index.html`: ネイティブ画面
- `docs/install-uninstall.md`: インストール/アンインストール手順
- `docs/spec-01.md`: 要件
- `docs/spec-02.md`: GUI要件
- `run.bat`: Windows向け起動スクリプト