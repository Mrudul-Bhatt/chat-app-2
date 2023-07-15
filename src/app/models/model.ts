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

export interface MessagesByConversations {
  conversationId: string;
  username: string;
  userId: string;
  messages: Message[];
}
