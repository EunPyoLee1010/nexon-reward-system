import { DBRewardNexon } from '@module/module/core/mongo/schema/reward.mongo.schema';
import { Injectable } from '@nestjs/common';
import { RewardRepository } from './reward.repository';

@Injectable()
export class RewardService {
    constructor(private readonly rewardRepo: RewardRepository) {}

    async getRewardInfo(eventid: number) {
        return this.rewardRepo.getByEventId(eventid);
    }

    async createReward(rewardInfo: DBRewardNexon) {
        return await this.rewardRepo.upsertReward(rewardInfo);
    }
}
