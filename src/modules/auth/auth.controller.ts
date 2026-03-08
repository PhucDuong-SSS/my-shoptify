import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ShopifyService } from '../shopify-api/shopify-api.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private shopifyService: ShopifyService) {}

  // Bắt đầu cài đặt: /auth?shop=nestjs-graphql-lab.myshopify.com
  @Get()
  async auth(
    @Query('shop') shop: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.shopifyService.shopify.auth.begin({
      shop,
      callbackPath: '/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
  }

  // Nhận kết quả từ Shopify
  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    try {
      const callback = await this.shopifyService.shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });

      const { session } = callback;

      // TODO: Viết logic lưu session vào Database dùng Prisma ở đây
      console.log('Cài đặt thành công cho shop:', session.shop);
      console.log('Access Token:', session.accessToken);

      // Chuyển hướng về trang chủ App bên trong Shopify Admin
      const rawHost = req.query.host;
      const host = typeof rawHost === 'string' ? rawHost : '';
      return res.redirect(`/?shop=${session.shop}&host=${host}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      return res.status(500).send(message);
    }
  }
}
