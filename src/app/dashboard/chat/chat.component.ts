import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/shared/interfaces/message.type';
import { AccessTokenSerivce } from 'src/app/shared/services/acccessToken.service';
import { AudioRecordingService } from 'src/app/shared/services/audioRecording.service';
import { DialogflowService } from 'src/app/shared/services/dialogflow.service';
import { SessionService } from 'src/app/shared/services/session.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollBottom', { static: true }) private scrollContainer: ElementRef;
  messageList: Message[];
  message: String;
  blobSubscription;

  constructor(
    private dialogflowService: DialogflowService,
    private audioRecordingService: AudioRecordingService,
    private accessTokenService: AccessTokenSerivce,
  ) { }

  ngOnInit() {
    this.messageList = [];
    this.blobSubscription = false;

    this.accessTokenService.generateAccessToken().subscribe(response => {
      console.log(response);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  public sendMessage(message) {
    if (message.length != 0) {
      this.messageList.push({
        text: message,
        isOwner: true
      });
      this.message = '';
      this.detectIntent(message);
    }
  }

  private detectIntent(message: string) {
    this.dialogflowService.detectIntent(this.getSessionId(), message).subscribe(response => {
      this.playText(response['outputAudio']);
      this.messageList.push({
        text: response['queryResult']['fulfillmentText'],
        isOwner: false
      });
    });
  }

  private playText(encodedAudio) {
    let audio = new Audio("data:audio/wav;base64," + encodedAudio);
    audio.play();
  }

  private getSessionId(): string {
    return SessionService.getSessionToken();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }


  public startRecording() {
    this.audioRecordingService.startRecording();
  }

  public async stopRecording() {
    this.audioRecordingService.stopRecording();
    this.audioRecordingService.getRecordedBlob().subscribe(response => {
      let reader = new FileReader();
      reader.readAsDataURL(response.blob);
      reader.onloadend = () => {
        let base64 = reader.result.toString().split(',')[1];
        this.detectIntentFromAudio(base64);
      }
    });
  }

  private detectIntentFromAudio(audio) {
    this.blobSubscription = this.dialogflowService.detectIntentFromAudio(this.getSessionId(), audio).subscribe((response) => {
      this.playText(response['outputAudio']);
      this.messageList.push({
        text: response['queryResult']['queryText'],
        isOwner: true
      });
      this.messageList.push({
        text: response['queryResult']['fulfillmentText'],
        isOwner: false
      });
      this.unsubscribe();
    });
  }

  private unsubscribe() {
    this.blobSubscription.unsubscribe();
  }

  public async blobToBase64(blob) {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      return reader.result;
    }
  }

}
