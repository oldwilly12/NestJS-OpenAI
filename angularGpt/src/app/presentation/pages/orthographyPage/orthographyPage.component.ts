import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TextMessageBoxComponent, TextMessageBoxFileComponent, TextMessageBoxSelectComponent, TextMessageEvent, TypingLoaderComponent } from '@components/index';
import { TextMessageBoxEvent } from '../../components/text-boxes/textMessageBoxSelect/textMessageBoxSelect.component';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';



@Component({
  selector: 'app-orthography-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {

  public messages = signal<Message[]>([ {text: 'hola', isGpt: true } ]);
  public isLoading = signal(false);
  public openAiService = inject( OpenAiService );


  handleMessage( promt: string ) {
    console.log({ promt });
  }

  handleMessageWithFile( {prompt, file}: TextMessageEvent) {
    console.log({ prompt, file });
  }

  handleMessageWithSelect( event: TextMessageBoxEvent){
    console.log( event );
  }

}
