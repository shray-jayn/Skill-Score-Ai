import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, UploadModule, ReportModule], 
  controllers: [],
  providers: [],
})
export class AppModule {}
