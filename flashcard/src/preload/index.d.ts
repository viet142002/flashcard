import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI & {
      hide: () => void
    }
    flashcard: {
      hide: () => void
      move: (x: number, y: number) => void
      startResize: (direction: string) => void
      resizeWindow: (bounds: { width: number, height: number, x?: number, y?: number }) => void
      getBounds: () => { width: number, height: number, x: number, y: number }
    },
    api: unknown
  }
}
