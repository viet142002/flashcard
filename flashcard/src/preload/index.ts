import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const flashcard = {
    hide: () => ipcRenderer.send('flashcard:hide'),
    move: (x: number, y: number) => ipcRenderer.send('flashcard:move', x, y),
    startResize: (direction: string) => {
        ipcRenderer.send('flashcard:start-resize', direction)
    },
    resizeWindow: (bounds: { width: number, height: number, x?: number, y?: number }) => {
        ipcRenderer.send('flashcard:resize-window', bounds);
    },
    getBounds: () => ipcRenderer.invoke('flashcard:get-bounds')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        // API RIÊNG của bạn
        contextBridge.exposeInMainWorld('flashcard', flashcard)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI

    // @ts-ignore (define in dts)
    window.flashcard = flashcard
}
