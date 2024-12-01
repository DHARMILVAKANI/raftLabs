import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class EventsService {
  private server: Server;

  initializeServer(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleMessage(data: string) {
    if (data) this.server.emit('message', 'Hello from server!');
    return 'Message received on the server';
  }
}
