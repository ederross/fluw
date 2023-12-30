export const adjustNodesPosition = (nodes: any[]) => {
  const spacingX = 250 // Espaçamento horizontal entre os nodes
  const startY = 80 // Posição y inicial

  return nodes.map((node, index) => {
    // Ajusta a posição x e y do node
    const adjustedNode = {
      ...node,
      position: {
        x: spacingX * index,
        y: startY,
      },
    }

    return adjustedNode
  })
}

export const adjustNodesWithMainNodePosition = (nodes: any[]) => {
  const spacing = 500 // Aumentei o espaçamento entre os nodes secundários
  const startX = 500 // Posição x inicial para os nodes secundários
  const startY = 300 // Posição y inicial para os nodes secundários

  // Encontrar o node principal
  const mainNode = nodes.find((node) => node.type === 'main')

  // Se não houver node principal, não fazemos nada
  if (!mainNode) {
    console.error('Node principal não encontrado!')
    return nodes
  }

  // Posicionar o node principal no centro
  const mainNodePosition = {
    x: startX,
    y: startY,
  }
  const adjustedMainNode = {
    ...mainNode,
    position: mainNodePosition,
  }

  // Posicionar os outros nodes ao redor do node principal em formato de círculo
  const adjustedNodes = nodes.map((node, index) => {
    if (node.type === 'main') {
      return adjustedMainNode
    }

    // Calcular a posição dos nodes secundários em formato de círculo ao redor do node principal
    const angle = (index / (nodes.length - 1)) * (2 * Math.PI)
    const x = startX + spacing * Math.cos(angle)
    const y = startY + spacing * Math.sin(angle)

    return {
      ...node,
      position: {
        x,
        y,
      },
    }
  })

  return adjustedNodes
}
