export interface Conversation {
  conversationId: string;
  name: string;
  lastMessage: string;
  image: string;
}

export interface Message {
  sender: string;
  text: string;
}

export interface ConversationsAndMessages {
  conversationId: string;
  name: string;
  messages: Message[];
  unreadMessages: number;
}
