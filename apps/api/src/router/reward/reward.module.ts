import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard, JwtStrategy } from '../../common/guard/auth.guard';
import { AuthProvider } from '../auth/auth.provider';
import { EventProvider } from '../event/event.provider';
import { RewardController } from './reward.controller';

@Module({
    imports: [PassportModule, EventProvider, AuthProvider],
    controllers: [RewardController],
    providers: [JwtStrategy, JwtAuthGuard],
    exports: [EventProvider],
})
export class RewardModule {}
