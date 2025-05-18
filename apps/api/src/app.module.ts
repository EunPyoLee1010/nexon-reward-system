import { ModuleModule } from '@module/module';
import { Module } from '@nestjs/common';
import { AuthModule } from './router/auth/auth.module';
import { EventModule } from './router/event/event.module';
import { RewardModule } from './router/reward/reward.module';

@Module({
    imports: [ModuleModule, AuthModule, EventModule, RewardModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
