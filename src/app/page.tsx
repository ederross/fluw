'use client'
import { useCallback } from 'react'
import * as Toolbar from '@radix-ui/react-toolbar'
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import Square from '@/components/nodes/Square'

import { zinc } from 'tailwindcss/colors'
import DefaultEdge from '@/components/edges/DefaultEdge'

// Nodes, Edges = Connections
const panOnDrag = [1, 2]
const NODE_TYPES = {
  square: Square,
}
const EDGE_TYPES = {
  default: DefaultEdge,
}

const INITIAL_NODES = [
  {
    id: crypto.randomUUID(),
    type: 'square',
    position: {
      x: 200,
      y: 200,
    },
    data: {},
  },
  {
    id: crypto.randomUUID(),
    type: 'square',
    position: {
      x: 1000,
      y: 200,
    },
    data: {},
  },
] satisfies Node[]

export default function Home() {
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES)

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => addEdge(connection, edges))
    },
    [setEdges],
  )

  function addSquareNode() {
    setNodes((nodes) => [
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'square',
        position: {
          x: 750,
          y: 350,
        },
        data: {},
      },
    ])
  }

  return (
    <main className="min-h-screen w-full">
      <div className="w-screnn h-screen bg-white">
        <ReactFlow
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          nodes={nodes}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{
            type: 'default',
          }}
          panOnScroll
          selectionOnDrag
          panOnDrag={panOnDrag}
        >
          <Background gap={12} size={2} color={zinc[200]} />
          <Controls />
        </ReactFlow>
        <Toolbar.Root className="fixed bottom-10 left-1/2 h-20 w-96 -translate-x-1/2 overflow-hidden rounded-2xl border border-zinc-300 bg-white px-8 shadow-lg">
          <Toolbar.Button
            onClick={addSquareNode}
            className="mt-6 h-32 w-32 rounded-xl bg-violet-500 transition-transform hover:-translate-y-2 "
          ></Toolbar.Button>
        </Toolbar.Root>
      </div>
    </main>
  )
}
