import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    let retries = 5;
    while (retries) {
      try {
        await this.$connect();
        console.log('Database connected successfully');
        break;
      } catch (error) {
        retries -= 1;
        console.error(`Database connection failed. Retrying... (${retries} attempts left)`);
        await new Promise(res => setTimeout(res, 5000)); // Delay before retrying
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
