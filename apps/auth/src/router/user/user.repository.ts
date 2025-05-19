import { NexonMongo } from '@module/module/core/mongo/mongo.provider';
import { DBUserNexon, DBUserNexonSchema } from '@module/module/core/mongo/schema/user.mongo.schema';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserRepository {
    constructor(private readonly mongo: NexonMongo) {}

    async findUser(userid: number) {
        const conn = await this.mongo.getUserConnectionByUserid(userid);
        const model = conn.model(DBUserNexon.name, DBUserNexonSchema);

        const userDoc = await model.findOne({ userid }).lean();
        if (!userDoc) {
            return;
        }

        return plainToInstance(DBUserNexon, userDoc);
    }

    async upsertUser(userinfo: DBUserNexon, now: Date) {
        if (!userinfo._sync_to_db) return;
        delete userinfo._sync_to_db;

        userinfo.updated_at = now;

        const con = await this.mongo.getUserConnectionByUserid(userinfo.userid);
        const model = con.model(DBUserNexon.name, DBUserNexonSchema);

        const resultDoc = await model.findOneAndUpdate({ userid: userinfo.userid }, userinfo, { new: true, upsert: true }).lean();

        if (!resultDoc) return false;

        return true;
    }
}
