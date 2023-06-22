import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chat-app';


  messages: string[] = [];
  newMessage: string = '';

  constructor(private http: HttpClient){}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.http.get<string[]>('https://localhost:7078/chat').subscribe((response) => {
      this.messages = response;
    });
  }

  sendMessage() {
    const msg = {
      Message : this.newMessage
    }
    this.http.post('https://localhost:7078/chat', msg).subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }
}
