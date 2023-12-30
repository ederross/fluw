import { EdgeProps, EdgeText, getSmoothStepPath, useReactFlow } from 'reactflow'

export default function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) {
  const { setEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id))
  }

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path stroke-zinc-300 stroke-2"
        d={edgePath}
        markerEnd={markerEnd}
      ></path>
    </>
  )
}
