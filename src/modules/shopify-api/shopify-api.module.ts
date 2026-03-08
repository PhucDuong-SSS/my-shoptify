import { Module } from '@nestjs/common';
import { ShopifyService } from './shopify-api.service';

@Module({
  providers: [ShopifyService],
  exports: [ShopifyService],
})
export class ShopifyApiModule {}
