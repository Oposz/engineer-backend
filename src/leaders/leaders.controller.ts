import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { LeadersService } from './leaders.service';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import {
  deleteManyLeaderSchema,
  DeleteManyLeadersDto,
} from './schemas/deleteManyLeadersSchema';
import {
  addNewLeaderSchema,
  AddNewLeadersDto,
} from './schemas/addNewLeaderSchema';

@Controller('leaders')
export class LeadersController {
  constructor(private leadersService: LeadersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAllLeaders() {
    return this.leadersService.getAllLeaders();
  }

  @UseGuards(AuthGuard)
  @Get('detailed')
  getAllDetailedLeaders() {
    return this.leadersService.getAllDetailedLeaders();
  }

  @UseGuards(AuthGuard)
  @Post('new')
  addNewLeader(
    @Body(new ZodValidationPipe(addNewLeaderSchema)) body: AddNewLeadersDto,
  ) {
    return this.leadersService.addNewLeader(body);
  }

  @UseGuards(AuthGuard)
  @Patch('edit/:id')
  editLeader(
    @Body(new ZodValidationPipe(addNewLeaderSchema)) body: AddNewLeadersDto,
    @Param('id') param: string,
  ) {
    return this.leadersService.editLeader(body, param);
  }

  @UseGuards(AuthGuard)
  @Patch('favourite/:id')
  toggleLeaderFav(@Param('id') param: string) {
    return this.leadersService.toggleLeaderFav(param);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  deleteLeader(@Param('id') param: string) {
    return this.leadersService.deleteLeader(param);
  }

  @UseGuards(AuthGuard)
  @Patch('delete-many')
  deleteLeaders(
    @Body(new ZodValidationPipe(deleteManyLeaderSchema))
    body: DeleteManyLeadersDto,
  ) {
    return this.leadersService.deleteManyLeaders(body);
  }
}
