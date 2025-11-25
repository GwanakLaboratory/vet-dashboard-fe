import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createServer } from 'http';
import { config } from './config/index';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logger = new Logger('Bootstrap');

async function bootstrap() {
    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
            logger: config.isDevelopment
                ? ['log', 'error', 'warn', 'debug', 'verbose']
                : ['error', 'warn', 'log'],
        });

        // Global exception filter
        app.useGlobalFilters(new AllExceptionsFilter());

        // Global logging interceptor (개발 환경에서만)
        if (config.isDevelopment) {
            app.useGlobalInterceptors(new LoggingInterceptor());
        }

        // Enable CORS
        app.enableCors({
            origin: config.cors.origin || '*',
            credentials: true,
        });

        // Global validation pipe
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: false,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            })
        );

        // Set global prefix for API routes
        app.setGlobalPrefix('api');

        // Get the underlying HTTP server
        const httpAdapter = app.getHttpAdapter();
        const expressApp = httpAdapter.getInstance();
        const httpServer = createServer(expressApp);

        // Setup Vite or static files
        if (config.isDevelopment) {
            const { setupVite } = await import('./vite.js');
            await setupVite(expressApp, httpServer);
            logger.log('Vite development server configured');
        } else {
            // Serve static files from the client build in production
            const clientPath = join(__dirname, 'public');
            app.useStaticAssets(clientPath);

            // For SPA routing - serve index.html for non-API routes
            expressApp.use((req: any, res: any, next: any) => {
                if (!req.path.startsWith('/api')) {
                    res.sendFile(join(clientPath, 'index.html'));
                } else {
                    next();
                }
            });
            logger.log('Static files configured');
        }

        await app.listen(config.port);
        logger.log(`🚀 Server running on http://localhost:${config.port}`);
        logger.log(`📝 Environment: ${config.nodeEnv}`);
        logger.log(`🔧 API endpoint: http://localhost:${config.port}/api`);
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

bootstrap();
