import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversitiesService {
  constructor(private prisma: PrismaService) {}

  getUniversities() {
    return this.prisma.university.findMany();
  }
}
