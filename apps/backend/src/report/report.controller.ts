import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CoachingService } from './report.service';
import { FetchSessionsDto } from './dtos/fetch-sessions.dto';
import { FetchFeedbackDto } from './dtos/fetch-feedback.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('coaching')
@UseGuards(AuthGuard('jwt'))
export class CoachingController {
  constructor(private readonly coachingService: CoachingService) {}

  @Post('fetch-sessions')
  @HttpCode(HttpStatus.OK)
  async fetchSessions(@Body() fetchSessionsDto: FetchSessionsDto) {
    return await this.coachingService.fetchSessions(fetchSessionsDto);
  }

  @Post('fetch-feedback')
  @HttpCode(HttpStatus.OK)
  async fetchFeedback(@Body() fetchFeedbackDto: FetchFeedbackDto) {
    return await this.coachingService.fetchFeedback(fetchFeedbackDto);
  }

  @Get('coaching-style-stats/:coachingRoundId')
  @HttpCode(HttpStatus.OK)
  async fetchCoachingStyleStats(@Param('coachingRoundId') coachingRoundId: string) {
    return await this.coachingService.fetchCoachingStyleStats(coachingRoundId);
  }

  @Get('coaching-style-timechart/:roundId')
  @HttpCode(HttpStatus.OK)
  async fetchCoachingStyleTimechart(@Param('roundId') roundId: string) {
    return await this.coachingService.fetchCoachingStyleTimechart(roundId);
  }

  @Get('transcriptions/:coachingSessionName')
  @HttpCode(HttpStatus.OK)
  async fetchTranscriptions(@Param('coachingSessionName') coachingSessionName: string) {
    return await this.coachingService.fetchTranscriptions(coachingSessionName);
  }
}