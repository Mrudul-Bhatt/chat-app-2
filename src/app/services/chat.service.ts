import { EventEmitterService } from './event-emitter.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  Subject,
} from '@microsoft/signalr';
import { Message } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public user?: string;
  onlineUsers: string[] = [];
  messages: any[] = [];
  baseUrl = 'https://localhost:7158';
  private messageSubject: Subject<any> = new Subject<any>();
  private chatConnection?: HubConnection;

  constructor(
    private http: HttpClient,
    private eventEmitterService: EventEmitterService
  ) {}

  registerUser(user: any) {
    user = user.trim();
    this.user = user;
    return this.http.post(
      'https://localhost:7158/api/Chat/RegisterUser',
      { name: user },
      { responseType: 'text' }
    );
  }

  connectToChat() {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7158/hubs/chat')
      .withAutomaticReconnect()
      .build();

    this.chatConnection.start().catch((err) => console.log(err));

    this.chatConnection.on('UserConnected', () => {
      console.log('UserConnected');
      this.addUserConnectionId();
    });

    // this.chatConnection.on('OnlineUsers', (onlineUsers) => {
    //   console.log('OnlineUsers', onlineUsers);
    //   this.onlineUsers = [...onlineUsers];
    // });

    // this.chatConnection.on('NewMessage', (newMessage) => {
    //   console.log('Messages', newMessage);
    //   this.messages = [...this.messages, newMessage];
    // });

    this.chatConnection.on('NewMessage', (newMessage: Message) => {
      console.log('Data coming from API Service', newMessage);
      this.eventEmitterService.updateDataInRealTime(newMessage);
    });
  }

  disConnectToChat() {
    this.chatConnection?.stop().catch((err) => console.log(err));
  }

  addUserConnectionId() {
    this.chatConnection
      ?.invoke('AddUserConnectionId', this.user)
      .catch((err) => {
        console.log(err);
      });
  }

  sendMessage(cId: any, sender: any, message: any, receiver: any) {
    const body = {
      to: receiver,
      from: this.user,
      content: message,
    };

    this.chatConnection?.invoke('ReceiveMessage', body).catch((err) => {
      console.log(err);
    });

    // this.chatConnection.
    //  ('NewMessage', (newMessage) => {
    //   console.log('Messages', newMessage);
    //   this.eventEmitterService.updateDataInRealTime(newMessage);
    // });

    // return this.http.post(
    //   `https://localhost:7158/api/Chat/LoadMessageOnDBQueue?conversationId=${cId}&senderId=${sender}&content=${message}`,
    //   {}
    // );

    // required
  }

  getActiveConversations(loggedInUser: any) {
    // this.chatConnection?.invoke('GetOnlineUsers', () => {
    //   console.log('OnlineUsers', onlineUsers);
    //   this.onlineUsers = [...onlineUsers];
    // });

    return this.http.get(
      `https://localhost:7158/api/Chat/GetAllActiveConversations?user=${loggedInUser}`
    );

    // https://localhost:7158/api/Chat/GetActiveConversations?user=mary
  }

  getConversationMessages(conversationId: string) {
    return this.http.get(
      `https://localhost:7158/api/Chat/get-conversation-messages/${conversationId}`
    );
  }

  searchUsers(query: string) {
    return this.http.get(
      `https://localhost:7158/api/Chat/GetUserByName?name=${query}`
    );
  }

  createNewConversation(receiverName: any, user: any) {
    return this.http.post(
      `https://localhost:7158/api/Chat/CreateConversation?receiverName=${receiverName}&user=${user}`,
      {}
    );
  }

  getConversationById(
    conversationId: string,
    pageNo: number,
    loggedInUser: any,
    receiver: string
  ) {
    return this.http.get(
      `https://localhost:7158/api/Chat/GetLimitedConversationById?conversationId=${conversationId}&pageNo=${pageNo}&loggedInUser=${loggedInUser}`
    );
  }

  getConversationsAndMessages(loggedInUser: any) {
    return this.http.get(
      `https://localhost:7158/api/Chat/GetConversationsAndMessageHistory?user=${loggedInUser}`
    );
  }
}
