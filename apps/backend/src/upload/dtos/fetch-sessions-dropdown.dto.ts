import { IsNotEmpty, IsUUID } from 'class-validator';

export class FetchSessionsDropdownDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}