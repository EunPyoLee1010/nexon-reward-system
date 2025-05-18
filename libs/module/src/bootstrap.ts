import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { NexonExceptionFilter } from './common/filter/exception.filter';
import { NexonHttpLogInterceptor } from './common/interceptor/log.interceptor';
import { NexonValidationPipe } from './common/validator/validation.pipe';
import { NexonConfig } from './core/config/config.service';
import { UserSession } from './type/session.type';

export function settingBootstrap(app: INestApplication, { config, prefix }: { config: NexonConfig; prefix?: string }) {
    app.enableCors({ credentials: true });
    app.use(cookieParser());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // json To class
    app.useGlobalPipes(new NexonValidationPipe()); // 유효성 검사와 그에 따른 예외 처리
    app.useGlobalInterceptors(new NexonHttpLogInterceptor()); // 요청 및 응답 로그
    app.useGlobalFilters(new NexonExceptionFilter(config)); // 예상하지 못한 예외 처리 및 에러 핸들링 추가 예정
    app.setGlobalPrefix(prefix);
    if (config.isDevMode()) createSwaggerDocs(app, prefix, config.getServerName());
    app.use(helmet());
    app.use(json({ limit: '1mb' }));

    app.use((req: Request, res: Response, next: NextFunction) => {
        req.session = UserSession.create(req, res);
        req.session.getRes().setEndpoint(req.originalUrl);

        next();
    });
}

export function createSwaggerDocs(app: INestApplication, prefix: string, serviceName: string) {
    const title = `${serviceName} API DOCS`;
    const description = `${serviceName} API 문서입니다.`;
    const version = '1.0';
    const iconLink = 'https://i.ibb.co/qksKLQz/App-60-3x.png';
    const options: SwaggerCustomOptions = {
        swaggerOptions: { defaultModelsExpandDepth: -1 },
        customSiteTitle: title,
        customfavIcon: iconLink,
        customCss: `
        .topbar-wrapper { content:url(${iconLink}); width:80px; height:auto; }
        .topbar-wrapper svg { visibility: hidden; }
        .swagger-ui .topbar { background-color: white; }
        `,
    };
    const config = new DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .setVersion(version)
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        })
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(prefix + '/docs', app, document, options);
}
