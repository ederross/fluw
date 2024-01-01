import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// const openai = new OpenAIApi(config)

import OpenAI from 'openai'
import { NextResponse } from 'next/server'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Você é uma assistente especializada em resumos de todos os tipos de assuntos, designada para retornar apenas um JSON. Separe tópicos e faça conexões assertivas entre estes tópicos, utilizando o conceito de Nodes e Edges da biblioteca ReactFlow. O JSON precisa estar no formato de exemplo abaixo: 
          {
            "subject": "Rússia Encanta o Mundo: Reflexões Sobre a Copa do Mundo de 2018",
            "description": "Está é uma descrição do assunto relacionado ao tema.",
            "nodes": [
              {
                "id": "Exemplo01",
                "type": "main",
                "data": { "title": "O exemplo 01", description: "Texto de 300 caracteres sobre o title"},
                "position": { "x": 0, "y": 0 }
              },
              {
                "id": "Exemplo02",
                "type": "main",
                "data": { "title": "O exemplo 01", description: "Texto de 300 caracteres sobre o title"},
                "position": { "x": 0, "y": 0 }
              },
            ],
            "edges": [
              { "id": "Exemplo-01", "source": "Exemplo01", "target": "Exemplo02" },
            ]
          }

          Obs: Sempre utilize apenas 1 "main" e o restante "square" como type dos nodes.
          `,
        },
        {
          role: 'user',
          content: `A Copa do Mundo de 2018, sediada na Rússia, foi um espetáculo de emoções e surpresas que cativou a atenção global. Sob o céu russo, equipes de todos os continentes se enfrentaram em uma dança futebolística única. O torneio destacou-se não apenas pelos dribles habilidosos e gols espetaculares, mas também pela hospitalidade russa e atmosfera vibrante nas arquibancadas.

      As seleções surpreenderam com performances excepcionais, como a Croácia, que chegou à final pela primeira vez, e a França, que conquistou o título pela segunda vez. Jogadores como Modric e Mbappé brilharam intensamente, deixando uma marca indelével na história do futebol. Além disso, a eliminação precoce de gigantes como Alemanha e Argentina mostrou que, na Copa do Mundo, qualquer coisa é possível.
      
      Fora dos campos, a Rússia mostrou ao mundo sua riqueza cultural e arquitetônica, proporcionando uma experiência única aos torcedores. O evento também serviu como palco para a união global, onde diferentes nacionalidades se uniram para celebrar a paixão pelo esporte.
      
      A Copa do Mundo de 2018 não foi apenas um torneio de futebol; foi uma celebração da diversidade, superação e espírito esportivo. Enquanto os estádios ecoavam com os cânticos das torcidas, o mundo testemunhou a magia do futebol e a capacidade única do esporte de unir nações em um só coro.`,
        },
      ],
      model: 'gpt-3.5-turbo-1106',
      response_format: { type: 'json_object' },
    })

    return NextResponse.json(completion.choices[0].message.content)
  } catch (error) {
    console.log('asdasdas', error)
    return NextResponse.error()
  }
}
