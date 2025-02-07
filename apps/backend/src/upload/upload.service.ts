import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckTeamNameResponse } from './interfaces/check-team-name.interface';
import { FetchSessionsDropdownResponse } from './interfaces/fetch-sessions-dropdown.interface';
import { GenerateSasResponse } from './interfaces/generate-sas.interface';
import { MESSAGES } from './constants/messages';
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

  async checkTeamName(teamName: string): Promise<CheckTeamNameResponse> {
    try {
      const teamExists = await this.prisma.coachingSessions.findFirst({
        where: { coachingSessionName: teamName },
      });

      return { exists: !!teamExists };
    } catch (error) {
      console.error('Error checking team name:', error);
      throw new InternalServerErrorException(MESSAGES.INTERNAL_ERROR);
    }
  }

  async fetchSessionsDropdown(userId: string): Promise<FetchSessionsDropdownResponse> {
    try {
      const sessions = await this.prisma.coachingSessions.findMany({
        where: { userId },
        select: {
          coachingRoundId: true,
          coachingSessionName: true,
          coacheeName1: true,
          coacheeName2: true,
          coacheeName3: true,
          date: true,
          round: true,
        },
      });

      if (sessions.length === 0) {
        throw new NotFoundException(MESSAGES.NO_SESSIONS_FOUND);
      }

      return { sessions };
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw new InternalServerErrorException(MESSAGES.INTERNAL_ERROR);
    }
  }

  async generateSas(filename: string): Promise<GenerateSasResponse> {
    try { 
        const accountName = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_NAME');
        const accountKey = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_KEY');
        const containerName = this.configService.get<string>('CONTAINER_NAME');
                
      if (!accountName || !accountKey || !containerName) {
        throw new InternalServerErrorException('Azure Storage credentials are missing.');
      }

      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
      const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      const blobName = `${uuidv4()}-${filename}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse('racwd'),
        startsOn: new Date(),
        expiresOn: new Date(new Date().getTime() + 60 * 60 * 1000),
      }, sharedKeyCredential).toString();

      return {
        sasUrl: `${blockBlobClient.url}?${sasToken}`,
        blobUrl: blockBlobClient.url,
      };
    } catch (error) {
      console.error('Error generating SAS URL:', error);
      throw new InternalServerErrorException(MESSAGES.INTERNAL_ERROR);
    }
  }
}
