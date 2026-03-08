import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ShopifyService } from '../shopify-api/shopify-api.service';
// Import type từ fastify để code chuẩn hơn
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private shopifyService: ShopifyService) {}

  @Get()
  async auth(
    @Query('shop') shop: string,
    @Req() req: FastifyRequest, // Đổi kiểu dữ liệu
    @Res() res: FastifyReply, // Đổi kiểu dữ liệu
  ) {
    // Xóa session cũ của Fastify nếu có để làm sạch Cookie
    if (req.session) {
      req.session.destroy();
    }
    // SỬ DỤNG req.raw và res.raw
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.shopifyService.shopify.auth.begin({
      shop,
      callbackPath: '/auth/callback',
      isOnline: false,
      rawRequest: req.raw, // QUAN TRỌNG NHẤT
      rawResponse: res.raw, // QUAN TRỌNG NHẤT
    });
  }

  @Get('callback')
  async callback(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    try {
      // SỬ DỤNG req.raw và res.raw để Shopify tìm thấy Cookie
      const callback = await this.shopifyService.shopify.auth.callback({
        rawRequest: req.raw,
        rawResponse: res.raw,
      });

      const { session } = callback;

      console.log('Cài đặt thành công cho shop:', session.shop);
      console.log('Access Token:', session.accessToken);

      // Lưu ý: Với Fastify, khi đã dùng res.raw ở trên,
      // đôi khi bạn nên dùng res.raw để redirect hoặc res.redirect của Fastify
      const query = req.query as Record<string, string | undefined>;
      const host = query.host ?? '';
      return res.redirect(`/?shop=${session.shop}&host=${host}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('Lỗi OAuth Callback:', message);
      return res.status(500).send(message);
    }
  }
}
