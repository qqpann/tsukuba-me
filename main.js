const { app, BrowserWindow, Menu, ipcMain, Tray } = require('electron')
const path = require('path')

let tray = undefined
let win = undefined


const createTray = () => {
    tray = new Tray(path.join('assets', 'icon.png'))
    // show app name on hover
    tray.setToolTip(app.getName())
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Preferences', click () {}, accelerator: 'Cmd+,' },
        { label: 'Quit', role: 'quit', accelerator: 'Cmd+Q' },
    ])
    const popMenu = () => {
        tray.popUpContextMenu(contextMenu)
    }

    tray.on('right-click', popMenu)
    tray.on('double-click', toggleWindow)
    tray.on('click', (e) => {
        toggleWindow()
    })
}

const createWindow = () => {
    win = new BrowserWindow({
        width: 300,
        height: 450,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            // to use require() in html
            nodeIntegration: true,
            // Prevents renderer process code from not running when window is hidden
            backgroundThrottling: false
        }
    })
    win.loadFile('index.html')
    win.on('blur', () => {
        // Hide window on Blur (lose focus)
        // There is a issue: https://github.com/electron/electron/issues/6624
        // , that it blurs even when drag files into the window on MS-Windows
        if (process.platform === 'darwin') {
            win.hide()
        }
    })
}

const getWindowPosition = () => {
    const windowBounds = win.getBounds()
    const trayBounds = tray.getBounds()
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
    const y = Math.round(trayBounds.y + trayBounds.height + 4)
    return {x: x, y: y}
}

const showWindow = () => {
    const position = getWindowPosition()
    win.setPosition(position.x, position.y, false)
    win.show()
    win.focus()
}

const toggleWindow = () => {
    if (win.isVisible()) {
        win.hide()
    } else {
        showWindow()
    }
}


app.on('ready', () => {
    createTray()
    createWindow()
    win.webContents.openDevTools({mode: 'detach'})
})

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win == null) {
        createWindow()
    }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.