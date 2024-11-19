import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UploadController } from './upload.controller';

@Module({
  providers: [JwtService],
  controllers: [UploadController],
})
export class UploadModule {}
