import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * 이벤트 정보 Schema
 */
@Schema({
    collection: 'doc_event_info',
    versionKey: false,
    _id: false,
})
export class DBEventNexon {
    @Prop({ required: true }) eventid: number;
    @Prop({ required: true }) is_active: boolean;

    @Prop() title: string;
    @Prop() description?: string;

    @Prop() event_type: string;
    @Prop() event_goal_type: string;
    @Prop() event_goal_num: number;

    @Prop() started_at: Date;
    @Prop() ended_at: Date;

    _sync_to_db?: boolean;

    create(eventid: number, event_type: string, event_goal_type: string, event_goal_num: number, now: Date, started_at: Date, ended_at: Date) {
        this.eventid = eventid;
        this.is_active = now >= started_at && now <= ended_at;

        this.event_type = event_type;
        this.event_goal_type = event_goal_type;
        this.event_goal_num = event_goal_num;

        this.started_at = started_at;
        this.ended_at = ended_at;

        this._sync_to_db = true;

        return this;
    }
}

export const DBEventNexonSchema = SchemaFactory.createForClass(DBEventNexon).index({ eventid: 1 }, { name: 'idx_eventid' });
