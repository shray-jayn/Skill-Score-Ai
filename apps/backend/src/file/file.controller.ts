import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { FileService } from './file.service';
import { FetchFileDto } from './dtos/fetch-file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('fetch-sessions')
  @HttpCode(HttpStatus.OK)
  async fetchSessions(@Body() fetchSessionsDto: FetchFileDto) {
    return await this.fileService.fetchSessions(fetchSessionsDto);
  }
}