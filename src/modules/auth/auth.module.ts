import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ShopifyApiModule } from '../shopify-api/shopify-api.module';

@Module({
  imports: [ShopifyApiModule],
  controllers: [AuthController],
})
export class AuthModule {}
