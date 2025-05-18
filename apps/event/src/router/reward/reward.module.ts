import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardRepository } from './reward.repository';
import { RewardService } from './reward.service';

@Module({
    imports: [],
    controllers: [RewardController],
    providers: [RewardService, RewardRepository],
})
export class RewardModule {}
