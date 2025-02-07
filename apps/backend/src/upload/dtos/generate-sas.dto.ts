import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class GenerateSasDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^<>:"/\\|?*]+$/, { message: 'Filename contains invalid characters' })
  filename: string;
}