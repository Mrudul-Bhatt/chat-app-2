import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  user = '';
  message = '';
  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  ngOnDestroy() {
    // this.chatService.disConnectToChat();
  }

  // sendMessage() {
  //   console.log('send message');
  //   this.chatService.sendMessage(this.message);
  // }

  // connect() {
  //   console.log('name', this.user);
  //   this.chatService.registerUser(this.user).subscribe(
  //     (data) => {
  //       console.log('open chat', data);
  //       this.chatService.connectToChat();
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
}
