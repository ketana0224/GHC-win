- windowsターミナルではなく、GUIアプリを作る
- GUIアプリはWebブラウザではなく、windowsネイティブアプリ
- ブラウザではなく、windowsにinstallするネイティブアプリ
- InstallerはMSIで作る

補足:
- MSIビルドは `npm run dist:win` で実行する
- `proxyconnect tcp: dial tcp :0` が出る環境では、`NO_PROXY=*` と `HTTP_PROXY/HTTPS_PROXY/ALL_PROXY` の空設定を適用してからビルドする