const { app, Menu, MenuItem, Tray } = require('electron');
const iohook = require('@mechakeys/iohook');

const contextMenuHeader = [
  { label: 'Itens no clipboard', type: 'normal' },
  { type: 'separator' },
];

const clipboardDataMenu = [];

app.whenReady().then(() => {
  let menu = Menu.buildFromTemplate([...contextMenuHeader, ...clipboardDataMenu]);
  const tray = new Tray('./clipboards.png');

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

    menu = Menu.buildFromTemplate([...contextMenuHeader, ...clipboardDataMenu]);

    tray.setContextMenu(menu);
  };

  iohook.start();
});