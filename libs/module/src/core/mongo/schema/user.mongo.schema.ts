import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum ENUM_USER_ROLE {
    USER = parseInt('0001', 2),
    OPERATOR = parseInt('0010', 2),
    AUDITOR = parseInt('0100', 2),
    ADMIN = parseInt('1111', 2),
}

export enum ENUM_USER_ROLE_STRING {
    USER = 'USER',
    OPERATOR = 'OPERATOR',
    AUDITOR = 'AUDITOR',
    ADMIN = 'ADMIN',
}

/**
 * 유저 정보 Schema
 */
@Schema({
    collection: 'doc_user_info',
    versionKey: false,
    _id: false,
})
export class DBUserNexon {
    @Prop({ required: true }) userid: number;
    @Prop({ required: true }) name: string;

    @Prop({ required: true }) passwd_enc: string;
    @Prop({ required: true }) passwd_salt: string;

    @Prop() level: number;
    @Prop() exp: string;
    @Prop() meso: string;

    @Prop() quest: UserQuest[];
    @Prop() items: UserItem[];
    @Prop() invites: UserInvitation[];
    @Prop() login_history: { logined_at: Date }[];

    @Prop() created_at: Date;
    @Prop() logined_at: Date;
    @Prop() updated_at: Date;

    @Prop() role: ENUM_USER_ROLE;

    _sync_to_db?: boolean;

    create(userid: number, name: string, passwd_enc: string, passwd_salt: string, role: ENUM_USER_ROLE, now: Date) {
        this.userid = userid;
        this.name = name;

        this.passwd_enc = passwd_enc;
        this.passwd_salt = passwd_salt;

        this.level = 1;
        this.exp = '0';
        this.meso = '0';

        this.quest = [];
        this.items = [];
        this.invites = [];
        this.login_history = [];

        this.created_at = now;
        this.logined_at = now;
        this.updated_at = now;
        this._sync_to_db = true;

        this.role = role;

        return this;
    }
}

export class UserQuest {}

export class UserItem {}

export class UserInvitation {}

export const DBUserNexonSchema = SchemaFactory.createForClass(DBUserNexon).index({ userid: 1 }, { name: 'idx_userid' });

// 로그인 이벤트
// 연속 로그인 이벤트
// 레벨 달성 이벤트
// 퀘스트 달성 이벤트
// 친구 초대 이벤트
