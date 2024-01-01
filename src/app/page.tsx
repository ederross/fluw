/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Square from '@/components/nodes/Square'
import * as Toolbar from '@radix-ui/react-toolbar'
import DefaultEdge from '@/components/edges/DefaultEdge'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
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

import { ArrowLeft } from 'lucide-react'

import Main from '@/components/nodes/Main'
import { adjustNodesWithMainNodePosition } from '@/lib/layoutingFlow/nodesAdjust'
import { zinc } from 'tailwindcss/colors'

// Nodes, Edges = Connections
const panOnDrag = [1, 2]
const NODE_TYPES = {
  main: Main,
  square: Square,
}
const EDGE_TYPES = {
  default: DefaultEdge,
}

// Conteúdo inicial
// const INITIAL_NODES = [
//   {
//     id: 'IA',
//     type: 'main',
//     data: { label: 'Inteligência Artificial (IA)' },
//     position: { x: 0, y: 0 },
//   },
//   {
//     id: 'ML',
//     type: 'square',
//     data: { label: 'Machine Learning (ML)' },
//     position: { x: 100, y: 100 },
//   },
//   {
//     id: 'DL',
//     type: 'square',
//     data: { label: 'Deep Learning (DL)' },
//     position: { x: 200, y: 200 },
//   },
//   {
//     id: 'Boom',
//     type: 'square',
//     data: { label: 'Do nascimento ao boom' },
//     position: { x: 300, y: 300 },
//   },
//   {
//     id: 'Evolution',
//     type: 'square',
//     data: { label: 'Tempo e evolução' },
//     position: { x: 400, y: 400 },
//   },
//   {
//     id: 'Vision',
//     type: 'square',
//     data: { label: 'Visão Computacional' },
//     position: { x: 500, y: 500 },
//   },
// ] satisfies Node[]

let id = 0
const getId = () => `dndnode_${id++}`

export default function Home() {
  const controls = useAnimation()
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const closedX = shouldReduceMotion ? 712 : 172
  const [resume, setResume] = useState<IResumeResponse>()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  async function resumeSubject() {
    try {
      const response = await axios.get('/api/resume')
      // A resposta bem-sucedida será acessível em response.data
      console.log(response.data)
      const resumeData = JSON.parse(response.data)

      setResume(resumeData)
      return response.data
    } catch (err) {
      // Trate os erros aqui
      console.log('deu ruim cara', err)
    }
  }

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

  useEffect(() => {
    if (resume) {
      const nodesData = resume.nodes
      const adjustedNodes = adjustNodesWithMainNodePosition(nodesData)
      setNodes(adjustedNodes)
      setEdges(resume.edges)
    }
  }, [setNodes, setEdges, resume])

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
            fitView
          >
            <Background gap={12} size={2} color={zinc[200]} />
            <Controls />
          </ReactFlow>

          <div className="fixed left-[88px] top-8 hidden h-12 w-auto items-center gap-2 rounded-full border bg-white pl-1 pr-5 shadow-xl lg:flex">
            <div className="fixed left-8 top-8 hidden h-12 w-12 items-center gap-2 rounded-[16px] border bg-white p-[6px] shadow-xl lg:flex">
              <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-[8px] hover:bg-zinc-50">
                <ArrowLeft size={20} />
              </div>
            </div>
            <Avatar className="bg-zinc-100 object-cover p-2">
              <AvatarImage src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h2 className="font-semibold tracking-tighter">
              O caminho estoico para felicidade
            </h2>
          </div>

          <div className="fixed  right-8 top-[34px] hidden h-10 w-auto items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-3 shadow-xl lg:flex">
            <Avatar className="h-8 w-8 bg-zinc-100 object-cover p-2">
              <AvatarImage src="/" />
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="h-[3px] w-4 rounded-full bg-zinc-900"></div>
              <div className="h-[3px] w-4 rounded-full bg-zinc-900"></div>
            </div>
          </div>

          <Toolbar.Root className="fixed bottom-48 left-1/2 h-20 w-96 -translate-x-1/2 overflow-hidden rounded-2xl border border-zinc-300 bg-white px-8 shadow-lg">
            <Toolbar.Button
              onClick={addSquareNode}
              onDragStart={(event) => onDragStart(event, 'square')}
              draggable
              className="dndnode mt-6 h-32 w-32 rounded-xl border bg-white shadow-lg transition-transform hover:-translate-y-2 "
            ></Toolbar.Button>
          </Toolbar.Root>
          {/* put animation below -> h-[85%] */}
          <motion.div
            animate={{
              height: isOpen ? 712 : closedX,
            }}
            className="5xl:w-[1920px] fixed bottom-0 left-1/2 mx-auto min-h-[172px] w-[1280px] -translate-x-1/2 rounded-t-3xl border bg-white px-12 py-12 shadow-xl lg:w-[928px] xl:w-[1280px] 2xl:w-[1280px]"
          >
            <Button
              onClick={() => setIsOpen(!isOpen)}
              type="submit"
              className="bg-blue-500"
            >
              Expand
            </Button>
            <p className="mb-2 font-normal text-zinc-400">Groselha Podcast</p>
            <h2 className="mb-2 text-3xl font-semibold">
              O caminho estoico para uma vida melhor
            </h2>
            <p className="text-zinc-300">{resume?.description}</p>
          </motion.div>
        </ReactFlowProvider>
      </div>
    </main>
  )
}
