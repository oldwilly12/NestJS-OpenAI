import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';
import OpenAI from 'openai';
import { translateUseCase } from './use-cases/translate.use-case';
import { TranslateDto } from './dtos/translate.dto';


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

}

/**
 * vamos a teneer infomracion que sera global con el objeto de Chatgpt
 * para no se regenere, no usar la misma instancia
 */