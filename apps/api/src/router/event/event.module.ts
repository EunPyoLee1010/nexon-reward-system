import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard, JwtStrategy } from '../../common/guard/auth.guard';
import { AuthProvider } from '../auth/auth.provider';
import { EventController } from './event.controller';
import { EventProvider } from './event.provider';

@Module({
    imports: [PassportModule, EventProvider, AuthProvider],
    controllers: [EventController],
    providers: [JwtStrategy, JwtAuthGuard],
    exports: [EventProvider],
})
export class EventModule {}
