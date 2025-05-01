
import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}


export const translateUseCase = async (openai: OpenAI, { prompt, lang }: Options) => {


    const response = await openai.responses.create({
        model: "gpt-4o-mini",
        instructions: `Traduce el siguiente texto al idioma ${lang}`,
        input: prompt,
        temperature: 0.7,
        max_output_tokens: 500,
        
    });

    console.log(response);
    
    console.log(response.output_text);

    return {message: response.output_text};
}