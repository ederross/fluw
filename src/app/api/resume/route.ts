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
    // Extract the `messages` from the body of the request
    // Create prompt text with user input
    const prompt = `return a recipe for avocado with chicken`
    // Define the JSON Schema by creating a schema object
    const schema = {
      type: 'object',
      properties: {
        dish: {
          type: 'string',
          description: 'Descriptive title of the dish',
        },
        ingredients: {
          type: 'array',
          items: { type: 'string' },
        },
        instructions: {
          type: 'array',
          description: 'Steps to prepare the recipe.',
          items: { type: 'string' },
        },
      },
    }

    // Ask OpenAI for a streaming chat completion given the prompt
    // const response = await openai.createCompletion({
    //   model: 'gpt-3.5-turbo-1106',
    //   stream: true,
    // })
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Você é uma assistente especializada em resumos de todos os tipos de assuntos, designada para retornar apenas JSON. no formato de exemplo abaixo: 
          {
            "subject": "Rússia Encanta o Mundo: Reflexões Sobre a Copa do Mundo de 2018",
            "description": "Está é uma descrição do assunto relacionado ao tema.",
            "keypoints": [
              {
                title: "Example 01",
                description: "Whis is the text explaining the example."
              }
            ]
          }
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
    // Convert the response into a friendly text-stream
    // const stream = OpenAIStream(response)
    // Respond with the stream
    // return new StreamingTextResponse(stream)
    return NextResponse.json(completion.choices[0].message.content)
  } catch (error) {
    console.log('asdasdas', error)
    return NextResponse.error()
  }
}
