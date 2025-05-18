import { NexonConfigService } from '@module/module/core/config/config.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const config = appContext.get(NexonConfigService).getConfig();
    const mode = config.getMode();
    const { host, port } = config.getServerConfig();

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.TCP,
        options: { host, port },
    });
    await app.listen().then(async (v) => {
        if (process.send) process.send('ready');
        const service = config.getServerName();
        Logger.log(`[${mode}] ${service}가 시작됐습니다. url=${host}:${port}`);
    });
}
bootstrap();
