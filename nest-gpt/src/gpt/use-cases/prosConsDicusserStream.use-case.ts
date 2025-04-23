

import OpenAI from "openai";

interface Options {
    prompt: string;
}


export const prosConsDicusserStreamUseCase = async (openai: OpenAI, { prompt }: Options) => {


    return await openai.responses.create({
        stream: true,
        model: "gpt-4o-mini",
        instructions: `
        Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
        la respuesta debe de ser en formato markdown,
        los pros y contras deben de estar en una lista,
        `,
        input: prompt,
        temperature: 0.7,
        max_output_tokens: 500,
        
    });

    
}