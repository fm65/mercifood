import { ModelCtor } from "sequelize";
import { SequelizeManager } from "../models";
import { PlateCreationProps, PlateInstance } from "../models/plate.model";
import { Request, Response } from "express";
import { UserInstance } from "../models/user.model";
import { SessionInstance } from "../models/session.model";
import { getLoggedUser } from '../middlewares/auth.middleware';
import { MessageCreationProps, MessageInstance } from "../models/message.model";
import { Chat, Conversation, Message } from "../models/chat.model";


export class MessageController {

    Message: ModelCtor<MessageInstance>;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;

    private static instance: MessageController;

    public static async getInstance(): Promise<MessageController> {
        if (MessageController.instance === undefined) {
            const { Message, User, Session } = await SequelizeManager.getInstance();
            MessageController.instance = new MessageController(Message, User, Session);
        }
        return MessageController.instance;
    }

    private constructor(Message: ModelCtor<MessageInstance>, User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>) {
        this.Message = Message;
        this.User = User;
        this.Session = Session;
    }

    public async getAll(): Promise<MessageInstance[] | null> {

        const messages = await this.Message.findAll({
            attributes: ['id', 'text', 'sendDate', 'recipientId'],
            include: { model: this.User, attributes: ['id', 'username', 'firstname', 'lastname'] },
        });

        return messages;
    }

    // public async getBy(name: any): Promise<PlateInstance | null> {
    //     const id = parseInt(name);
    //     let plate;
    //     if (isNaN(id)) {
    //         plate = await this.Plate.findOne({ where: { name } })
    //     } else {
    //         plate = await this.Plate.findOne({ where: { id } })
    //     }
    //     if (plate !== null) {
    //         return plate;
    //     }
    //     return null;
    // }

    public async getByUser(id: any): Promise<Chat | null> {
        const messages = await this.Message.findAll({
            attributes: ['id', 'text', 'sendDate', 'recipient', 'sender', 'UserId'],
            include: { model: this.User, attributes: ['username', 'firstname', 'lastname'] },
        });
        
        const user  = await this.User.findOne({where: { id: id }});


        const messagesByUserID =  messages.filter(
            message => message.UserId=== parseInt(id) || message.recipient === user?.username);

        const mapConversations = this.getConversations(messagesByUserID, id);
   
        const chat = new Chat();
        
        mapConversations.forEach((value, key) => {
            
            chat.conversation.push(value);
        })
        
        return chat;
    }

    getConversations(messages: MessageInstance[], id: any): Map<string, Conversation> {
        const mapConversations: Map<any, Conversation> = new Map();
        const mapUsers: Map<number, string> = new Map();
        messages.forEach(async m => {
 
            let interlocutor;
            if (m.UserId == id && m.recipient) {
                interlocutor = m.recipient;
            } else {
                interlocutor = m.sender;
            }
            console.log(`interlocutor = ${interlocutor}`);

            if (interlocutor && m.sender) {
                if (!mapConversations.has(interlocutor)) {
                    mapConversations.set(interlocutor, new Conversation(interlocutor))
                } 
                mapConversations.get(interlocutor)?.messageList.push(new Message(m, m.sender));
            }
        });
        
        return mapConversations;
    }

    public async create(props: MessageCreationProps, recipientUsername: string, senderUsername: string, req: Request, res: Response): Promise<MessageInstance | null> {
        const sender = await getLoggedUser(req);
        if (sender === null || sender.username != senderUsername || sender.username == recipientUsername) {
            return null
        }
        

        const recipient  = await this.User.findOne({where: { username: recipientUsername }});
        if (recipient === null) {
            return null
        }

        const message = await this.Message.create(props);
        await message.setUser(sender);
        return message;
    }

}