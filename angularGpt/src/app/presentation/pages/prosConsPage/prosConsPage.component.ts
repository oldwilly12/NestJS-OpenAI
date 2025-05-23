import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent
  ],
  templateUrl: './prosConsPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsPageComponent {

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject( OpenAiService );


  handleMessage( prompt: string ) {

    this.isLoading.set(true);
    this.messages.update( (prevMessages) => [
      ...prevMessages,
      {
        isGpt: false,
        text: prompt,
      }
    ]);

    this.openAiService.prosConsDiscusser( prompt ).subscribe(resp => {
      this.messages.update( prev => [
        ...prev,
        {
          isGpt: true,
          text: resp.content
        }
      ])

      this.isLoading.set(false);
    })
  }
}
