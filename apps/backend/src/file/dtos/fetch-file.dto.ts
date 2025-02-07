import { IsString, IsOptional, IsNumber } from 'class-validator';

export class FetchFileDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}
