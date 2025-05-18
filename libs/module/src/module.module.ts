import { Global, Module } from '@nestjs/common';
import { NexonConfigModule } from './core/config/config.module';
// import { NexonMongoModule } from './core/mongo/mongo.module';
// import { CacheModule } from './core/redis/redis.module';

@Global()
@Module({
    //imports: [NexonConfigModule, NexonMongoModule, CacheModule],
    imports: [NexonConfigModule],
    providers: [],
    // exports: [NexonConfigModule, NexonMongoModule, CacheModule],
    exports: [NexonConfigModule],
})
export class ModuleModule {}
