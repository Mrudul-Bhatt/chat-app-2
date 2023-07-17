import { ConversationsAndMessages } from './../models/model';
import { EventEmitter, Injectable } from '@angular/core';

interface Message {
  sender: string;
  text: string;
}

interface Data {
  messages: Message[];
  conversationId: string;
  currentReceiver: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  constructor() {}

  // data: Data = {
  //   messages: [],
  //   conversationId: '',
  //   currentReceiver: '',
  // };

  dataStore: ConversationsAndMessages[] = [];

  currentSource: ConversationsAndMessages = {
    conversationId: '',
    name: '',
    messages: [],
    unreadMessages: 0,
  };

  // conversationId: any;
  dataStoreUpdated: EventEmitter<any> = new EventEmitter();
  currentSourceUpdated: EventEmitter<any> = new EventEmitter();

  updateData(data: any) {
    this.dataStore = data;
    this.dataStoreUpdated.emit(this.dataStore);
  }

  updateDataInRealTime(newMessage: Message) {
    var current = this.dataStore.find((x) => x.name === newMessage.sender);

    if (current === undefined) return;

    current.messages.push(newMessage);

    if (current.conversationId !== this.currentSource.conversationId) {
      if (current.unreadMessages === undefined) current.unreadMessages = 0;

      current.unreadMessages = current.unreadMessages + 1;
    }

    this.dataStoreUpdated.emit(this.dataStore);

    if (current.conversationId === this.currentSource.conversationId) {
      this.currentSource.messages.push(newMessage);
      this.currentSourceUpdated.emit(this.currentSource);
    }
  }

  changeConversation(id: string, receiver: string) {
    var current = this.dataStore.find((x) => x.conversationId === id);
    if (current) {
      this.currentSource.conversationId = current?.conversationId;
      this.currentSource.name = current?.name;
      this.currentSource.messages = current?.messages;
      this.currentSource.unreadMessages = 0;
    }
    this.currentSourceUpdated.emit(this.currentSource);
  }

  getData() {
    return this.dataStore;
  }
}
