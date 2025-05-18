import { Injectable } from '@nestjs/common';
import { RewardRepository } from './reward.repository';

@Injectable()
export class RewardService {
    constructor(private readonly rewardRepo: RewardRepository) {}
}
