import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewMessageDto } from './schema/newMessageSchema';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  saveNewMessage(body: NewMessageDto, userId: string) {
    return this.prisma.message.create({
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
      },
    });
  }
}
