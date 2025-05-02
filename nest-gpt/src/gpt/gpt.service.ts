import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto } from './dtos';
import OpenAI from 'openai';
import { translateUseCase } from './use-cases/translate.use-case';
import { TranslateDto } from './dtos/translate.dto';
import path from 'path';


@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });


    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase( this.openai, {
            prompt: orthographyDto.prompt
        });
    }

    async prosConsDicusser({ prompt }: ProsConsDiscusserDto){
        return await prosConsDicusserUseCase(this.openai, { prompt });
    }

    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto){
        return await prosConsDicusserStreamUseCase(this.openai, { prompt });
    }

    async translateText( {prompt, lang } : TranslateDto) {
        return await translateUseCase( this.openai, {prompt, lang })
    }

    async textToAudio( { prompt, voice } : TextToAudioDto ) {
        return await textToAudioUseCase( this.openai, { prompt, voice } );
    }

    getFilePath( filePath: string ){
        const folderPath = path.resolve(__dirname, '../../generated/audios');

        
        return  path.resolve( `${folderPath}/${filePath}.mp3` );
    }

}

/**
 * vamos a teneer infomracion que sera global con el objeto de Chatgpt
 * para no se regenere, no usar la misma instancia
 */