import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/model';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
})
export class ChatWindowComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  messages: Message[] = [
    {
      sender: 'John Doe',
      text: 'Hello!',
    },
    {
      sender: 'You',
      text: 'Hi John!',
    },
  ];

  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({
        sender: 'You',
        text: this.newMessage.trim(),
      });
      this.newMessage = '';
    }
  }

  getMessageClass(sender: string): string {
    return sender === 'You' ? 'own-message' : 'other-message';
  }
}
