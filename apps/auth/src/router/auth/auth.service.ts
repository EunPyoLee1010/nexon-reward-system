import { NexonConfigService } from '@module/module/core/config/config.service';
import { DBUserNexon, ENUM_USER_ROLE, ENUM_USER_ROLE_STRING } from '@module/module/core/mongo/schema/user.mongo.schema';
import { UserLoginReqDto, UserRegisterReqDto } from '@module/module/type/auth.dto';
import { Injectable } from '@nestjs/common';
import { pbkdf2Sync, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
    constructor(private readonly config: NexonConfigService, private readonly userRepo: UserRepository) {}

    // 로그인
    async signInUser({ userid, passwd }: UserLoginReqDto) {
        const user = await this.userRepo.findUser(userid);
        if (user) {
            const { passwd_enc, passwd_salt, userid, name } = user;
            const passwdEnc = pbkdf2Sync(passwd, passwd_salt, 101096, 64, 'sha512').toString('base64');
            if (passwdEnc === passwd_enc) {
                return { userid, name };
            }
        }
        return undefined;
    }

    // 계정 생성
    async signUpUser({ userid, name, passwd, role }: UserRegisterReqDto, now: Date) {
        const passwdSalt = randomBytes(64).toString('base64');
        const passwdEnc = pbkdf2Sync(passwd, passwdSalt, 101096, 64, 'sha512').toString('base64');
        const roleEnum = this.getRoleFromString(role);

        const userInfo = new DBUserNexon().create(userid, name, passwdEnc, passwdSalt, roleEnum, now);
        const result = await this.userRepo.upsertUser(userInfo, now);
        return result && { userid, name };
    }

    createJwtToken(userInfo: { userid: number; name: string }) {
        const { jwt_secret, issuer } = this.config.getConfig().getJwtConfig();
        const { userid, name } = userInfo;
        const token = jwt.sign({ userid, name }, jwt_secret, { expiresIn: '3h', issuer });

        return token;
    }

    async isUserExist(userid: number) {
        const user = await this.userRepo.findUser(userid);
        return user !== undefined;
    }

    async getUserRole(userid: number) {
        const user = await this.userRepo.findUser(userid);
        return user?.role;
    }

    getRoleFromString(role?: ENUM_USER_ROLE_STRING) {
        switch (role) {
            case ENUM_USER_ROLE_STRING.OPERATOR:
                return ENUM_USER_ROLE.OPERATOR;
            case ENUM_USER_ROLE_STRING.AUDITOR:
                return ENUM_USER_ROLE.AUDITOR;
            case ENUM_USER_ROLE_STRING.ADMIN:
                return ENUM_USER_ROLE.ADMIN;
            case ENUM_USER_ROLE_STRING.USER:
            default:
                return ENUM_USER_ROLE.USER;
        }
    }
}
