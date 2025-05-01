import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxSelectComponent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-translate-page',
  imports: [
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject( OpenAiService );

  public languages = signal([ // como modificara mi html se deja como señal
    { id: 'alemán', text: 'Alemán' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
  ]);



  handleMessageWithSelect( { prompt, selectedOption }: TextMessageBoxEvent ){
    // console.log( event );

    this.messages.update(( prev ) =>
       [
        ...prev,
        {
          isGpt: false,
          text: prompt,
        },
      ]);

    this.isLoading.set( true );

    this.openAiService.translateText( prompt, selectedOption ).subscribe( (resp) => { // cuando tenga la respuesta
      this.isLoading.set( false );
      this.messages.update((prev) =>
         [
          ...prev,
          {
            isGpt: true,
            text: resp.message,
          },
        ]
      )


    })

  }
 }
