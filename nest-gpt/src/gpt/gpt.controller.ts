import { BadRequestException, Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto } from './dtos';
import type { Response } from 'express';
import { TranslateDto } from './dtos/translate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

    const filePath = this.gptService.getFilePath(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status( HttpStatus.OK);
    res.sendFile(filePath);

  //   const filePath = await this.gptService.textToAudio( textToAudioDto );

    // res.setHeader('Content-Type', 'audio/mp3');
    // res.status( HttpStatus.OK);
    // res.sendFile(filePath);
  // }


  }

  @Post('audio-to-text')
  @UseInterceptors( // Esta parte es para subir archivos
    FileInterceptor('file', { // el primer parametro es el nombre del campo del formulario, en postman es file
      storage: diskStorage({
        destination: './generated/uploads', // carpeta donde se guardara el archivo
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop(); // obtener la extension del archivo
          const fileName = `${new Date().getTime() }.${fileExtension}`; // nombre del archivo
          return callback(null, fileName); // primero es un error, segundo es el nombre del archivo
        }
      })
    })
  )
  async audioToText(
    // parte para validar el archivo
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5MB' }), // 5MB
            // new FileTypeValidator({ fileType: 'audio/*' }) // solo audio
          ]
        })
      ) file: Express.Multer.File,
  ){
     // Validación manual del tipo MIME
   if (!file.mimetype.startsWith('audio/')) {
     throw new BadRequestException('File must be of audio type');
  }
    
    console.log({file});
    return 'done';


  }

}
