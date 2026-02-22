import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("nativeApi", {
  sendMessage: async (prompt) => {
    return ipcRenderer.invoke("chat:send", prompt);
  },
});
