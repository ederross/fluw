/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import * as Toolbar from '@radix-ui/react-toolbar'
import { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  Node,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

import Square from '@/components/nodes/Square'

import DefaultEdge from '@/components/edges/DefaultEdge'
import { zinc } from 'tailwindcss/colors'

// Nodes, Edges = Connections
const panOnDrag = [1, 2]
const NODE_TYPES = {
  square: Square,
}
const EDGE_TYPES = {
  default: DefaultEdge,
}

// Conteúdo inicial
const INITIAL_NODES = [] satisfies Node[]

let id = 0
const getId = () => `dndnode_${id++}`

export default function Home() {
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

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

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <main className="min-h-screen w-full">
      <div className="w-scren h-screen bg-white">
        <ReactFlowProvider>
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
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Background gap={12} size={2} color={zinc[200]} />
            <Controls />
          </ReactFlow>
          <Toolbar.Root className="fixed bottom-10 left-1/2 h-20 w-96 -translate-x-1/2 overflow-hidden rounded-2xl border border-zinc-300 bg-white px-8 shadow-lg">
            <Toolbar.Button
              onClick={addSquareNode}
              onDragStart={(event) => onDragStart(event, 'square')}
              draggable
              className="dndnode mt-6 h-32 w-32 rounded-xl border bg-white shadow-lg transition-transform hover:-translate-y-2 "
            ></Toolbar.Button>
          </Toolbar.Root>
        </ReactFlowProvider>
      </div>
    </main>
  )
}
