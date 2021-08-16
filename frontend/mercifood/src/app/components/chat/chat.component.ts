import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chat: Chat;
  
  constructor() { }

  ngOnInit(): void {
  }

}
