export class Chat {
    conversation: Conversation[];
}

export class User {
    id: string;
    name: string;
}

export class Conversation {
    interlocutor: User;
    messageList: Message[]
}

export class Message {
    text: string;
    sendDate: Date;
    sender: string;
    recipient: string;


}
