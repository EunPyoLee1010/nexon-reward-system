import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard, JwtStrategy } from '../../common/guard/auth.guard';
import { EventController } from './event.controller';
import { EventProvider } from './event.provider';

@Module({
    imports: [PassportModule, EventProvider],
    controllers: [EventController],
    providers: [JwtStrategy, JwtAuthGuard],
    exports: [EventProvider],
})
export class EventModule {}
