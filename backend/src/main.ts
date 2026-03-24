import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json, urlencoded } from 'express'; // Ye lines add karein

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🚀 IMPORTANT: Base64 images ke liye limit barhana zaroori hai
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // 1. CORS Configuration
  app.enableCors({
    origin: true, // true allows the origin from the request, effectively allowing any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-google-user-id', 'Portal', 'Accept', 'X-Requested-With'],
    credentials: true,
  });

  // 2. Static Files Setup
  // Using process.cwd() ensures it always looks at the project root 'uploads' folder
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // 3. Port Configuration
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Backend is running on: http://localhost:${port}`);
  console.log(`📡 CORS enabled for all origins (Development)`);
  console.log(`📂 Body Limit set to: 50MB (For Images)`);
}
bootstrap();