'use server'

import { Output, streamText } from 'ai'

import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { aigenerateEmbeddings } from '@/lib/gemini'
import { db } from '@/server/db'


const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
})

export async function askQuestion(question: string, projectId: string) {
    const stream = createStreamableValue()

    const queryVector = await aigenerateEmbeddings(question)
    const vectorQuery = `[${queryVector.join(',')}]`

    const result = await db.$queryRaw`
    SELECT "fileName","sourceCode","summary",
    1-("summaryEmbedding"<=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1-("summaryEmbedding"<=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
      LIMIT 10
    ` as {
        fileName: string; sourceCode: string; summary: string; similarity: number
    }[]


    let context = ''

    for (const doc of result) {
        context += `source:${doc.fileName}\ncode content:${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`

    }
    (async () => {
        const { textStream } = await streamText({
            model: google('gemini-1.5-flash'),
            prompt: `

            you are a ai code assistant who answers question about the codebase.Your target audiance is technical intern,
                 AI assistant is a brand new, powerful, human-like artificial intelligence.
            The traits of AI include expert knowledge, helpfulness,cleverness,and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly , king, and inspiring, and he is eager to provide vivid and thoughtful response to the user.
            AI has the some of all knowledge in their brain, and is able to answer nearly any question about any topic in
            If the question is asking about code or a specific file ,AI will provide detailed answer,giving step by step instructions 
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK

            START QUESTION
            ${question}
            END OF QUESTION
            AI assisnant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to question , AI assistant will say,"I'm sorry but, I dont know the answer"
            AI assistanat will not apologize for previos responses,but will indicate new information
            AI assistant will not invent anything that is not drawn directly from the context.
            Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering.

            `,

        });
        for await (const delta of textStream) {
            stream.update(delta)
        }
        stream.done()


    })()
    return {
        output: stream.value,
        fileReferances: result

    }
}