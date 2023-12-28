'use client'
import { memo, useState } from 'react'
import { NodeProps, Handle, Position, NodeResizer } from 'reactflow'

export function Square({ selected }: NodeProps) {
  return (
    <div className="h-full min-h-[200px] w-full min-w-[200px] overflow-hidden rounded-xl border border-zinc-300 bg-white px-8 shadow-lg">
      <NodeResizer
        minWidth={200}
        minHeight={200}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-2 rounded border-blue-400"
      />
      <Handle
        id={'left'}
        type="source"
        position={Position.Left}
        className="-left-5 h-3 w-3 border-2 bg-blue-400/80"
      />
      <Handle
        id={'right'}
        type={'source'}
        position={Position.Right}
        className="-right-5 h-3 w-3 border-2 bg-blue-400/80"
      />
      <Handle
        id={'bottom'}
        type={'source'}
        position={Position.Bottom}
        className="-bottom-5 h-3 w-3 border-2 bg-blue-400/80"
      />
      <Handle
        id={'top'}
        type="source"
        position={Position.Top}
        className="-top-5 h-3 w-3 border-2 bg-blue-400/80"
      />
    </div>
  )
}

export default memo(Square)