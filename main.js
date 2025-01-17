const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // nodeIntegration: true,
      // contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("select-folder", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return canceled ? null : filePaths[0];
});

ipcMain.handle("convert-files", async (_, folderPath) => {
  const { exec } = require("child_process");
  const path = require("path");
  const fs = require("fs");

  const files = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of files) {
    const inputPath = path.join(folderPath, file);
    const outputPath = path.join(folderPath, `${path.parse(file).name}.mp4`);

    // Dùng lệnh ffmpeg với -c copy để chuyển đổi nhanh
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${inputPath}" -c copy "${outputPath}"`, (error) => {
        if (error) {
          console.error(`Lỗi: ${error}`);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  return "Chuyển đổi nhanh chóng hoàn tất!";
});
