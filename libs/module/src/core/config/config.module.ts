import { Module } from '@nestjs/common';
import { NexonConfigService } from './config.service';

@Module({
    providers: [NexonConfigService],
    exports: [NexonConfigService],
})
export class NexonConfigModule {}
