import { Module } from '@nestjs/common';
import { CoachingController } from './report.controller';
import { CoachingService } from './report.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CoachingController],
  providers: [CoachingService]
})
export class ReportModule {}
