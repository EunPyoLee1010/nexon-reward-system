import { settingBootstrap } from '@module/module/bootstrap';
import { NexonConfigService } from '@module/module/core/config/config.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(NexonConfigService).getConfig();
    const mode = config.getMode();
    const { port } = config.getServerConfig();

    settingBootstrap(app, { config, prefix: 'api' });
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(port, '0.0.0.0').then(async (v) => {
        if (process.send) process.send('ready');
        const service = config.getServerName();
        Logger.log(`[${mode}] ${service}가 시작됐습니다. url=${await app.getUrl()}`);
    });
}
bootstrap();
