import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/guards/auth.guard';
import { EventsService } from 'src/utils/event.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(AuthGuard)
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
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    return this.eventsService.handleMessage(data, client);
  }
}
