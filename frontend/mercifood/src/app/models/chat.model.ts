import { MessageProps } from "../../../../../backend/api/mercifood/models/message.model";

export class Chat {
    conversation: Conversation[];
}

export class User {
    id: string;
    name: string;
}

export class Conversation {
    interlocutor: string;
    messageList: MessageProps[]
}

export class Message {
    text: string;
    sendDate: Date;
    sender: string;
    recipient: string;
}
