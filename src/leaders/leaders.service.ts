import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadersService {
  constructor(private prisma: PrismaService) {}

  getAllLeaders() {
    return this.prisma.leader.findMany({
      include: {
        university: true,
      },
    });
  }
}
