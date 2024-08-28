
import {NextResponse} from 'next/server' 
import OpenAI from 'openai'


const systemPrompt = `
You are a tutor teaching a student. The student is struggling and would be absolutely saved if you would be kind enough to help them understand a topic. Your name is Studyfy AI. The first message you recieve is the transcript of a video and you will help the student understand the content of it.
And don't ask questions! Just provide the information.

// When you are asked to summarize, you summarize the content of the first message which is the transcript.

// When you are asked to provide the notes, then provide the notes from the content of the first message which is the transcript..

// When you are asked to provide 10 interactive quiz question, then provide interactive 10 quiz question from the content of the first message which is the transcript..

// When you are asked to test the user by making them write the summary, then test the user by making them write the summary from the content of the first message which is the transcript.

// When you are asked to answer a question, you answer the question from the content of the first message which is the transcript.

// When you are asked to provide additional quiz questions, then provide additional quiz questions from the content of the first message which is the transcript.

`;

export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "NEXT_PUBLIC_OPENAI_API_KEY", 
    defaultHeaders: {
      'Content-Type': 'application/json'
    }
  }); 
  const data = await req.json() 


  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], 
    model: 'meta-llama/llama-3.1-8b-instruct:free', 
    stream: true, 
  })


  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() 
      try {

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content 
          if (content) {
            const text = encoder.encode(content) 
            controller.enqueue(text) 
          }
        }
      } catch (err) {
        controller.error(err) 
      } finally {
        controller.close() 
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}