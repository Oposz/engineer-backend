import { Injectable, NotFoundException } from '@nestjs/common';
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

  async toggleLeaderFav(leaderId: string) {
    const leader = await this.prisma.leader.findUnique({
      where: {
        id: leaderId,
      },
    });

    if (!leader) {
      throw new NotFoundException('Leader not found');
    }

    return this.prisma.leader.update({
      where: {
        id: leaderId,
      },
      data: {
        favourite: !leader.favourite,
      },
    });
  }
}
