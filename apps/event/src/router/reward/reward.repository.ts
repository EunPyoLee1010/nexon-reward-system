import { NexonMongo } from '@module/module/core/mongo/mongo.provider';
import { DBRewardNexon, DBRewardNexonSchema } from '@module/module/core/mongo/schema/reward.mongo.schema';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RewardRepository {
    constructor(private readonly mongo: NexonMongo) {}

    async getByEventId(eventid: number) {
        const conn = await this.mongo.getGlobalConnecction();
        const model = conn.model(DBRewardNexon.name, DBRewardNexonSchema);

        const rewardDoc = await model.find({ eventId: eventid }).lean();
        if (!rewardDoc) {
            return;
        }

        return plainToInstance(DBRewardNexon, rewardDoc);
    }

    async upsertReward(rewardinfo: DBRewardNexon) {
        if (!rewardinfo._sync_to_db) return;
        delete rewardinfo._sync_to_db;

        const con = await this.mongo.getGlobalConnecction();
        const model = con.model(DBRewardNexon.name, DBRewardNexonSchema);

        const resultDoc = await model.findOneAndUpdate(rewardinfo, rewardinfo, { new: true, upsert: true }).lean();

        if (!resultDoc) return false;

        return true;
    }
}
