import {
    Tray,
    Menu,
    nativeImage,
    app,
    shell,
    BrowserWindow,
    ipcMain,
    globalShortcut,
} from 'electron'
import __Store from 'electron-store'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import trayIcon from '../../resources/tray.png?asset'

let isVisible = true;
let isQuitting = false
let win: BrowserWindow | null = null
let tray: Tray | null = null
const store = new (
    __Store as unknown as typeof import('electron-store')
).default()

const { x, y } = store.get('position', {
    x: 100,
    y: 100,
}) as { x: number; y: number }

function createWindow(): void {
    // Create the browser window.
    win = new BrowserWindow({
        x,
        y,
        width: 380,
        height: 250,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        resizable: true,
        skipTaskbar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            contextIsolation: false,
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
        },
    })

    win.on('ready-to-show', () => {
        win?.show()
    })

    win.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault()
            win?.hide()
        }
    })

    win.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        win.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        win.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

function createTray() {
    const icon = nativeImage.createFromPath(trayIcon)

    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show Flashcard',
            click: () => {
                win?.show()
            },
        },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true
                app.quit()
            },
        },
    ])

    tray.setToolTip('Flashcard App')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        win?.show()
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    ipcMain.on('flashcard:hide', () => {
        win?.hide()
    })
    ipcMain.on('flashcard:move', () => {
        if (!win) return
        const [x, y] = win.getPosition()
        store.set('position', { x, y })
    })
    ipcMain.on('flashcard:start-resize', () => {
        if (!win) return
        win.setResizable(true)
    })
    ipcMain.on('flashcard:resize-window', (_, { width, height, x, y }) => {
        if (win) {
            const bounds = win.getBounds()
            const bound = {
                x: x !== undefined ? x : bounds.x,
                y: y !== undefined ? y : bounds.y,
                width: Math.max(250, width),
                height: Math.max(250, height),
            }
            win.setBounds(bound, true)
        }
    })
    ipcMain.handle('flashcard:get-bounds', () => {
        if (win) {
            return win.getBounds()
        }
        return null
    })

    createWindow()
    createTray()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
            createTray()
        }
    })

    globalShortcut.register('CommandOrControl+Alt+Shift+F', () => {
        if (isVisible) {
            win?.hide()
        } else {
            win?.show()
        }
        isVisible = !isVisible
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
