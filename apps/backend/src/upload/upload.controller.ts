import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CheckTeamNameDto } from './dtos/check-team-name.dto';
import { FetchSessionsDropdownDto } from './dtos/fetch-sessions-dropdown.dto';
import { GenerateSasDto } from './dtos/generate-sas.dto';
import { AuthGuard } from '@nestjs/passport';
import { CheckTeamNameResponse } from './interfaces/check-team-name.interface';
import { FetchSessionsDropdownResponse } from './interfaces/fetch-sessions-dropdown.interface';
import { GenerateSasResponse } from './interfaces/generate-sas.interface';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('teams/check-name')
  @HttpCode(HttpStatus.OK)
  async checkTeamName(@Body() checkTeamNameDto: CheckTeamNameDto): Promise<CheckTeamNameResponse> {
    return await this.uploadService.checkTeamName(checkTeamNameDto.teamName);
  }

  @Get('sessions/list')
  @HttpCode(HttpStatus.OK)
  async fetchSessionsDropdown(
    @Body() fetchSessionsDropdownDto: FetchSessionsDropdownDto
  ): Promise<FetchSessionsDropdownResponse> {
    return await this.uploadService.fetchSessionsDropdown(fetchSessionsDropdownDto.userId);
  }

  @Post('files/generate-upload-url')
  @HttpCode(HttpStatus.OK)
  async generateSas(@Body() generateSasDto: GenerateSasDto): Promise<GenerateSasResponse> {
    return await this.uploadService.generateSas(generateSasDto.filename);
  }
}
