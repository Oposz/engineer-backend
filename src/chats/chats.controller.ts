import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../decorators/user.decorator';
import { UserFromReq } from '../users/users.controller';
import { ChatsService } from './chats.service';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import { NewChatDto, newChatSchema } from './schema/newChatSchema';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @UseGuards(AuthGuard)
  @Get()
  getChats(@User() user: UserFromReq) {
    return this.chatsService.getAllChats(user.sub);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getChatById(@Param('id') chatId: string) {
    return this.chatsService.getChatById(chatId);
  }

  @UseGuards(AuthGuard)
  @Post('new')
  startNewChat(
    @Body(new ZodValidationPipe(newChatSchema)) body: NewChatDto,
    @User() user: UserFromReq,
  ) {
    return this.chatsService.createNewChat(body, user.sub);
  }
}
