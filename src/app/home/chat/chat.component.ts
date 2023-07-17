import { EventEmitterService } from '../../services/event-emitter.service';
import { ConversationsAndMessages, Message } from 'src/app/models/model';
import { ChatService } from '../../services/chat.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewInit {
  username?: string;
  currentConversationId?: string;
  currentReceiver?: string;

  // @ViewChild('scrollMe') chatContainer!: ElementRef;

  @ViewChild('scrollframe', { static: false }) scrollFrame:
    | ElementRef
    | undefined;
  @ViewChildren('item') itemElements: QueryList<any> | undefined;

  currentConversation: ConversationsAndMessages = {
    conversationId: '',
    name: '',
    messages: [],
    unreadMessages: 0,
  };

  newMessage: string = '';
  isAtBottom: boolean = true;
  scrollTopValue: number = 0;

  scrollContainer: any;

  isNearBottom = true;

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame?.nativeElement;
    this.itemElements?.changes.subscribe((_) => this.onItemElementsChanged());

    // Add a new item every 2 seconds
    // setInterval(() => {
    //   this.items.push({});
    // }, 2000);
  }

  onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }

  isUserNearBottom(): boolean {
    const threshold = 150;
    const position =
      this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  constructor(
    private chatService: ChatService,
    private eventEmitterService: EventEmitterService
  ) {
    this.eventEmitterService.currentSourceUpdated.subscribe(
      (data: ConversationsAndMessages) => {
        this.currentConversation.conversationId = data.conversationId;
        this.currentConversation.messages = data.messages;
        this.currentConversation.name = data.name;
        // this.onNewMessagesArrive();
      }
    );
  }

  ngOnInit(): void {
    let userstored = localStorage.getItem('user');
    if (userstored) this.username = userstored;
    this.registerUserToChatHub();
    // this.onNewMessagesArrive();
  }

  // ngAfterViewInit(): void {
  //   // this.scrollToBottom();
  // }

  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: any): void {
  //   // Handle scroll event here
  //   if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
  //     console.log("scroll", event);
  //     // code
  //     // this.isAtBottom = true;
  //     event.scrollTop = event.target.scrollHeight;
  //   }
  // }

  // @HostListener('scroll', ['$event'])
  // onScroll(event: any) {
  //
  // }

  // scrollToBottom(): void {
  //   const container = this.chatContainer.nativeElement;
  //   container.scrollTop = container.scrollHeight;
  //   const isScrolledToBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
  // }

  // Call scrollToBottom() whenever new messages arrive or the chat container is updated
  // onNewMessagesArrive(): void {
  //   this.scrollToBottom();
  // }

  registerUserToChatHub() {
    this.chatService.registerUser(this.username).subscribe(
      (data) => {
        console.log('open chat', data);
        this.chatService.connectToChat();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.chatService.sendMessage(
        this.currentConversationId,
        this.username,
        this.newMessage.trim(),
        this.currentConversation.name
      );
      // .subscribe(
      //   (data: any) => {
      //     console.log('send message', data);
      this.currentConversation.messages.push({
        sender: 'You',
        text: this.newMessage.trim(),
      });
      this.newMessage = '';
      //   },
      //   (error: any) => {
      //     console.log(error);
      //   }
      // );
    }
  }

  getMessageClass(sender: string): string {
    return sender === 'You' ? 'own-message' : 'other-message';
  }
}
