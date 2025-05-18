import { Controller } from '@nestjs/common';
import { EventService } from './event.service';

@Controller()
export class EventController {
    constructor(private readonly eventService: EventService) {}
}
