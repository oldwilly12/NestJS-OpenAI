import OpenAI from "openai";
import * as path from "path";
import * as fs from "fs";

interface Options {
    prompt: string;
    voice?: string;
}


export const textToAudioUseCase = async (openai: OpenAI, { prompt, voice }: Options) => {


    const voices = {
        'nova': 'nova',
        'alloy': 'alloy',
        "ash" : "ash",
        "ballad" : "ballad",  
        "coral" : "coral",
        "echo" : "echo", 
        "fable" : "fable",
        "onyx" : "onyx", 
        "sage" : "sage",
        "shimmer" : "shimmer", 
        "verse" : "verse",
    }

    const selectedVoice = voices[voice] ?? 'nova'; // si regresa null, retorna nova

    const folderPath = path.resolve(__dirname, '../../../generated/audios'); // __dirname apunta al todo el directorio de nuestro proyecto
    const speechFile = path.resolve( `${folderPath}/${ new Date().getTime()}.mp3` );

    fs.mkdirSync( folderPath, { recursive: true } ); // crea el directorio si no existe, y si existe lo ignora

    const mp3 = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: selectedVoice,
        input: prompt,
        instructions: "Speak in a cheerful and positive tone.",
        response_format: "mp3",
    });

    const buffer = Buffer.from( await mp3.arrayBuffer() );
    fs.writeFileSync( speechFile, buffer ); // nombre del archivo, contenido


    return speechFile;
}