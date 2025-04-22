import type { OrthographyResponse } from "@interfaces/orthography.response";
import { environment } from "environments/environment.development";


export const orthographyUseCase = async ( prompt: string) => {


  try {

    const response = await fetch(`${environment.backendApi}/orthography-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt}),
    });

    if ( !response.ok ) throw new Error('No se pudo realizar la correccion');

    const data = await response.json() as OrthographyResponse;

    return {
      ok:true,
      ...data,
    }

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: 'Error al procesar la solicitud',
        }
  }
}
