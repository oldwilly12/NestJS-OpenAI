import OpenAI from "openai";

interface Options {
    prompt: string;
}

// el use case debe decir con que debe tranajar para no mandar todo el dto
export const orthographyCheckUseCase = async( openai: OpenAI ,options: Options ) => {

    const { prompt } = options;

    const response = await openai.responses.create({
        model: "gpt-4o-mini",
        instructions: `
        Te seran proveidos textos en español con posibles errores ortograficos y gramaticales,
        las palabras usadas deben de existir en el diccionario de la real academia española,
        Debes de responder en formato JSON,
        tu tarea es corregirlos y retornar informacion de las solicitudes, tambien debes de dar un porcentaje de acierto por  el usuario,

        si no hay errores, debes de retornar un mensaje de felicitaciones.

        Ejemplo de salida:
        {
            userScore: number,
            errors: string[], // ['error -> solucion'],
            message: string // Usa emojis y texto para felicitar al usuario
        }
        `,
        input: prompt,
        max_output_tokens: 150,
        
    });

    console.log(response);
    
    console.log(response.output_text);

    return response.output_text;

}

/**
 * la verdadera inmplementacion con OpenAI
 */