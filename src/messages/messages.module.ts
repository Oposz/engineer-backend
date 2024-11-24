import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';

@Module({
  controllers: [MessagesController],
  providers: [MessagesGateway, MessagesService, JwtService],
})
export class MessagesModule {}
