import { DBEventNexon } from '@module/module/core/mongo/schema/event.mongo.schema';
import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
    constructor(private readonly eventRepo: EventRepository) {}

    async getEvent(eventid?: number) {
        return await this.eventRepo.get(eventid);
    }

    async createEvent(eventinfo: DBEventNexon) {
        return await this.eventRepo.upsertEvent(eventinfo);
    }
}
