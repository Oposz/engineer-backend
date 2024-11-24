import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessagesGateway.name);
  private userIdToSocketId: Map<string, AuthenticatedSocket> = new Map();

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('authenticate')
  handleAuthentication(client: AuthenticatedSocket, userId: string) {
    try {
      client.userId = userId;

      this.userIdToSocketId.set(userId, client);

      this.logger.log(`User ${userId} authenticated with socket ${client.id}`);

      return { status: 'authenticated', userId };
    } catch (error) {
      this.logger.error(`Authentication failed for socket ${client.id}`, error);
      return { status: 'error', message: 'Authentication failed' };
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client id: ${client.id} connected`);
  }

  notifyAboutNewMessage(usersToNotify: string[]) {
    for (const user of usersToNotify) {
      const socket = this.userIdToSocketId.get(user);
      socket?.emit('newMessage');
    }
  }

  notifyAboutNewMessagesInChat(usersToNotify: string[], updateChatId: string) {
    for (const user of usersToNotify) {
      const socket = this.userIdToSocketId.get(user);
      socket?.emit('newMessageInChat', updateChatId);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (!client.userId) return;
    this.userIdToSocketId.delete(client.userId);

    this.logger.log(`User disconnected from socket ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', timestamp: new Date() };
  }
}
