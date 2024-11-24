import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewMessageDto } from './schema/newMessageSchema';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private messagesGateway: MessagesGateway,
  ) {}

  async saveNewMessage(body: NewMessageDto, userId: string) {
    const message = await this.prisma.message.create({
      data: {
        new: body.new,
        userId: userId,
        content: body.message,
        chatId: body.chatId,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        chat: {
          select: {
            id: true,
            users: {
              where: {
                id: {
                  not: userId,
                },
              },
            },
          },
        },
      },
    });
    const usersToNotify = message.chat.users.map((user) => user.id);
    this.messagesGateway.notifyAboutNewMessage(usersToNotify);
    this.messagesGateway.notifyAboutNewMessagesInChat(
      usersToNotify,
      message.chatId,
    );
    return message;
  }

  async getAllUnseenMessages(userId: string, chatId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId: chatId,
        userId: {
          not: userId,
        },
        new: true,
      },
    });

    await this.prisma.message.updateMany({
      where: {
        chatId: chatId,
        new: true,
      },
      data: {
        new: false,
      },
    });

    return messages;
  }
}
