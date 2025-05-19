import { DBEventNexon } from '@module/module/core/mongo/schema/event.mongo.schema';
import { CREATE_EVENT_MSG_PATTERN, VIEW_EVENT_MSG_PATTERN } from '@module/module/define/command.constant';
import { CreateEventReqBean, EventInfoReqBean } from '@module/module/type/event.dto';
import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventService } from './event.service';

@Controller()
export class EventController {
    constructor(private readonly eventService: EventService) {}

    // 이벤트 조회
    @MessagePattern(VIEW_EVENT_MSG_PATTERN)
    async getEvent(@Body() { eventid }: EventInfoReqBean) {
        const event_list = await this.eventService.getEvent(eventid);
        return { statusCode: 200, result: true, event_list };
    }

    @MessagePattern(CREATE_EVENT_MSG_PATTERN)
    async createEvent(
        @Body() { title, description, started_at, ended_at, is_active, event_type, event_goal_type, event_goal_num }: CreateEventReqBean,
    ) {
        const now = new Date();
        const eventList = await this.eventService.getEvent();
        const nextEventId = Math.max(...eventList.map((v) => v.eventid), 0) + 1;
        const eventInfo = new DBEventNexon().create(
            nextEventId,
            title,
            description,
            event_type,
            event_goal_type,
            event_goal_num,
            now,
            new Date(started_at),
            new Date(ended_at),
        );

        const result = await this.eventService.createEvent(eventInfo);
        return { statusCode: 200, result, eventid: nextEventId };
    }
}
