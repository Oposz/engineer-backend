import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewChatDto } from './schema/newChatSchema';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async getAllChats(userId: string) {
    const _ = require('lodash');

    const chats = await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: true,
        users: true,
      },
    });
    return chats.map((chat) => {
      return {
        ...chat,
        users: chat.users.map((user) => _.omit(user, ['password'])),
      };
    });
  }

  getChatById(chatId: string) {
    return this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: {
          select: {
            name: true,
            lastName: true,
            id: true,
          },
        },
        messages: true,
      },
    });
  }

  async createNewChat(body: NewChatDto, userId: string) {
    const allUsersConnectedToChat = [userId, ...body.users];
    const count = await this.prisma.user.count({
      where: {
        id: {
          in: allUsersConnectedToChat,
        },
      },
    });

    if (count !== allUsersConnectedToChat.length) {
      throw new NotFoundException('Some users do not exist');
    }

    return this.prisma.chat.create({
      data: {
        users: {
          connect: [{ id: userId }, ...body.users.map((id) => ({ id }))],
        },
      },
      include: {
        messages: true,
        users: {
          select: {
            name: true,
            lastName: true,
            id: true,
          },
        },
      },
    });
  }
}
