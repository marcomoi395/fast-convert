const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  convertFiles: (folderPath) => ipcRenderer.invoke("convert-files", folderPath),
});
