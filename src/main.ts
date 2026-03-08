import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';

async function bootstrap() {
  // 1. Khởi tạo app với Trust Proxy để Ngrok hoạt động đúng với HTTPS
  const adapter = new FastifyAdapter({ trustProxy: true });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const configService = app.get(ConfigService);
  const sessionSecret = configService.get<string>('SESSION_SECRET') ?? '';

  // Kiểm tra nếu quên chưa đặt secret trong .env
  if (sessionSecret.length < 32) {
    throw new Error(
      'SESSION_SECRET must be defined in .env and at least 32 characters long',
    );
  }

  // 2. Đăng ký Cookie
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await app.register(fastifyCookie as any);

  // 3. Đăng ký Session với các thông số bảo mật cho Iframe
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await app.register(fastifySession as any, {
    secret: sessionSecret,
    saveUninitialized: false,
    cookie: {
      sameSite: 'none', // Bắt buộc cho Shopify Embedded App
      secure: true, // Bắt buộc khi dùng sameSite: 'none'
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    },
  });

  app.enableCors();

  // Lắng nghe trên 0.0.0.0 để Docker có thể ánh xạ port
  await app.listen(3000, '0.0.0.0');
}

void bootstrap();
