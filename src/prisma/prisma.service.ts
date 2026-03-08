import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Kết nối đến Database khi Module được khởi tạo
    await this.$connect();
  }

  async onModuleDestroy() {
    // Ngắt kết nối khi ứng dụng tắt
    await this.$disconnect();
  }
}
