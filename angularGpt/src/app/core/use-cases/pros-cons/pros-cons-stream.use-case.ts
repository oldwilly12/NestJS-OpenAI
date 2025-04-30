import { environment } from "environments/environment";


export async function* prosConsStreamUseCase( prompt: string, abortSignal: AbortSignal ) {


 try {

  const response = await fetch(`${environment.backendApi}/pros-cons-discusser-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain' // le dice al backend que se espera recibir texto plano como respuesta
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      });

      if ( !response.ok ) throw new Error('No se pudo realizar la comparacion');




      // FORMA DE HACERLO EN EL CURSO
      const reader = response.body?.getReader();

      if( !reader ) {
        console.log('No se pudo leer el stream');
        throw new Error('No se puede generar un reader')
      }

      const decoder = new TextDecoder();
      let text = '';

      while(true) {
        const {value, done} = await reader.read();

        if( done ) {
          break;
        }

        const decoderChunk = decoder.decode( value, { stream: true });


        text += decoderChunk;

        yield text; // valor parcial que regresar yeald del texto emitir como esta el texto en este momento
        // console.log(text);
      }

      return text;

 } catch (error) {
  return null;
 }


}
