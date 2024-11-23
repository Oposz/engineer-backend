import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
