import { IsNotEmpty, IsString } from 'class-validator';

export class CheckTeamNameDto {
  @IsString()
  @IsNotEmpty()
  teamName: string;
}