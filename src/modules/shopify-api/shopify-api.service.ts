import { Injectable, OnModuleInit } from '@nestjs/common';
import { shopifyApi, Shopify, ApiVersion } from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShopifyService implements OnModuleInit {
  public shopify: Shopify;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('SHOPIFY_API_KEY') || '';
    const apiSecretKey =
      this.configService.get<string>('SHOPIFY_API_SECRET') || '';
    const scopesRaw = this.configService.get<string>('SHOPIFY_SCOPES');
    const scopes =
      scopesRaw && scopesRaw.length ? scopesRaw.split(',') : ['read_products'];
    const hostName = this.configService.get<string>('HOST') || 'localhost';
    const apiVersionRaw =
      this.configService.get<string>('SHOPIFY_API_VERSION') || '2023-10';
    const apiVersion = apiVersionRaw as unknown as ApiVersion;

    this.shopify = shopifyApi({
      apiKey,
      apiSecretKey,
      scopes,
      hostName,
      apiVersion,
      isEmbeddedApp: true,
    });
  }
}
