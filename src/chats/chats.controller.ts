import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../decorators/user.decorator';
import { UserFromReq } from '../users/users.controller';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @UseGuards(AuthGuard)
  @Get()
  getProjects(@User() user: UserFromReq) {
    return this.chatsService.getAllChats(user.sub);
  }
}
