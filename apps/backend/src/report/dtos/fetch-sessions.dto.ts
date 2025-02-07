import { IsString, IsOptional, IsNumber } from 'class-validator';

export class FetchSessionsDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}
