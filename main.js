const { app, Menu, MenuItem, Tray, globalShortcut, clipboard, ipcMain, BrowserWindow } = require('electron');
const iohook = require('@mechakeys/iohook');

app.whenReady().then(() => {
  const tray = new Tray('./img.png');
  const contextMenuHeader = [
    { label: 'Itens no clipboard', type: 'normal' },
    { type: 'separator' },
  ];

  const clipboardDataMenu = [];

  tray.setToolTip('This is my application.');
  tray.setContextMenu(Menu.buildFromTemplate([...contextMenuHeader, ...clipboardDataMenu]));

  function updateClipboard() {
    if (clipboardDataMenu.length >= 5) clipboardDataMenu.shift();
    clipboardDataMenu.push({ label: clipboard.readText('clipboard'), type: 'normal' });
    tray.setContextMenu(Menu.buildFromTemplate([...contextMenuHeader, ...clipboardDataMenu]));
  }

  iohook.on("keydown", (key) => {
    const cKeycode = 46;

    if (key.keycode == cKeycode && key.ctrlKey) {
      setTimeout(updateClipboard, 200);
    }
  });

  iohook.start();
});