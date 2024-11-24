import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, JwtService],
})
export class MessagesModule {}
