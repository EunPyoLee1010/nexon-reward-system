import { Global, Module } from '@nestjs/common';
import { RedisModule } from '@songkeys/nestjs-redis';
import { NexonConfigModule } from '../config/config.module';
import { NexonConfigService } from '../config/config.service';
import { CacheService } from './redis.service';

@Global()
@Module({
    imports: [
        RedisModule.forRootAsync(
            {
                imports: [NexonConfigModule],
                inject: [NexonConfigService],
                useFactory: (config: NexonConfigService) => {
                    const { ip: host, port, user: username, passwd: password } = config.getConfig().getRedisConfig().global;
                    return { config: { host, port, username, password }, readyLog: true, errorLog: true };
                },
            },
            true,
        ),
    ],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
