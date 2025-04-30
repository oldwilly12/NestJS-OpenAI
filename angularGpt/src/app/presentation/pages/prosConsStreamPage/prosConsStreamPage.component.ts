import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  imports: [
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject( OpenAiService );

  public abortSignal = signal(new AbortController());

  async handleMessage( prompt: string ) {

    this.abortSignal().abort(); // abortar la señal anterior asi solo no porque me cancela el fech antes de inciair y despues se usa para abortar el valor de la señal de abajo
    this.abortSignal = signal(new AbortController()); // crear una nueva señal para la siguiente peticion

    this.messages.update((prev) => [
      ...prev,
      {
        text: prompt,
        isGpt: false,
      },
      { // mensaje incertado de IA para que paresca que esta pensando
        text: 'Loading...',
        isGpt: true,
      },
    ])


    this.isLoading.set( true );
    const stream = this.openAiService.prosConsStreamDiscusser( prompt, this.abortSignal().signal );
    this.isLoading.set(false);

    for await ( const text of stream){ // el stream y reader

      this.handleStreamResponse( text );
    }

  }

  handleStreamResponse( message: string ) {

    // tomar ultimo mesaje para actualizarlo
    this.messages().pop();
    const messages = this.messages();

    this.messages.set([ ...messages, { isGpt: true, text: message } ]);
  }

}
