import {
    CHECK_ROLE,
    CREATE_EVENT_MSG_PATTERN,
    CREATE_REWARD_MSG_PATTERN,
    VIEW_EVENT_MSG_PATTERN,
    VIEW_REWARD_MSG_PATTERN,
} from '@module/module/define/command.constant';
import { CreateEventReqBean, EventInfoReqBean } from '@module/module/type/event.dto';
import { CreateRewardDto } from '@module/module/type/reward.dto';
import { UserSession } from '@module/module/type/session.type';
import { Body, Controller, Get, Inject, Param, Post, Session, SetMetadata, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../common/guard/auth.guard';
import { RoleGuard } from '../../common/guard/role.guard';

@Controller('event')
@UseGuards(JwtAuthGuard, RoleGuard)
export class EventController {
    constructor(@Inject('EVENT_SERVICE') private readonly authClient: ClientProxy) {}

    @Get()
    @SetMetadata(CHECK_ROLE, parseInt('0000', 2))
    async getEventList(@Session() session: UserSession) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(VIEW_EVENT_MSG_PATTERN, {});
        const eventRes = await firstValueFrom(response$);

        if (eventRes) {
            content.result = true;
            content.response_code = 200;
            content.event_list = eventRes.event_list;
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = 'error';
        }

        return res;
    }

    @Get(':eventid')
    @SetMetadata(CHECK_ROLE, parseInt('0000', 2))
    async getEventInfo(@Session() session: UserSession, @Param() { eventid }: EventInfoReqBean) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(VIEW_EVENT_MSG_PATTERN, { eventid });
        const eventRes = await firstValueFrom(response$);

        if (eventRes) {
            content.result = true;
            content.response_code = 200;
            content.event_list = eventRes.event_list;
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = 'error';
        }

        return res;
    }

    @Post()
    @SetMetadata(CHECK_ROLE, parseInt('1010', 2))
    async createEvent(@Session() session: UserSession, @Body() createEventInfo: CreateEventReqBean) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(CREATE_EVENT_MSG_PATTERN, createEventInfo);

        const createEventResult = await firstValueFrom(response$).catch((e) => console.log(e));

        if (createEventResult) {
            content.result = true;
            content.response_code = 200;
            content.eventid = createEventResult.eventid;
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = 'error';
        }

        return res;
    }

    @Get(':eventid/reward')
    @SetMetadata(CHECK_ROLE, parseInt('0000', 2))
    async getRewardInfo(@Session() session: UserSession, @Param('eventid') eventid: string) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(VIEW_REWARD_MSG_PATTERN, { eventid });
        const rewardRes = await firstValueFrom(response$).catch((e) => console.log(e));

        if (rewardRes) {
            content.result = true;
            content.response_code = 200;
            content.reward_list = rewardRes.reward_list;
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = 'error';
        }

        return res;
    }

    @Post('reward')
    @SetMetadata(CHECK_ROLE, parseInt('1010', 2))
    async createRewardInfo(@Session() session: UserSession, @Body() { eventid, name, type, grade, amount }: CreateRewardDto) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(CREATE_REWARD_MSG_PATTERN, { eventid, name, type, grade, amount });
        const rewardRes = await firstValueFrom(response$).catch((e) => console.log(e));

        if (rewardRes) {
            content.result = true;
            content.response_code = 200;
            content.eventid = rewardRes.eventid;
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = 'error';
        }

        return res;
    }
}
