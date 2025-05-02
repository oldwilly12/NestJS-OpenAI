import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto } from './dtos';
import type { Response } from 'express';
import { TranslateDto } from './dtos/translate.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
      @Body() orthographyDto: OrthographyDto,
    ){

      return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(
      @Body() prosConsDiscusserDto: ProsConsDiscusserDto
  ){
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
      @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
      @Res() res: Response
  ){
    const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    // stream de informacion application/json  text/plain
    res.setHeader('Content-Type', 'application/json');
    res.status( HttpStatus.OK );


    for await (const chunk of stream) {
      if (chunk.type === 'response.output_text.delta'){
        const delta = chunk.delta;
        if(typeof delta === 'string' ){
          console.log(delta);
          res.write(delta);
        }
      }

    }

    res.end(); // cerrar el stream

  }

  @Post('translate')
  translate(
      @Body() translateDto : TranslateDto
  ){
    return this.gptService.translateText( translateDto );
  }

  @Post('text-to-audio')
  async textToAudio(
      @Body() textToAudioDto : TextToAudioDto,
      @Res() res: Response
  ){
    const filePath = await this.gptService.textToAudio( textToAudioDto );

    res.setHeader('Content-Type', 'audio/mp3');
    res.status( HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
      //@Body() textToAudioDto : TextToAudioDto,
      @Param('fileId') fileId: string,
      @Res() res: Response
  ){

    // const filePath = this.gptService.getFilePath(fileId);


  //   const filePath = await this.gptService.textToAudio( textToAudioDto );

    // res.setHeader('Content-Type', 'audio/mp3');
    // res.status( HttpStatus.OK);
    // res.sendFile(filePath);
  // }


  }

}
