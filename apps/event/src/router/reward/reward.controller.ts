import { DBRewardNexon } from '@module/module/core/mongo/schema/reward.mongo.schema';
import { CREATE_REWARD_MSG_PATTERN, VIEW_REWARD_MSG_PATTERN } from '@module/module/define/command.constant';
import { EventInfoReqBean } from '@module/module/type/event.dto';
import { CreateRewardDto } from '@module/module/type/reward.dto';
import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RewardService } from './reward.service';

@Controller()
export class RewardController {
    constructor(private readonly rewardService: RewardService) {}

    @MessagePattern(VIEW_REWARD_MSG_PATTERN)
    async getEvent(@Body() { eventid }: EventInfoReqBean) {
        if (!eventid) {
            return { statusCode: 200, result: true, reward_list: [] };
        }
        const reward_list = await this.rewardService.getRewardInfo(eventid);
        return { statusCode: 200, result: true, reward_list };
    }

    @MessagePattern(CREATE_REWARD_MSG_PATTERN)
    async createEvent(@Body() { eventid, name, type, grade, amount }: CreateRewardDto) {
        const rewardInfo = new DBRewardNexon().create(eventid, type, name, grade, amount);

        const result = await this.rewardService.createReward(rewardInfo);
        return { statusCode: 200, result, eventid };
    }
}
