declare module 'vue-toastification' {
  import { Plugin } from 'vue'

  export interface PluginOptions {
    position?: string
    timeout?: number
    closeOnClick?: boolean
    pauseOnFocusLoss?: boolean
    pauseOnHover?: boolean
    draggable?: boolean
    draggablePercent?: number
    showCloseButtonOnHover?: boolean
    hideProgressBar?: boolean
    closeButton?: string
    icon?: boolean
    rtl?: boolean
  }

  export const POSITION: {
    TOP_LEFT: string
    TOP_CENTER: string
    TOP_RIGHT: string
    BOTTOM_LEFT: string
    BOTTOM_CENTER: string
    BOTTOM_RIGHT: string
  }

  export interface ToastInterface {
    success(message: string): void
    error(message: string): void
    info(message: string): void
    warning(message: string): void
  }

  export function useToast(): ToastInterface

  const plugin: Plugin
  export default plugin
} 