const { app, Menu, MenuItem, Tray, nativeImage, clipboard } = require('electron');
const path = require('path');
const iohook = require('@mechakeys/iohook');

const contextMenuHeader = [
  { label: 'Itens no clipboard', type: 'normal' },
  { type: 'separator' },
];

const clipboardDataMenu = [];

const contextMenuFooter = [
  { type: 'separator' },
  { label: 'Quit', type: 'normal', click: () => {
    app.quit();
  } },
];

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath(path.join(__dirname, "clipboards.png"));
  let menu = Menu.buildFromTemplate([...contextMenuHeader, ...clipboardDataMenu, ...contextMenuFooter]);
  const tray = new Tray(icon);

  tray.setToolTip('This is my application.');
  tray.setContextMenu(menu);

  iohook.on("keyup", (key) => {
    const cKeycode = 46;

    if (key.keycode == cKeycode && key.ctrlKey) {
      updateClipboard()
    }
  });

  function retrieveClipboarContent(info) {
    clipboard.writeText(info, 'clipboard');
  }

  function updateClipboard() {
    if (clipboardDataMenu.length >= 5) clipboardDataMenu.shift();
    const clipboardData = clipboard.readText('clipboard');
    clipboardDataMenu.push(new MenuItem({
      label: clipboardData,
      type: 'normal',
      click: () => {
        retrieveClipboarContent(clipboardData);
      },
    }));

    menu = Menu.buildFromTemplate([...contextMenuHeader, ...clipboardDataMenu, ...contextMenuFooter]);

    console.log(clipboardDataMenu);

    tray.setContextMenu(menu);
  };

  iohook.start();
});