import type { ProsConsResponse } from "@interfaces/pros-cons.response";
import { environment } from "environments/environment.development";


export const prosConsUseCase = async ( prompt: string ) => {


  try {

    const response = await fetch(`${environment.backendApi}/pros-cons-discusser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if ( !response.ok ) throw new Error('No se pudo realizar la comparacion');

    const content = await response.text();
    // console.log(data);

    return {
      ok:true,
      content: content,
    }

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      content: 'Error al procesar la solicitud',
        }
  }
}
