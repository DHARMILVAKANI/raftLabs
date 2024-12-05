import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { connection } from 'src/database/database.module';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

declare module 'socket.io' {
  interface Socket {
    userId?: string;
    email?: string;
  }
}
@Injectable()
export class EventsService {
  userRepo: Repository<User>;
  constructor() {
    this.userRepo = connection.getRepository(User);
  }
  private server: Server;
  initializeServer(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.broadcast.emit('new-user', `${client.id} has joined the chat`);
  }

  handleDisconnect(client: Socket) {
    client.broadcast.emit('left-the-chat', `${client.id} has joined the chat`);
  }

  async handleMessage(data: any, client: Socket) {
    if (data) {
      const user = await this.userRepo.findOne({
        where: { id: client.userId },
        select: { firstName: true, lastName: true },
      });

      client.emit(
        'message',
        `Hello! ${
          user.firstName + ' ' + user.lastName
        }, Greeting from the server`,
      );
    }
  }
}
