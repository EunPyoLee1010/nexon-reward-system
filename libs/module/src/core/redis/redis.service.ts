import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis, { RedisKey } from 'ioredis';
import { NexonConfigService } from '../config/config.service';
import { TConfigModeType } from '../config/config.type';

@Injectable()
export class CacheService implements OnApplicationBootstrap {
    private readonly mode: TConfigModeType;

    constructor(@InjectRedis() private readonly redis: Redis, private readonly config: NexonConfigService) {
        this.mode = this.config.getConfig().getMode();
    }

    async onApplicationBootstrap() {
        const redisKeyList = await this.keys('*');
        await this.del(...redisKeyList).then(async (v) => {
            Logger.debug('Redis Key 초기화를 완료했습니다.');
        });
    }

    async keys(pattern: string) {
        return await this.redis.keys(pattern);
    }

    async get(key: RedisKey) {
        const value = await this.redis.get(key);
        try {
            if (value === null) return undefined;
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    async set(key: RedisKey, value: any, ttl?: number) {
        try {
            const isExists = await this.redis.exists(key);
            if (isExists === 1) {
                await this.del(key);
            }
            if (typeof value === 'object') return await this.hmset(key, value);
            ttl ? await this.redis.set(key, value, 'EX', ttl) : await this.redis.set(key, value);
            return true;
        } catch {
            return false;
        }
    }

    async nxset(key: RedisKey, value: any) {
        try {
            const result = await this.redis.setnx(key, value);
            return result === 1;
        } catch (e) {
            return false;
        }
    }

    async del(...redisKey: RedisKey[]) {
        try {
            await this.redis.del(redisKey);
            return true;
        } catch {
            return false;
        }
    }

    async hmset(key: RedisKey, value: object) {
        try {
            const isExists = await this.redis.exists(key);
            if (isExists === 1) {
                await this.del(key);
            }
            await this.redis.hmset(key, value);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async hmget(key: RedisKey, ...fields: any) {
        try {
            const data = await this.redis.hmget(key, fields);
            return data;
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    async hgetall(key: RedisKey) {
        try {
            const data = await this.redis.hgetall(key);
            return data;
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    async hdel(key: RedisKey, ...fields: any) {
        try {
            await this.redis.hdel(key, fields ?? '*');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async expire(key: RedisKey, seconds: string | number) {
        try {
            await this.redis.expire(key, seconds);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    getUserRefreshTokenKey(userId: string) {
        return `${this.mode}:refresh-token:user:${userId}`;
    }

    getUserLockKey(userId: string) {
        return `${this.mode}:lock:user:${userId}`;
    }
}
