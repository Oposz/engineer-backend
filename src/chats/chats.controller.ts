import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../decorators/user.decorator';
import { UserFromReq } from '../users/users.controller';
import { ChatsService } from './chats.service';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import { NewChatDto, newChatSchema } from './schema/newChatSchema';
import { ChatNewNameDto, chatNewNameSchema } from './schema/chatNewNameSchema';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @UseGuards(AuthGuard)
  @Get()
  getChats(@User() user: UserFromReq) {
    return this.chatsService.getAllChats(user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('new-messages/:id')
  getChatWithUnseenMsg(@User() user: UserFromReq, @Param('id') chatId: string) {
    return this.chatsService.getChatWithUnseenMsg(user.sub, chatId);
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

  @UseGuards(AuthGuard)
  @Patch('seen/:id')
  markAllMsgAsSeen(@Param('id') chatId: string, @User() user: UserFromReq) {
    return this.chatsService.markChatAsSeen(chatId, user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('name/:id')
  changeChatName(
    @Param('id') chatId: string,
    @User() user: UserFromReq,
    @Body(new ZodValidationPipe(chatNewNameSchema)) body: ChatNewNameDto,
  ) {
    return this.chatsService.changeChatName(chatId, user.sub, body.name);
  }
}
