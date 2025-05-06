

import * as path from "path";
import * as fs from 'fs';
import { NotFoundException } from "@nestjs/common";


interface Options {
    prompt: string;
    voice?: string;
}



export const getAudioUseCase = ( fieldId: string ) => {

    const filePath = path.resolve(__dirname, '../../../generated/audios', `${ fieldId }.mp3`); // __dirname apunta al todo el directorio de nuestro proyecto

    const wasFound = fs.existsSync(filePath); // verifica si existe el archivo, si no existe lanza un error

    if( !wasFound ) throw new NotFoundException(`File not found: ${fieldId}.mp3`); // lanza un error si no existe el archivo

    return filePath;
}