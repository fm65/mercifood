import { MessageProps } from "./message.model";

export class Chat {
    conversation: Conversation[];

    constructor() {
        this.conversation = []
    }

}

export class User {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.name = name;
        this.id =id;
    }
}

export class Message {
    text: string;
    sendDate: string;
    sender?: string;
    recipient?: string;

    constructor(props: MessageProps, sender: any) {
        this.text = props.text;
        this.sendDate = props.sendDate;
        this.sender = sender;
        this.recipient = props.recipient;      
    }
}

export class Conversation {
    interlocutor: any;
    messageList: Message[]
    
    constructor(interlocutor: any) {
        this.interlocutor = interlocutor,
        this.messageList = []
    }
}