import { NexonMongo } from '@module/module/core/mongo/mongo.provider';
import { DBEventNexon, DBEventNexonSchema } from '@module/module/core/mongo/schema/event.mongo.schema';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EventRepository {
    constructor(private readonly mongo: NexonMongo) {}

    async get(eventid: number) {
        const conn = await this.mongo.getGlobalConnecction();
        const model = conn.model(DBEventNexon.name, DBEventNexonSchema);

        const eventDoc = await model.find({ eventid }).lean();
        if (!eventDoc) {
            return;
        }

        return plainToInstance(DBEventNexon, eventDoc);
    }

    async upsertEvent(eventinfo: DBEventNexon) {
        if (!eventinfo._sync_to_db) return;
        delete eventinfo._sync_to_db;

        const con = await this.mongo.getGlobalConnecction();
        const model = con.model(DBEventNexon.name, DBEventNexonSchema);

        const resultDoc = await model.findOneAndUpdate({ eventid: eventinfo.eventid }, eventinfo, { new: true, upsert: true }).lean();

        if (!resultDoc) return false;

        return true;
    }
}
