import { FactoryProvider } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { NexonConfigService } from '../config/config.service';

export class NexonMongo {
    private readonly globalConnKey = 'global';
    private readonly userShardConnKey = 'user';
    private connMap: Record<string, Connection> = {};

    constructor(private readonly config: NexonConfigService) {}

    async init() {
        const { global, user } = this.config.getConfig().getMongoConfig();

        // 글로벌 커넥션 설정
        const host = `mongodb://${global.ip}:${global.port}/${global.db_name}`;
        const gConn = mongoose.createConnection(host, {
            user: global.user,
            pass: global.passwd,
            maxPoolSize: global.max_pool_size,
            minPoolSize: global.min_pool_size,
            tls: global.use_tls,
            directConnection: true,
            retryWrites: false,
        });

        this.connMap[this.globalConnKey] = gConn;

        // 유저 커넥션 설정
        for (const u of user) {
            const host = `mongodb://${u.ip}:${u.port}/${u.db_name}`;
            const uConn = mongoose.createConnection(host, {
                user: u.user,
                pass: u.passwd,
                maxPoolSize: u.max_pool_size,
                minPoolSize: u.min_pool_size,
                tls: u.use_tls,
                directConnection: true,
                retryWrites: false,
            });

            this.connMap[`${this.userShardConnKey}_${u.shard}`] = uConn;
        }
    }
}

export const MongoProvider: FactoryProvider = {
    provide: NexonMongo,
    useFactory: async (config: NexonConfigService) => {
        const mongo = new NexonMongo(config);
        await mongo.init();
        return mongo;
    },
    inject: [NexonConfigService],
};
