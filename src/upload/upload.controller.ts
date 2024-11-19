import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('upload')
export class UploadController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const upload = await this.prisma.upload.create({
      data: {
        data: file.buffer.toString('base64'),
      },
    });

    return { id: upload.id };
  }
}
