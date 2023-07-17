import { EventEmitterService } from './../../services/event-emitter.service';
import { ChatService } from './../../services/chat.service';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { Conversation, ConversationsAndMessages } from 'src/app/models/model';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css'],
})
export class ConversationsComponent implements OnInit {
  currentReceiver: string = '';
  constructor(
    private modalService: NgbModal,
    private chatService: ChatService,
    private eventEmitterService: EventEmitterService
  ) {
    this.eventEmitterService.dataStoreUpdated.subscribe((data: []) => {
      this.conversations = data;
      // this.onNewMessagesArrive();
    });
  }

  loggedInUser: any;

  ngOnInit(): void {
    let user = localStorage.getItem('user');
    if (user) this.loggedInUser = user;

    // this.getActiveConversations();
    this.getConversationsAndMessages();
  }

  conversations: ConversationsAndMessages[] = [
    // {
    //   name: 'John Doe',
    //   lastMessage: 'Hello, how are you?',
    //   image: 'https://via.placeholder.com/50x50',
    // },
  ];

  getConversationsAndMessages() {
    this.chatService.getConversationsAndMessages(this.loggedInUser).subscribe(
      (res: any) => {
        console.log(res);
        this.eventEmitterService.updateData(res);
        // this.conversations = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getActiveConversations() {
    this.chatService.getActiveConversations(this.loggedInUser).subscribe(
      (res: any) => {
        res.forEach((conversation: any) => {
          conversation.lastMessage = '';
          conversation.image = 'https://via.placeholder.com/50x50';
        });
        this.conversations = res;
        console.log(this.conversations);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  selectConversationById(id: string, receiver: string) {
    this.currentReceiver = receiver;
    this.eventEmitterService.changeConversation(id, receiver);
  }

  // getConversationById(id: string, receiver: string) {
  //   this.currentReceiver = receiver;

  //   this.chatService
  //     .getConversationById(id, 1, this.loggedInUser, receiver)
  //     .subscribe(
  //       (res: any) => {
  //         console.log(res);
  //         this.eventEmitterService.updateData(id, res, receiver);
  //       },
  //       (error: any) => {
  //         console.log(error);
  //       }
  //     );
  // }

  searchQuery: string = '';

  // get filteredConversations(): Conversation[] {
  //   if (this.searchQuery.trim() === '') {
  //     return this.conversations;
  //   }

  //   const query = this.searchQuery.trim().toLowerCase();
  //   return this.conversations.filter((conversation) =>
  //     conversation.name.toLowerCase().includes(query)
  //   );
  // }

  createNewConversation(user: any) {
    for (const element of this.conversations) {
      if (element.name === user.username) {
        alert('Conversation already exists!');
        return;
      }
    }

    throw new Error('Method not implemented.');

    // this.chatService
    //   .createNewConversation(user.username, this.loggedInUser)
    //   .subscribe(
    //     (res: any) => {
    //       console.log(res);
    //       this.conversations.push({
    //         conversationId: res.conversationId,
    //         name: res.name,
    //         // lastMessage: '',
    //         // image: 'https://via.placeholder.com/50x50',
    //       });
    //     },
    //     (error: any) => {
    //       console.log(error);
    //     }
    //   );
  }

  closeResult = '';

  searchUser = '';

  searchUserList: any;

  searchUsers() {
    const query = this.searchUser.trim().toLowerCase();

    this.chatService.searchUsers(query).subscribe(
      (users) => {
        this.searchUserList = users;
        console.log(this.searchUserList);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  open(searchUserModal: any) {
    this.modalService
      .open(searchUserModal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
