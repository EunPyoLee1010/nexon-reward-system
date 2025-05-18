import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * 보상 정보 Schema
 */
@Schema({
    collection: 'doc_reward_info',
    versionKey: false,
    _id: false,
})
export class DBRewardNexon {
    @Prop({ required: true }) eventId: number;
    @Prop({ required: true }) type: number;
    @Prop({ required: true }) name: string;
    @Prop({ required: true }) grade: number;
    @Prop({ required: true }) amount: number;

    _sync_to_db?: boolean;

    create(type: number, name: string, grade: number, amount: number) {
        this.type = type;
        this.name = name;
        this.grade = grade;
        this.amount = amount;

        this._sync_to_db = true;

        return this;
    }
}

export const DBRewardNexonSchema = SchemaFactory.createForClass(DBRewardNexon).index({ type: 1 }, { name: 'idx_type' });
