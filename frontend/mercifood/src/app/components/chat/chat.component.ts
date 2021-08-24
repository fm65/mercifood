import { Component, OnInit } from '@angular/core';
import { Conversation, User } from 'src/app/models/chat.model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { MessageService } from 'src/app/services/message.service';
import { MessageProps } from '../../../../../../backend/api/mercifood/models/message.model';
import { io } from 'socket.io-client';
import { UserProps } from '../../../../../../backend/api/mercifood/models/user.model';

const SOCKET_ENDPOINT = 'http://localhost:3001';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})


export class ChatComponent implements OnInit {
  socket: any;
  lastRecipient: string;
  lastConversation: Conversation;
  test: string;
  chat: Conversation[];
  users: string[];
  conversation: Conversation;
  interlocutors: string[];
  messages: MessageProps[];
  newMessage: "";
  currentUser: UserProps;
  message: MessageProps = {
    text: null,
    sendDate: null,
    recipient: null,
    sender: null
  };
  submitted = false;


  constructor(private tokenStorage: TokenStorageService, private messageService: MessageService) {
    if (this.tokenStorage.getToken()) {
      this.currentUser = this.tokenStorage.getUser();
    }
  }

  async ngOnInit() {
    this.sendMessage();
    this.setupSocketConnection();

    //effacer les messages lorsqu'on entamme une nouvelle discussion
    document.getElementById("recipient").addEventListener('input', this.updateInput.bind(this));
    this.conversation = { "interlocutor": "", "messageList": [] }
    this.retrieveConversations();
  }



  retrieveConversations(): void {
    this.messageService.getBy(this.currentUser.id)
      .subscribe(
        data => {
          this.chat = data.conversation;
        },
        error => {
          console.log(error);
        });
  }

  retriveMessages(): void {
    if (this.conversation !== undefined) {
      this.conversation.messageList.forEach(message => {
        if (this.currentUser.username == message.recipient) {

          const element = document.createElement('li');
          element.innerHTML = message.sender + ": " + message.text;

          const date = document.createElement('li');
          date.innerHTML = this.setDateString(new Date(message.sendDate));

          this.applyMessageStyle("recipient", element, date)
          document.getElementById('message-list').appendChild(element);
          document.getElementById('message-list').appendChild(date);

        } else if (this.currentUser.username == message.sender) {
          const element = document.createElement('li');
          element.innerHTML = message.text;

          const date = document.createElement('li');
          date.innerHTML = this.setDateString(new Date(message.sendDate));

          this.applyMessageStyle("sender", element, date)
          document.getElementById('message-list').appendChild(element);
          document.getElementById('message-list').appendChild(date);
          this.message.text = '';
        }
      });
    }
  }

  setActiveConversation(conversation: Conversation): void {
    this.conversation = conversation;
    var message_list = document.getElementById('message-list');
    while (message_list.firstChild) {
      message_list.removeChild(message_list.firstChild);
    }
    this.retriveMessages();
    this.retrieveConversations();
  }

  setupSocketConnection(): void {
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('message-broadcast', (data: MessageProps) => {

      if (data) {
        console.log(data)
        if (this.conversation === undefined)
          this.conversation = this.chat.find(conv => conv.interlocutor === data.sender);
        if (this.currentUser.username == data.recipient && this.conversation.interlocutor === data.sender) {
          const element = document.createElement('li');
          element.innerHTML = data.sender + ": " + data.text;

          const date = document.createElement('li');
          date.innerHTML = this.setDateString(new Date(data.sendDate));

          this.applyMessageStyle("recipient", element, date)
          document.getElementById('message-list').appendChild(element);
          document.getElementById('message-list').appendChild(date);

        }
        else {
          this.setActiveConversation(this.chat[this.chat.length - 1])
        }

      }
    });
  }

  setRecipient(): string {
    if (this.message.recipient !== "") {
      return this.message.recipient
    } else {
      if (this.conversation !== undefined) {
        return this.conversation.interlocutor
      } else {
        return this.lastRecipient
      }
    }
  }

  setDateString(date: Date): string {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
  }


  updateInput(): void {
    this.setActiveConversation({ "interlocutor": "", "messageList": [] });
  }

  sendMessage(): void {
    this.retrieveConversations();
    const data = {
      text: this.message.text,
      sendDate: new Date(),
      recipient: this.setRecipient(),
      sender: this.currentUser.username,
    };

    const element = document.createElement('li');
    element.innerHTML = this.message.text;

    const date = document.createElement('li');
    date.innerHTML = this.setDateString(data.sendDate);

    this.message.text = '';
    this.message.recipient = "",
      this.messageService.create(data)
        .subscribe(
          response => {
            this.setActiveConversation(this.chat.find(conv => conv.interlocutor === data.recipient));

            this.socket.emit('message', response);
            console.log(response);

            this.lastRecipient = data.recipient;
            this.submitted = true;

            this.applyMessageStyle("sender", element, date)
            document.getElementById('message-list').appendChild(element);
            document.getElementById('message-list').appendChild(date);
          },
          error => {
            console.log(error);
          });
  }

  applyMessageStyle(user: string, element: HTMLLIElement, date: HTMLLIElement): void {
    if (user == "recipient") {
      element.style.background = 'white';
      element.style.padding = '15px 30px';
      element.style.margin = '5px';
      element.style.width = 'fit-content';
      element.style.maxWidth = '200px';
      element.style.overflowWrap = 'break-word';
      element.style.borderRadius = '10px';

      date.style.fontSize = "10px";
      date.style.padding = '0px 10px';
      date.style.position = 'relative';

    } else if (user == "sender") {
      element.style.background = 'rgb(118, 189, 255)';
      element.style.color = 'white';
      element.style.padding = '15px 30px';
      element.style.margin = '5px';
      element.style.textAlign = 'right';
      element.style.width = 'fit-content';
      element.style.maxWidth = '200px';
      element.style.overflowWrap = 'break-word';
      element.style.borderRadius = '10px';
      element.style.left = '100%';
      element.style.position = 'relative'
      element.style.transform = 'translateX(-110%)';

      date.style.textAlign = 'right';
      date.style.fontSize = "10px";
      date.style.padding = '0px 10px';
      date.style.position = 'relative';
    }
  }
}
