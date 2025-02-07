import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FetchFileDto } from './dtos/fetch-file.dto';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchSessions(fetchSessionsDto: FetchFileDto) {
    try {
      const { userId, limit = 10, offset = 0 } = fetchSessionsDto;
      const sessions = await this.prisma.coachingSessions.findMany({
        where: { userId },
        take: limit,
        skip: offset,
        select: {
          coachingRoundId: true,
          coachingSessionName: true,
          coacheeName: true,
          date: true,
          round: true,
        },
      });
      if (!sessions.length) throw new NotFoundException('No sessions found');
      return { success: true, data: sessions, pagination: { limit, offset, count: sessions.length } };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching sessions');
    }
  }
}