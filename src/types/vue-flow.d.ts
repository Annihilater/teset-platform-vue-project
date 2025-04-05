declare module '@vue-flow/core' {
  import { Component, Plugin } from 'vue'

  export interface Node {
    id: string
    type?: string
    position: { x: number; y: number }
    data?: any
    sourcePosition?: string
    targetPosition?: string
    [key: string]: any
  }

  export interface Edge {
    id: string
    source: string
    target: string
    sourceHandle?: string
    targetHandle?: string
    type?: string
    animated?: boolean
    style?: any
    [key: string]: any
  }

  export interface Connection {
    source: string
    target: string
    sourceHandle?: string
    targetHandle?: string
  }

  export interface VueFlowStore {
    nodes: Node[]
    edges: Edge[]
    addNodes: (nodes: Node[]) => void
    addEdges: (edges: Edge[]) => void
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
    updateNode: (id: string, data: Partial<Node>) => void
    findNode: (id: string) => Node | undefined
    getNode: (id: string) => Node | undefined
    zoomIn: () => void
    zoomOut: () => void
    setViewport: (viewport: { x: number; y: number; zoom: number }) => void
  }

  export interface VueFlowProps {
    nodes: Node[]
    edges: Edge[]
    defaultViewport?: { x: number; y: number; zoom: number }
    minZoom?: number
    maxZoom?: number
    snapToGrid?: boolean
    nodesFocusable?: boolean
    edgesFocusable?: boolean
    'onUpdate:modelValue'?: (value: { nodes: Node[]; edges: Edge[] }) => void
    'onPane-ready'?: () => void
    onConnect?: (params: Connection) => void
    'onNode-click'?: (event: MouseEvent, node: Node) => void
  }

  export function useVueFlow(options?: {
    id?: string
    nodes?: Node[]
    edges?: Edge[]
  }): VueFlowStore

  export const VueFlow: Component<VueFlowProps>
  export const Panel: Component
  export const Background: Component
  export const MiniMap: Component
  export const Controls: Component

  export const Position: {
    Left: string
    Right: string
    Top: string
    Bottom: string
  }

  export const MarkerType: {
    Arrow: string
    ArrowClosed: string
  }

  const plugin: Plugin
  export default plugin
}

declare module '@vue-flow/background' {
  import { DefineComponent } from 'vue'
  export const Background: DefineComponent<any, any, any>
}

declare module '@vue-flow/minimap' {
  import { DefineComponent } from 'vue'
  export const MiniMap: DefineComponent<any, any, any>
}

declare module '@vue-flow/controls' {
  import { DefineComponent } from 'vue'
  export const Controls: DefineComponent<any, any, any>
} 