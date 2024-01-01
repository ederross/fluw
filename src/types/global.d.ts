export {}

declare global {
  //* Interfaces

  interface ICustomNode {
    id: string
    type: 'main' | 'square'
    data: {
      label: string
    }
    position: {
      x: number
      y: number
    }
  }

  interface ICustomEdge {
    id: string
    source: string
    target: string
  }

  interface IResumeResponse {
    subject: string
    description: string
    nodes: Node[]
    edges: Edge[]
  }
}
