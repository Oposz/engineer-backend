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
        views: true,
      },
    });

    const sortedChats = _.orderBy(
      chats,
      [
        (chat) => {
          const latestMessage = _.maxBy(chat.messages, 'createdAt');
          return latestMessage ? latestMessage.createdAt : new Date(0);
        },
      ],
      ['desc'],
    );

    return sortedChats.map((chat) => {
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

  getChatWithUnseenMsg(userId: string, chatId: string) {
    return this.prisma.chat.findUnique({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        messages: {
          some: {
            new: true,
          },
        },
        id: chatId,
      },
      select: {
        id: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            content: true,
            userId: true,
            new: true,
            chatId: true,
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async markChatAsSeen(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found or user is not a member');
    }

    await this.prisma.chatView.upsert({
      where: {
        chatAndUserId: {
          chatId: chatId,
          userId: userId,
        },
      },
      update: {
        lastSeen: new Date(),
        updatedAt: new Date(),
      },
      create: {
        chatId: chatId,
        userId: userId,
        lastSeen: new Date(),
      },
    });
  }

  async changeChatName(chatId: string, userId: string, chatNewName: string) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    await this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        name: chatNewName,
      },
    });
  }
}
