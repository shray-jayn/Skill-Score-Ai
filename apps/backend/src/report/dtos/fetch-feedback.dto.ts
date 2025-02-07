import { IsString } from 'class-validator';

export class FetchFeedbackDto {
  @IsString()
  roundId: string;
}