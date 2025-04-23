

import OpenAI from "openai";

interface Options {
    prompt: string;
}


export const prosConsDicusserUseCase = async (openai: OpenAI, { prompt }: Options) => {


    const response = await openai.responses.create({
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

    console.log(response);
    
    console.log(response.output_text);

    return response.output_text;
}