import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import { User } from '../decorators/user.decorator';
import { UserFromReq } from '../users/users.controller';
import { MessagesService } from './messages.service';
import { NewMessageDto, newMessageSchema } from './schema/newMessageSchema';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Get('unseen/:id')
  getChats(@User() user: UserFromReq, @Param('id') param: string) {
    return this.messagesService.getAllUnseenMessages(user.sub, param);
  }

  @UseGuards(AuthGuard)
  @Post('new')
  saveNewMessage(
    @Body(new ZodValidationPipe(newMessageSchema)) body: NewMessageDto,
    @User() user: UserFromReq,
  ) {
    return this.messagesService.saveNewMessage(body, user.sub);
  }
}
