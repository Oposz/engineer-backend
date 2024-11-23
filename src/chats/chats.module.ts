import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, JwtService],
})
export class ChatsModule {}
