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

  data: Data = {
    messages: [],
    conversationId: '',
    currentReceiver: '',
  };
  // conversationId: any;
  dataUpdated: EventEmitter<any> = new EventEmitter();

  updateData(conversationId: any, newData: Message[], receiver: any) {
    this.data.messages = newData;
    this.data.conversationId = conversationId;
    this.data.currentReceiver = receiver;
    this.dataUpdated.emit(this.data);
  }

  updateDataInRealTime(newMessage: Message) {
    this.data.messages = [...this.data.messages, newMessage];
    this.dataUpdated.emit(this.data);
  }

  getData() {
    return this.data;
  }
}
