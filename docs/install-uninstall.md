# GHCwin インストール / アンインストール手順（Windows）

## 前提

- 配布ファイル: `GHCwin 1.0.0.msi`
- Windows 10/11
- 管理者権限が必要な場合があります（環境ポリシーによる）

## インストール

### 方法1: GUIでインストール

1. `GHCwin 1.0.0.msi` をダブルクリック
2. インストーラーの案内に従って進める
3. 完了後、スタートメニューまたはインストール先から `GHCwin` を起動

### 方法2: コマンドラインでインストール

```powershell
msiexec /i "GHCwin 1.0.0.msi"
```

### サイレントインストール

```powershell
msiexec /i "GHCwin 1.0.0.msi" /qn
```

## アンインストール

### 方法1: Windows設定からアンインストール

1. `設定` → `アプリ` → `インストールされているアプリ`
2. `GHCwin` を選択
3. `アンインストール`

### 方法2: コマンドラインでアンインストール

製品コード（GUID）を確認してから実行します。

1. 製品コード確認:

```powershell
Get-Package -Name "GHCwin*" | Select-Object Name, FastPackageReference
```

`FastPackageReference` に表示される `{...}` が製品コード（GUID）です。

2. アンインストール実行（`{PRODUCT-CODE}` を置換）:

```powershell
msiexec /x {PRODUCT-CODE}
```

### サイレントアンインストール

```powershell
msiexec /x {PRODUCT-CODE} /qn
```

## ログ取得（トラブルシュート）

### インストールログ

```powershell
msiexec /i "GHCwin 1.0.0.msi" /L*v "install.log"
```

### アンインストールログ

```powershell
msiexec /x {PRODUCT-CODE} /L*v "uninstall.log"
```
