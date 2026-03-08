import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Dùng decorator này để bạn không cần import PrismaModule ở khắp nơi
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
