import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsService } from 'src/utils/event.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private eventsService: EventsService) {}

  afterInit(server: Server) {
    this.eventsService.initializeServer(server);
  }

  handleConnection(client: Socket) {
    this.eventsService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.eventsService.handleDisconnect(client);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    console.log(data);
    return this.eventsService.handleMessage(data);
  }
}
