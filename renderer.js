const selectFolderBtn = document.getElementById("select-folder");
const convertBtn = document.getElementById("convert");
const folderPathDisplay = document.getElementById("folder-path");
const statusDisplay = document.getElementById("status");

let selectedFolder = "";

selectFolderBtn.addEventListener("click", async () => {
  const folderPath = await window.electronAPI.selectFolder();
  if (folderPath) {
    selectedFolder = folderPath;
    folderPathDisplay.textContent = `Đã chọn: ${folderPath}`;
    convertBtn.disabled = false;
  }
});

convertBtn.addEventListener("click", async () => {
  statusDisplay.textContent = "Đang chuyển đổi...";
  const result = await window.electronAPI.convertFiles(selectedFolder);
  statusDisplay.textContent = result;
});
