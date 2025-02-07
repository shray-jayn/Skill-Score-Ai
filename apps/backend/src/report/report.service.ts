// services/coaching.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FetchSessionsDto } from './dtos/fetch-sessions.dto';
import { FetchFeedbackDto } from './dtos/fetch-feedback.dto';

@Injectable()
export class CoachingService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchSessions(fetchSessionsDto: FetchSessionsDto) {
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

  async fetchFeedback(fetchFeedbackDto: FetchFeedbackDto) {
    try {
      const { roundId } = fetchFeedbackDto;
      const roundFeedback = await this.prisma.coachingRoundFeedback.findMany({ where: { coachingRoundId: roundId }, select: { feedbackImprovements: true } });
      const styleFeedback = await this.prisma.coachingStyleFeedback.findMany({ where: { coachingRoundId: roundId }, select: { coachingStyle: true, styleExplanation: true } });
      return { success: true, data: { roundFeedback, styleFeedback } };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching feedback');
    }
  }

  async fetchCoachingStyleStats(coachingRoundId: string) {
    try {
      const results = await Promise.all([
        this.prisma.coachingNumbers.findMany({ where: { coachingRoundId, round: 1 }, select: { coachingStyle: true, count: true, percentage: true } }),
        this.prisma.coachingNumbers.findMany({ where: { coachingRoundId, round: 2 }, select: { coachingStyle: true, count: true, percentage: true } }),
      ]);
      return { success: true, data: results };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching coaching style stats');
    }
  }

  async fetchCoachingStyleTimechart(roundId: string) {
    try {
      const timechart = await this.prisma.coachingStyleTimechart.findMany({ where: { coachingRoundId: roundId }, select: { coachingStyle: true, section: true, round: true } });
      if (!timechart.length) throw new NotFoundException('No data found');
      return { success: true, data: timechart };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching coaching style timechart');
    }
  }

  async fetchTranscriptions(coachingSessionName: string) {
    try {
      const session = await this.prisma.coachingSessions.findFirst({ where: { coachingSessionName, coacheeName: null }, select: { coachingRoundId: true } });
      if (!session) throw new NotFoundException('No matching coaching session found');
      const transcriptions = await this.prisma.transcriptionRaw.findMany({ where: { coachingRoundId: session.coachingRoundId }, select: { speakerId: true, transcribedText: true } });
      return { success: true, data: transcriptions };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching transcriptions');
    }
  }
}
