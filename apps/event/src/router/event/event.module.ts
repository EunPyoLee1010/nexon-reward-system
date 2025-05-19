import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';

@Module({
    imports: [],
    controllers: [EventController],
    providers: [EventService, EventRepository],
})
export class EventModule {}
