import { NexonMongo } from '@module/module/core/mongo/mongo.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventRepository {
    constructor(private readonly mongo: NexonMongo) {}
}
